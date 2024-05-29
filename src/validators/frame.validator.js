const Joi = require("joi");

class FrameValidator {
  static generateFrames() {
    return Joi.object({
      sceneId: Joi.string().required(),
    });
  }
}

module.exports = { FrameValidator };
