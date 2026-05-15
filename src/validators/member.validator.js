const Joi = require("joi");

const createMemberSchema = Joi.object({
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().optional(),
  phone: Joi.string().optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  dateOfBirth: Joi.date().optional(),
  address: Joi.string().optional(),
  memberStatus: Joi.string()
    .valid("active", "inactive", "visitor", "transferred")
    .optional(),
  fellowshipId: Joi.string().optional(),
  joinDate: Joi.date().optional(),
});

const updateMemberSchema = createMemberSchema.fork(
  ["firstName", "lastName"],
  (field) => field.optional(),
);

module.exports = { createMemberSchema, updateMemberSchema };


