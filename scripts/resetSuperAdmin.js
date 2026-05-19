require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../src/models/User"); // adjust path if needed

const resetSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Remove old seeded admin accounts
<<<<<<< Updated upstream
    await User.deleteMany({
      email: process.env.ADMIN_EMAIL,
    });

    console.log("Old admin removed");

    // Hash password
    const hashedPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      10
    );
=======
    await User.deleteMany({ role: "super_admin" });

    console.log("All super_admins removed");

    // Hash password
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
=======
    const all = await User.find({ role: "super_admin" }).select(
      "email role _id",
    );
    console.log("All super_admins in DB:", all);

    const check = await User.findOne({ email: process.env.ADMIN_EMAIL });
    console.log(
      "DB verify:",
      check
        ? { id: check._id, email: check.email, role: check.role }
        : "NOT FOUND",
    );

>>>>>>> Stashed changes
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

<<<<<<< Updated upstream
resetSuperAdmin();
=======
resetSuperAdmin();
>>>>>>> Stashed changes
