const contributionService = require("../services/contribution.service");
const { contributionSchema } = require("../validators/finance.validator");

const createContribution = async (req, res) => {
  try {
    const { error } = contributionSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const contribution = await contributionService.createContribution(
      req.body,
      req.user._id,
    );
    return res.status(201).json({ success: true, data: contribution });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const getContributions = async (req, res) => {
  try {
    const result = await contributionService.getAllContributions(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getFinanceSummary = async (req, res) => {
  try {
    const result = await contributionService.getFinanceSummary(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { createContribution, getContributions, getFinanceSummary };
