const bcrypt = require("bcryptjs");
const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/jwt");

const register = async ({
  firstName,
  lastName,
  email,
  password,
  role,
  phone,
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already registered.");

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    phone,
  });

  // Never return the password
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.isActive) throw new Error("Invalid credentials.");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials.");

  const payload = { id: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.lastLogin = new Date();
  await user.save();

  return { accessToken, refreshToken, user };
};

const refresh = ({ refreshToken }) => {
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  const accessToken = generateAccessToken({
    id: decoded.id,
    role: decoded.role,
  });
  return { accessToken };
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new Error("User not found.");

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) throw new Error("Old password is incorrect.");

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
};

module.exports = { register, login, refresh, changePassword };
