import express from "express";
import { adminLogin } from "../controllers/adminController.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);

export default router;
