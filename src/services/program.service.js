const Program = require("../models/Program");

const getAllPrograms = async ({ page = 1, limit = 20, type }) => {
  const filter = { isActive: true };
  if (type) filter.type = type;
  const skip = (page - 1) * limit;
  const total = await Program.countDocuments(filter);
  const data = await Program.find(filter)
    .populate("coordinatorId", "firstName lastName role")
    .sort({ startDate: -1 })
    .skip(skip)
    .limit(Number(limit));
  return { total, page: Number(page), limit: Number(limit), data };
};

const getProgramById = async (id) => {
  const program = await Program.findOne({ _id: id, isActive: true })
    .populate("coordinatorId", "firstName lastName role")
    .populate("sessions.facilitator", "firstName lastName");
  if (!program) throw new Error("Program not found.");
  return program;
};

const createProgram = async (data) => Program.create(data);

const updateProgram = async (id, data) => {
  const program = await Program.findOneAndUpdate(
    { _id: id, isActive: true },
    data,
    { new: true, runValidators: true },
  );
  if (!program) throw new Error("Program not found.");
  return program;
};

const deleteProgram = async (id) => {
  const program = await Program.findOneAndUpdate(
    { _id: id, isActive: true },
    { isActive: false },
    { new: true },
  );
  if (!program) throw new Error("Program not found.");
};


const addSession = async (programId, sessionData) => {
  const program = await Program.findOne({ _id: programId, isActive: true });
  if (!program) throw new Error("Program not found.");

  // Validate sessionNumber is unique within this program
  const duplicate = program.sessions.find(
    (s) => s.sessionNumber === sessionData.sessionNumber,
  );
  if (duplicate) {
    throw new Error(
      `Session number ${sessionData.sessionNumber} already exists in this program.`,
    );
  }

  program.sessions.push(sessionData);
  await program.save();
  return program;
};

// Add to exports
module.exports = {
  getAllPrograms,
  getProgramById,
  createProgram,
  updateProgram,
  deleteProgram,
  addSession,
};