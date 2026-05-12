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
```

Create `src/services/contribution.service.js`:

```js
const ServiceContribution = require("../models/ServiceContribution");

const createContribution = async (data, userId) => {
  // Explicitly strip any memberId if somehow present — defence in depth
  const { memberId, ...safeData } = data;
  return ServiceContribution.create({ ...safeData, recordedBy: userId });
};

const getAllContributions = async ({
  page = 1,
  limit = 20,
  date,
  category,
  channel,
  from,
  to,
}) => {
  const filter = {};
  if (category) filter.category = category;
  if (channel) filter.channel = channel;
  if (date) filter.date = new Date(date);
  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const total = await ServiceContribution.countDocuments(filter);
  const data = await ServiceContribution.find(filter)
    .populate("eventId", "title date type")
    .populate("recordedBy", "firstName lastName")
    .sort({ date: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = { createContribution, getAllContributions };