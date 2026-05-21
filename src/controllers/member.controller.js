const memberService = require("../services/member.service");
const uploadToCloud = require("../utils/uploadToCloud");
const {
  createMemberSchema,
  updateMemberSchema,
} = require("../validators/member.validator");

const getMembers = async (req, res) => {
  try {
    const result = await memberService.getAllMembers(req.query);
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

const getMember = async (req, res) => {
  try {
    const member = await memberService.getMemberById(req.params.id);
    return res.status(200).json({ success: true, data: member });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const createMember = async (req, res) => {
  try {
    const { error } = createMemberSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    let profileImageUrl = null;
    if (req.file) {
      const uploaded = await uploadToCloud(req.file.buffer, "chms-profiles");
      profileImageUrl = uploaded.url;
    }

    const member = await memberService.createMember(req.body, profileImageUrl);
    return res.status(201).json({ success: true, data: member });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const updateMember = async (req, res) => {
  try {
    const { error } = updateMemberSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const member = await memberService.updateMember(req.params.id, req.body);
    return res.status(200).json({ success: true, data: member });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const deleteMember = async (req, res) => {
  try {
    await memberService.deleteMember(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Member deactivated." });
  } catch (err) {
    return res.status(404).json({ success: false, error: err.message });
  }
};

const getMemberAttendance = async (req, res) => {
  try {
    const result = await memberService.getMemberAttendance(
      req.params.id,
      req.query,
    );
    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
  getMemberAttendance,
};
