import express from "express";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";
import {
    submitQuote,
    getAllQuotes,
    updateQuote,
    deleteQuote,
} from "../controllers/quoteController.js";

const router = express.Router();

// Public
router.post("/", submitQuote);

// Admin only
router.get("/", adminProtect, getAllQuotes);
router.patch("/:id", adminProtect, updateQuote);
router.delete("/:id", adminProtect, deleteQuote);

export default router;