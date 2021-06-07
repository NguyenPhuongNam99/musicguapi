const Joi = require("joi");

module.exports.signupValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().trim(),
    password: Joi.string().min(8).max(16).trim(),
    accountType: Joi.string()
      .valid("facebook", "google", "system")
      .default("system"),
    profileType: Joi.string().valid("free", "premium").default("free"),
    status: Joi.string().valid("public", "private", "close").default("public"),
    socialAuthorization: Joi.string().trim().default(null),
    fullName: Joi.string().trim().default(null),
    youtubeAccount: Joi.string().trim().default(null),
    createdAt: Joi.date().default(new Date()),
    updatedAt: Joi.date().default(new Date()),
    avatar: {
      path: Joi.string().trim(),
      alt: Joi.string().trim(),
      size: Joi.number().min(0),
      createdAt: Joi.date().default(new Date()),
      updatedAt: Joi.date().default(new Date()),
    },
  });
  return schema.validate(data);
};
