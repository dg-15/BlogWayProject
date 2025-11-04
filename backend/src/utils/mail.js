// backend/src/utils/mail.js
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// console.log("Email user:", process.env.EMAIL_USER);
console.log("Email pass:", process.env.EMAIL_PASS ? "Loaded ✅" : "❌ Missing");