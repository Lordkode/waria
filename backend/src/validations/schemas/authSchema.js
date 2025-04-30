const Joi = require("joi");

class AuthSchemas {
  static register() {
    return Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Email must be valid !",
        "any.required": "Email is required !",
      }),

      password: Joi.string().min(8).required().messages({
        "string.min": "Password must contain min 8 charcters !",
        "any.required": "Password is required !",
      }),

      username: Joi.string().required(),
      fullName: Joi.string().required(),
      companyName: Joi.string().required(),
      companyRegistrationNumber: Joi.string().required(),
    });
  }

  static login() {
    return Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
  }

  static activateAccount() {
    return Joi.object({
      email: Joi.string().email().required(),
      code: Joi.string().length(6).required(),
    });
  }
}

module.exports = AuthSchemas;
