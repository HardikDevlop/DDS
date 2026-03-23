import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

// ─── Email transporter ────────────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Must be a Gmail App Password, not your login password
    },
  });
}

// ─── Signup ───────────────────────────────────────────────────────────────────
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomBytes(3).toString("hex"); // 6-char hex code

    // ✅ SAVE USER FIRST — email failure must never block account creation
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
      isVerified: false,
    });
    await user.save();

    // ✅ Attempt to send verification email — log failure but don't crash
    let emailSent = false;
    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"DDS Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Verify your email — DDS",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f0f4ff;border-radius:16px;">
            <h2 style="color:#1e3a8a;margin-bottom:8px;">Verify your email</h2>
            <p style="color:#334155;margin-bottom:24px;">Hello <strong>${name}</strong>, use the code below to verify your account.</p>
            <div style="background:#fff;border:1px solid #dde5f4;border-radius:12px;padding:24px;text-align:center;">
              <p style="font-size:32px;font-weight:800;letter-spacing:0.2em;color:#2563eb;margin:0;">${verificationCode}</p>
            </div>
            <p style="color:#64748b;font-size:12px;margin-top:20px;">This code expires in 24 hours. If you didn't sign up, ignore this email.</p>
          </div>
        `,
      });
      emailSent = true;
      console.log(`✅ Verification email sent to ${email}`);
    } catch (mailErr) {
      // Email failed — user is already saved, they can still verify manually or resend
      console.error("❌ Verification email failed (user still created):", mailErr.message);
    }

    return res.status(200).json({
      message: emailSent
        ? "Signup successful. Verification code sent to your email."
        : "Signup successful. We couldn't send the email right now — please contact support.",
      emailSent,
    });

  } catch (err) {
    console.error("❌ Signup Error:", err);
    res.status(500).json({ message: "Signup failed.", error: err.message });
  }
};

// ─── Verify Email ─────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified. Please log in." });
    }
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully. You can now log in." });
  } catch (err) {
    console.error("❌ Verify Email Error:", err);
    res.status(500).json({ message: "Verification failed.", error: err.message });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "No account found with this email." });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified. Please verify your email first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET missing from env");
      return res.status(500).json({ message: "Server configuration error." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const { _id, name, privacyAccepted, termsAccepted } = user;
    res.json({ token, user: { _id, name, privacyAccepted, termsAccepted } });

  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

// ─── Forgot Password ──────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Rate-limit: don't spam reset emails
    if (user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) {
      const remaining = Math.ceil((user.resetPasswordExpires - Date.now()) / 60000);
      return res.status(429).json({
        message: `Reset link already sent. Try again in ${remaining} minute(s).`,
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    try {
      const transporter = createTransporter();
      await transporter.sendMail({
        from: `"DDS Team" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Password Reset — DDS",
        html: `
          <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f0f4ff;border-radius:16px;">
            <h2 style="color:#1e3a8a;">Reset your password</h2>
            <p style="color:#334155;">Click the button below to reset your password. This link expires in <strong>5 minutes</strong>.</p>
            <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:9px;text-decoration:none;font-weight:700;">Reset Password</a>
            <p style="color:#64748b;font-size:12px;margin-top:20px;">If you didn't request this, ignore this email.</p>
          </div>
        `,
      });
      res.status(200).json({ message: "Reset link sent to your email." });
    } catch (mailErr) {
      console.error("❌ Reset email failed:", mailErr.message);
      res.status(500).json({ message: "Failed to send reset email. Please check server email config." });
    }

  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required." });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset link." });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully. You can now log in." });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ message: "Server error.", error: err.message });
  }
};