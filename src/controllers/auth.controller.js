const authService = require("../services/auth.service");
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
} = require("../validators/auth.validator");

const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const user = await authService.register(req.body);
    return res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully.",
    });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    const tokens = await authService.login(req.body);
    return res.status(200).json({ success: true, data: tokens });
  } catch (err) {
    return res.status(401).json({ success: false, error: err.message });
  }
};

const refresh = (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(400)
        .json({ success: false, error: "Refresh token required." });

    const result = authService.refresh({ refreshToken });
    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid or expired refresh token." });
  }
};

const logout = (req, res) => {
  // Stateless JWT — client discards token
  // Extend here to blacklist token in Redis if needed in future
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
};

const changePassword = async (req, res) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error)
      return res
        .status(400)
        .json({ success: false, error: error.details[0].message });

    await authService.changePassword(req.user._id, req.body);
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

module.exports = { register, login, refresh, logout, changePassword };
