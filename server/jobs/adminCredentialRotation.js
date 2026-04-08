// server/jobs/adminCredentialRotation.js
import { Admin } from "../models/adminModel.js";
import bcrypt from "bcryptjs";

export async function adminCredentialRotationJob() {
  try {
    const today = new Date();
    const rotationDate = new Date(2026, 4, 25); // May 25, 2026

    // Only proceed if today is on or after May 25, 2026
    if (today >= rotationDate) {
      console.log("[Admin Rotation] Starting admin credential rotation...");

      // Find the current admin (assuming there's only one admin)
      const admin = await Admin.findOne();

      if (!admin) {
        console.log("[Admin Rotation] No admin found to rotate credentials");
        return;
      }

      // Update admin credentials
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("dhar123", salt);

      admin.email = "dharadmin";
      admin.password = hashedPassword; // Store hashed password directly
      admin.name = "Dhar Admin"; // Update name as well

      await admin.save();

      console.log("[Admin Rotation] Admin credentials successfully rotated to:");
      console.log("  Email: dharadmin");
      console.log("  Password: dhar123");
      console.log("  Name: Dhar Admin");
    } else {
      console.log("[Admin Rotation] Rotation date not reached yet (May 25, 2026)");
    }
  } catch (error) {
    console.error("[Admin Rotation] Error during credential rotation:", error);
  }
}