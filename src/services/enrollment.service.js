const ProgramEnrollment = require("../models/ProgramEnrollment");
const Program = require("../models/Program");
const Member = require("../models/Member");

const enrollMember = async (programId, memberId) => {
  // Validate program exists and is active
  const program = await Program.findOne({ _id: programId, isActive: true });
  if (!program) throw new Error("Program not found.");

  // Validate member exists
  const member = await Member.findOne({ _id: memberId, isActive: true });
  if (!member) throw new Error("Member not found or inactive.");

  // Check maxParticipants limit
  if (program.maxParticipants) {
    const currentCount = await ProgramEnrollment.countDocuments({ programId });
    if (currentCount >= program.maxParticipants) {
      throw new Error(
        `Program is full. Maximum participants: ${program.maxParticipants}.`,
      );
    }
  }

  // Prevent duplicate enrollment — compound unique index will also catch this
  try {
    const enrollment = await ProgramEnrollment.create({ programId, memberId });
    return enrollment;
  } catch (err) {
    if (err.code === 11000)
      throw new Error("Member is already enrolled in this program.");
    throw err;
  }
};

const getParticipants = async (programId, { page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const total = await ProgramEnrollment.countDocuments({ programId });
  const data = await ProgramEnrollment.find({ programId })
    .populate("memberId", "firstName lastName phone memberStatus")
    .sort({ enrolledAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

module.exports = { enrollMember, getParticipants };
