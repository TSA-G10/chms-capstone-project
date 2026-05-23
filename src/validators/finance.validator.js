const Joi = require("joi");

const contributionSchema = Joi.object({
  eventId: Joi.string().required(),
  date: Joi.date().required(),
  category: Joi.string()
    .valid("tithe", "offering", "donation", "special")
    .required(),
  channel: Joi.string().valid("cash", "transfer", "pos", "online").required(),
  totalAmount: Joi.number().min(0).required(),
  currency: Joi.string().default("NGN"),
  notes: Joi.string().optional().allow(""),
  // memberId is intentionally absent — never accepted on this endpoint
});

const expenseSchema = Joi.object({
  title: Joi.string().trim().required(),
  category: Joi.string()
    .valid(
      "operations",
      "welfare",
      "missions",
      "programs",
      "maintenance",
      "other",
    )
    .required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().default("NGN"),
  date: Joi.date().required(),
  vendorId: Joi.string().optional(),
  notes: Joi.string().optional().allow(""),
});

module.exports = { contributionSchema, expenseSchema };
