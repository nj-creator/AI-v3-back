const { default: axios } = require("axios");
const ResponseInterceptor = require("../interceptors/response.interceptor");
const { Scene } = require("../models/scene.model");
const { Character } = require("../models/character.model");
const { logger } = require("../config/logger.config");
const { Frame } = require("../models/frame.model");

class SceneController {
  static async createScene(req, res) {
    const response = new ResponseInterceptor(res);

    try {
      const {
        title,
        script,
        location,
        genre,
        colorType,
        framesNumber,
        projectId,
      } = req.body;

      const data = await axios.post(
        "http://k8s-modelser-modelser-19b211bd7a-107069329.ap-south-1.elb.amazonaws.com/extract_details",
        {
          script,
          location,
          genre,
          num_frames: Number(framesNumber),
        },
        { timeout: 900000 }
      );

      const scene = await Scene.create({
        title,
        script,
        location,
        genre,
        colorType,
        framesNumber: data?.data?.scenes.length,
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        project: projectId,
        response: data?.data?.scenes,
      });

      if (data?.data?.characters.length > 0) {
        data?.data?.characters.map(async (item) => {
          const characterExist = await Character.find({
            $and: [{ character_id: item.character_id }, { project: projectId }],
          });

          if (characterExist.length <= 0) {
            await Character.create({ ...item, project: projectId });
          }
        });
      }

      logger.info(`Scene id ${scene._id} is generated`);

      return response.ok({ sceneId: scene._id });
    } catch (error) {
      console.log(error, "generate scene error");
      logger.error(error?.message || "generate scene prompts error");
      return response.internalServerError();
    }
  }

  static async getScenes(req, res) {
    const response = new ResponseInterceptor(res);
    try {
      const { projectId } = req.query;
      const { userId } = req.user;

      const scenes = await Scene.find({ project: projectId }).select(
        "-response"
      );

      for (const scene of scenes) {
        if (!scene.thumbnail || scene.thumbnail === "") {
          const frame = await Frame.find({ scene: scene._id });

          if (
            frame &&
            frame.length > 0 &&
            frame[0].framesUrl &&
            frame[0].framesUrl.length > 0
          ) {
            scene.thumbnail = frame[0].framesUrl[0];

            await scene.save();
          }
        }
      }

      logger.info(`${scenes.length} scenes found for the user ${userId}`);

      return response.ok(scenes);
    } catch (error) {
      console.log(error, "get scenes error");
      logger.error(error?.message || "get scenes error");

      return response.internalServerError();
    }
  }

  static async getSceneDetails(req, res) {
    const response = new ResponseInterceptor(res);
    try {
      const { sceneId } = req.query;
      const sceneExist = await Scene.findById(sceneId).select("-response");

      if (sceneExist) {
        return response.ok(sceneExist);
      } else {
        return response.badRequest("No scene found for the given id");
      }
    } catch (error) {
      logger.log(
        error?.message || "Error occured while getting the scene details"
      );
      return response.internalServerError();
    }
  }
}

module.exports = { SceneController };
