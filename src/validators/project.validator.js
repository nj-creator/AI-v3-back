const Joi = require("joi");

class ProjectValidator {
  static createProject() {
    return Joi.object({
      name: Joi.string().required(),
      style: Joi.string().required(),
      aspectRatio: Joi.string().required(),
    });
  }
}

module.exports = { ProjectValidator };
