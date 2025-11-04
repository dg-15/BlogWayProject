import jwt from "jsonwebtoken";
// import crypto from "crypto";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
// import nodemailer from "nodemailer";
import { transporter } from "../utils/mail.js";


// Helper: Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      // don't reveal whether email exists in production — but for dev, return 404
      return res.status(404).json({ message: "User not found" });
    }

    // Create token (contains user id). Short expiry is safer (e.g., 1 hour)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Reset link - frontend route will handle the reset UI
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${user._id}/${token}`;

    // send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email, // send to the account email
      subject: "BlogWay - Password reset",
      text: `You requested a password reset. Click the link to reset your password:\n\n${resetLink}\n\nIf you didn't request this, ignore this email.`,
      html: `<p>You requested a password reset. Click the link to reset your password:</p>
             <p><a href="${resetLink}">${resetLink}</a></p>
             <p>If you didn't request this, ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Reset link sent to email" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    // verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_secret_key"
    );

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update user
    const user = await User.findByIdAndUpdate(
      decoded.id, // use decoded.id instead of id param (safer)
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
