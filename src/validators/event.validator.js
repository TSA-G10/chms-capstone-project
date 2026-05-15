const Joi = require("joi");

const createEventSchema = Joi.object({
  title: Joi.string().trim().required(),
  type: Joi.string()
    .valid("service", "ceremony", "special", "fellowship")
    .required(),
  description: Joi.string().optional().allow(""),
  date: Joi.date().required(),
  startTime: Joi.string().optional(),
  endTime: Joi.string().optional(),
  location: Joi.string().optional(),
});

const updateEventSchema = createEventSchema.fork(
  ["title", "type", "date"],
  (field) => field.optional(),
);

module.exports = { createEventSchema, updateEventSchema };
