require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/User"); // adjust path if needed

const resetSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove old seeded admin accounts
    await User.deleteMany({
      email: process.env.ADMIN_EMAIL,
    });

    console.log("Old admin removed");

    // Hash password
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );

    // Create new super admin
    const superAdmin = await User.create({
      firstName: "System",
      lastName: "Administrator",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "super_admin",
      isActive: true,
    });

    console.log("Super admin created");
    console.log({
      id: superAdmin._id,
      email: superAdmin.email,
      role: superAdmin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

resetSuperAdmin();