const Joi = require("joi");

class UserValidator {
  static descopeFunction() {
    return Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      uniqueId: Joi.string().required(),
    });
  }
}

module.exports = { UserValidator };
