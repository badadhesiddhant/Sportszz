const mongoose = require("mongoose");

const managerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Trims whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensures emails are unique
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Basic email format validation
    },
    password: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt fields

const Manager = mongoose.model("Manager", managerSchema);
module.exports = Manager;
