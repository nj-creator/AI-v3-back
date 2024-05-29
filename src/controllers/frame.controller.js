const { default: axios } = require("axios");
const { logger } = require("../config/logger.config");
const ResponseInterceptor = require("../interceptors/response.interceptor");
const { Character } = require("../models/character.model");
const { Scene } = require("../models/scene.model");
const { uploadBase64ImageToS3 } = require("../utils/base64toS3");
const { User } = require("../models/user.model");
const { io } = require("../config/server.config");
const { Frame } = require("../models/frame.model");

const { default: axiosRetry } = require("axios-retry");

axiosRetry(axios, {
  retries: 3, // Number of retry attempts
  retryDelay: axiosRetry.exponentialDelay, // Exponential backoff delay between retries
});

class FrameController {
  static async generateFrames(req, res) {
    const response = new ResponseInterceptor(res);

    try {
      const { sceneId } = req.query;

      const { userId } = req.user;

      const sceneExist = await Scene.findById(sceneId);

      if (sceneExist) {
        const isFrameExist = await Frame.find({ scene: sceneId });

        if (isFrameExist.length > 0) {
          return response.ok({ data: isFrameExist, generatingFrames: false });
        } else {
          generateFramesImage(
            sceneId,
            userId,
            sceneExist,
            sceneExist.location,
            sceneExist.genre,
            sceneExist.colorType
          );
          return response.created({
            data: [],
            generatingFrames: true,
            generatedFramesNumber: sceneExist.response.length,
            message: "generating the frames",
          });
        }
      } else {
        return response.badRequest("No scene found!");
      }
    } catch (error) {
      logger.error(error?.message || "generate frames error");
    }
  }
  static async regeneratedFrames(req, res) {
    const response = new ResponseInterceptor(res);
    try {
      const request = req.body;
      const isFrameExist = await Frame.findById(request.frame_id);
      if (isFrameExist) {
        var body = {
          base_image: request.baseImage,
          mask_image: request.maskImage,
          inpainting_prompt: request.prompt,
          inpaint_action: request.inpainting_action,
          parameters: {
            positive_prompt: "",
            negative_prompt:
              "Watermark, Text, censored, deformed, bad anatomy, disfigured, poorly drawn face, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, disconnected head, malformed hands, long neck, mutated hands and fingers, bad hands, missing fingers, cropped, worst quality, low quality, mutation, poorly drawn, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, missing fingers, fused fingers, abnormal eye proportion, Abnormal hands, abnormal legs, abnormal feet, abnormal fingers, three hands, three legs, three fingers, three feet, fused face, cloned face, worst face, extra eyes, 2 girl, amputation, cartoon, CG, 3D, unreal, animated.",
            height: request.height,
            width: request.width,
            num_inference_steps: 30,
            guidance_scale: 7.5,
            seed: 0,
          },
        };
        const data = await axios.post(
          "http://k8s-modelser-modelser-19b211bd7a-107069329.ap-south-1.elb.amazonaws.com/inpaint_scene",
          body
        );

        const responAws = await uploadBase64ImageToS3(
          data?.data?.data,
          `${request.frame_id}_regenerated_${
            isFrameExist.framesUrl.length + 1
          }.jpeg`
        );
        console.log(responAws, "aws res");
        await Frame.findByIdAndUpdate(request.frame_id, {
          $push: { framesUrl: responAws },
        });
        return response.ok(responAws);
      } else {
        response.badRequest("no frames found");
      }
    } catch (error) {
      console.log(error, "regenerate frame error");
      logger.error(error?.message);
      response.internalServerError(
        error.message || "error occured while regenrating frames"
      );
    }
  }
}

const generateFramesImage = async (
  sceneId,
  userId,
  sceneExist,
  location,
  genre,
  colorType
) => {
  const allCharacters = await Character.find({
    project: sceneExist.project,
  });

  const user = await User.findById(userId);

  let indexNumber = 0;

  for (const element of sceneExist.response) {
    try {
      indexNumber += 1;

      const scriptCharacter = allCharacters.filter((character) => {
        return element.character_expressions.some(
          (item) => item.character_id === character.character_id
        );
      });

      const response = await axios.post(
        "http://k8s-modelser-modelser-19b211bd7a-107069329.ap-south-1.elb.amazonaws.com/generate_scene",
        {
          scene: element,
          characters: scriptCharacter,
          parameters: {
            positive_prompt: "",
            negative_prompt:
              " Watermark, Text, censored, deformed, bad anatomy, disfigured, poorly drawn face, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, disconnected head, malformed hands, long neck, mutated hands and fingers, bad hands, missing fingers, cropped, worst quality, low quality, mutation, poorly drawn, huge calf, bad hands, fused hand, missing hand, disappearing arms, disappearing thigh, disappearing calf, disappearing legs, missing fingers, fused fingers, abnormal eye proportion, Abnormal hands, abnormal legs, abnormal feet, abnormal fingers, three hands, three legs, three fingers, three feet, fused face, cloned face, worst face, extra eyes, 2 girl, amputation, cartoon, CG, 3D, unreal, animated.",
            height: 1024,
            width: 1024,
          },
        },
        { timeout: 900000 }
      );

      const responAws = await uploadBase64ImageToS3(
        response?.data?.result?.data,
        `${sceneId}_${indexNumber}.jpeg`
      );

      const generatedFrame = await Frame.create({
        prompt: response?.data?.prompt,
        colorType,
        genre,
        location,
        framesUrl: [responAws],
        scene: sceneId,
      });

      io.to(user.socketId).emit("frameGenerated", generatedFrame);

      if (indexNumber === sceneExist.response.length) {
        io.to(user.socketId).emit("frameGenerationCompleted", {
          generationCompleted: true,
        });
      }
    } catch (error) {
      console.log(error, "generate frame image error");
      logger.error(error?.message || "generate frame error");
    }
  }
};

module.exports = { FrameController };