const Joi = require("joi");

const registerSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string()
    .valid(
      "super_admin",
      "admin",
      "pastor",
      "finance_officer",
      "welfare_officer",
      "staff",
      "volunteer",
      "member", 
    )
    .required(),
  phone: Joi.string().optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required(),
});

module.exports = { registerSchema, loginSchema, changePasswordSchema };
