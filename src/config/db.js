// src/config/db.js

const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;
const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);

    // Log connection details
    console.log(`MongoDB connected on port ${PORT}`);
    console.log(`Connected to MongoDB at ${mongoURI}`);
    console.log("Database:", mongoose.connection.name);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
