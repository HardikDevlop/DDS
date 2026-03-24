import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// ─── In-memory pending signups cache ─────────────────────────────────────────
// Key: email  Value: { name, hashedPassword, otp, expiresAt }
// User is NOT saved to DB until OTP is verified
const pendingSignups = new Map();

// Auto-cleanup expired pending entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [email, data] of pendingSignups.entries()) {
    if (data.expiresAt < now) {
      pendingSignups.delete(email);
      console.log(`🗑 Expired pending signup removed: ${email}`);
    }
  }
}, 10 * 60 * 1000);

// ─── Email transporter (singleton) ───────────────────────────────────────────
let _transporter = null;
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password — NOT your login password
      },
      pool: true,
      maxConnections: 3,
      socketTimeout: 10000,
      connectionTimeout: 10000,
    });
  }
  return _transporter;
}

// Fire-and-forget email — never blocks response
function sendEmail({ to, subject, html }) {
  setImmediate(async () => {
    try {
      await getTransporter().sendMail({
        from: `"DDS Online" <${process.env.EMAIL_USER}>`,
        to, subject, html,
      });
      console.log(`✅ Email sent → ${to}`);
    } catch (err) {
      console.error(`❌ Email failed → ${to}:`, err.message);
    }
  });
}

// ─── SIGNUP — store in cache only, do NOT save to DB yet ─────────────────────
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if a verified account already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists. Please log in." });
    }

    // Generate 6-digit OTP and hash password
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store in cache — expires in 15 minutes
    pendingSignups.set(email, {
      name,
      hashedPassword,
      otp,
      expiresAt: Date.now() + 15 * 60 * 1000,
    });

    console.log(`⏳ Pending signup cached: ${email} | OTP: ${otp}`);

    // Respond immediately — do NOT await email
    res.status(200).json({
      message: "OTP sent to your email. Please verify within 15 minutes.",
    });

    // Send OTP email in background
    sendEmail({
      to: email,
      subject: "Your verification code — DDS Online",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f0f4ff;border-radius:16px;">
          <h2 style="color:#1e3a8a;margin:0 0 8px;">Verify your email</h2>
          <p style="color:#334155;margin:0 0 24px;">
            Hello <strong>${name}</strong>, use the code below to complete your registration.
          </p>
          <div style="background:#fff;border:2px solid #dde5f4;border-radius:12px;padding:28px;text-align:center;">
            <p style="font-size:40px;font-weight:900;letter-spacing:0.3em;color:#2563eb;margin:0;font-family:monospace;">
              ${otp}
            </p>
          </div>
          <p style="color:#64748b;font-size:12px;margin-top:20px;">
            This code expires in <strong>15 minutes</strong>. If you didn't sign up, ignore this email.
          </p>
        </div>
      `,
    });

  } catch (err) {
    console.error("❌ Signup Error:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Signup failed.", error: err.message });
    }
  }
};

// ─── VERIFY EMAIL — create user in DB only after correct OTP ─────────────────
export const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Check if already a verified user (re-verify attempt)
    const existingUser = await User.findOne({ email });
    if (existingUser?.isVerified) {
      return res.status(200).json({ message: "Email already verified. Please log in." });
    }

    // Look up pending signup
    const pending = pendingSignups.get(email);

    if (!pending) {
      return res.status(400).json({
        message: "No pending signup found for this email. Please sign up again.",
      });
    }

    if (Date.now() > pending.expiresAt) {
      pendingSignups.delete(email);
      return res.status(400).json({
        message: "Verification code expired. Please sign up again.",
      });
    }

    if (String(verificationCode).trim() !== pending.otp) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    // ✅ OTP correct — NOW create the user in DB
    const user = new User({
      name: pending.name,
      email,
      password: pending.hashedPassword,
      isVerified: true,      // already verified
      verificationCode: undefined,
    });
    await user.save();

    // Remove from cache
    pendingSignups.delete(email);

    console.log(`✅ User created after OTP verify: ${email}`);

    res.status(200).json({ message: "Email verified! Your account is ready. You can now log in." });

  } catch (err) {
    console.error("❌ Verify Email Error:", err);
    res.status(500).json({ message: "Verification failed.", error: err.message });
  }
};

// ─── RESEND OTP ───────────────────────────────────────────────────────────────
export const resendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({ email, isVerified: true });
    if (existingUser) {
      return res.status(400).json({ message: "This email is already verified." });
    }

    const pending = pendingSignups.get(email);
    if (!pending) {
      return res.status(400).json({ message: "No pending signup found. Please sign up again." });
    }

    // Issue a new OTP and reset expiry
    const newOtp = String(Math.floor(100000 + Math.random() * 900000));
    pending.otp = newOtp;
    pending.expiresAt = Date.now() + 15 * 60 * 1000;
    pendingSignups.set(email, pending);

    console.log(`🔄 OTP resent: ${email} | New OTP: ${newOtp}`);

    res.status(200).json({ message: "New OTP sent to your email." });

    sendEmail({
      to: email,
      subject: "Your new verification code — DDS Online",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f0f4ff;border-radius:16px;">
          <h2 style="color:#1e3a8a;margin:0 0 8px;">New verification code</h2>
          <p style="color:#334155;margin:0 0 24px;">Hello <strong>${pending.name}</strong>, here is your new code:</p>
          <div style="background:#fff;border:2px solid #dde5f4;border-radius:12px;padding:28px;text-align:center;">
            <p style="font-size:40px;font-weight:900;letter-spacing:0.3em;color:#2563eb;margin:0;font-family:monospace;">
              ${newOtp}
            </p>
          </div>
          <p style="color:#64748b;font-size:12px;margin-top:20px;">Expires in 15 minutes.</p>
        </div>
      `,
    });

  } catch (err) {
    console.error("❌ Resend OTP Error:", err);
    if (!res.headersSent) res.status(500).json({ message: "Failed to resend OTP." });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Check if there's a pending (unverified) signup
      if (pendingSignups.has(email)) {
        return res.status(401).json({
          message: "Your email is not verified yet. Please check your inbox for the OTP.",
          pendingVerification: true,
        });
      }
      return res.status(401).json({ message: "No account found with this email." });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified. Please check your inbox." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    if (!process.env.JWT_SECRET) {
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

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account with this email." });

    if (user.resetPasswordExpires && user.resetPasswordExpires > Date.now()) {
      const mins = Math.ceil((user.resetPasswordExpires - Date.now()) / 60000);
      return res.status(429).json({ message: `Reset link already sent. Try again in ${mins} minute(s).` });
    }

    const { randomBytes } = await import("crypto");
    const resetToken = randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    res.status(200).json({ message: "Reset link sent to your email." });

    sendEmail({
      to: email,
      subject: "Reset your password — DDS Online",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#f0f4ff;border-radius:16px;">
          <h2 style="color:#1e3a8a;">Reset your password</h2>
          <p style="color:#334155;">This link expires in <strong>5 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 28px;background:#2563eb;color:#fff;border-radius:9px;text-decoration:none;font-weight:700;">
            Reset Password
          </a>
          <p style="color:#64748b;font-size:12px;margin-top:20px;">Didn't request this? Ignore this email.</p>
        </div>
      `,
    });

  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    if (!res.headersSent) res.status(500).json({ message: "Server error.", error: err.message });
  }
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: "Password is required." });

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: "Invalid or expired reset link." });

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