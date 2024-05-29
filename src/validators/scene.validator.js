const Joi = require("joi");

class SceneValidator {
  static createScene() {
    return Joi.object({
      title: Joi.string().required(),
      script: Joi.string().required(),
      genre: Joi.string().required(),
      location: Joi.string().allow(""),
      framesNumber: Joi.number().required(),
      colorType: Joi.string().required(),
      projectId: Joi.string().required(),
    });
  }
  static getScene() {
    return Joi.object({
      projectId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          "string.pattern.base": "projectId must be a valid MongoDB ObjectId",
        }),
    });
  }
  static getSceneDetails() {
    return Joi.object({
      sceneId: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
          "string.pattern.base": "sceneId must be a valid MongoDB ObjectId",
        }),
    });
  }
}

module.exports = { SceneValidator };
