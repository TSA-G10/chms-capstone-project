const enrollmentService = require("../services/enrollment.service");

const enrollMember = async (req, res) => {
  try {
    const { memberId } = req.body;
    if (!memberId)
      return res
        .status(400)
        .json({ success: false, error: "memberId is required." });

    const enrollment = await enrollmentService.enrollMember(
      req.params.id,
      memberId,
    );
    return res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    const status =
      err.message.includes("full") || err.message.includes("already enrolled")
        ? 400
        : 500;
    return res.status(status).json({ success: false, error: err.message });
  }
};

const getParticipants = async (req, res) => {
  try {
    const result = await enrollmentService.getParticipants(
      req.params.id,
      req.query,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { enrollMember, getParticipants };
