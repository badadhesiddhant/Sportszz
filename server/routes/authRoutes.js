const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../Modal/User");
const Superadminmodel = require("../Modal/Superadminmodel");
const Manager = require("../Modal/Manager");
require("dotenv").config();
const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "aakash7536@gmail.com", // Your email
    pass: "tmcj fbnn lffr cspa", // Your email password or app password
  },
});

// login user
router.post("/register", async (req, res) => {
  const { name, email, mobile, password, role, age, website, members } =
    req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      mobile,
      password,
      role,
      age,
      website,
      members,
      isApproved: role === "Club" || role === "Organization" ? false : true,
    });

    await user.save();

    if (user.isApproved) {
      const payload = { userId: user.id };
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "1h" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, message: "Registration successful" });
        }
      );
    } else {
      res.json({ message: "Registration successful, waiting for approval" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});
//login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isApproved) {
      return res.status(403).json({ message: "User not approved yet" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
});

//superadmin login
router.post("/superadminlogin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Superadminmodel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.json({ success: true, token });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create Manager endpoint
router.post("/managers", async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if a manager with the given email already exists
    const existingManager = await Manager.findOne({ email });
    if (existingManager) {
      return res.status(400).json({ error: "Email is already in use." });
    }

    // If no existing manager, proceed with creating the new one
    const hashedPassword = await bcrypt.hash(password, 10);
    const newManager = new Manager({ name, email, password: hashedPassword });

    await newManager.save();

    // Define the deep link for the manager login
    const managerLoginLink = `sportszz://manager-login?email=${encodeURIComponent(
      email
    )}`;

    // Sending the email
    const mailOptions = {
      from: '"BCS" <aakash7536@gmail.com>', // Update with your company name and email
      to: email,
      subject: "Manager Account Credentials",
      text: `Dear ${name},\n\nWe are pleased to inform you that you have been added as a Manager in our system.\n\nPlease find your account details below:\n\nEmail: ${email}\nPassword: ${password}\n\nTo log in to your account, please click on the following link:\n${managerLoginLink}\n\nIf you have any questions or need further assistance, feel free to reach out to our support team.\n\nBest regards,\nThe BCS Team`,
      html: `<p>Dear ${name},</p>
             <p>We are pleased to inform you that you have been added as a Manager in our system.</p>
             <p>Please find your account details below:</p>
             <p><strong>Email:</strong> ${email}<br>
                <strong>Password:</strong> ${password}</p>
             <p>To log in to your account, please click on the following link:</p>
             <p><a href="${managerLoginLink}">Login to your Manager Account</a></p>
             <p>If you have any questions or need further assistance, feel free to reach out to our support team.</p>
             <p>Best regards,<br>
             The BCS Team</p>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Manager added and email sent!" });
  } catch (error) {
    console.error("Error adding manager or sending email:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Fetching all managers
router.get("/club-admin/managers", async (req, res) => {
  try {
    const managers = await Manager.find();
    res.status(200).json(managers);
  } catch (error) {
    console.error("Error fetching managers:", error); // Log the error
    res.status(500).json({ message: "Error fetching managers", error });
  }
});

// Activate or Deactivate Manager
router.put("/managers/:id/activate", async (req, res) => {
  const { isActive } = req.body;

  try {
    const manager = await Manager.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ error: "Manager not found" });
    }

    manager.isActive = isActive; // Update the isActive status
    await manager.save(); // Save changes to the database

    res.status(200).json({
      message: `Manager ${isActive ? "activated" : "deactivated"} successfully`,
    });
  } catch (error) {
    console.error("Error activating/deactivating manager:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete Manager Endpoint
router.delete("/managers/:id", async (req, res) => {
  try {
    const managerId = req.params.id;

    // Find the manager by ID and delete it
    const deletedManager = await Manager.findByIdAndDelete(managerId);

    // Check if the manager was found and deleted
    if (!deletedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Manager deleted successfully" });
  } catch (error) {
    console.error("Error deleting manager:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the manager" });
  }
});

module.exports = router;
