import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";

import {
  createOrder,
  getUserOrders,
  placeOrder,
  getAllOrders,
  cancelOrder,
  changeOrderTimeSlot,
  assignProvider,        // ✅ NEW
  completeOrderByCode,   // ✅ NEW
} from "../controllers/orderController.js";

const router = express.Router();

// ========== USER ROUTES ==========
router.post("/", protect, createOrder);
router.post("/place", protect, placeOrder);
router.get("/my-orders", protect, getUserOrders);
router.delete("/:id", protect, cancelOrder);
router.put("/:id/change-timeslot", protect, changeOrderTimeSlot);

// ========== ADMIN ROUTES ==========
router.get("/AllOrders", adminProtect, getAllOrders);
router.post("/:id/assign-provider", adminProtect, assignProvider);      // ✅ NEW
router.post("/:id/complete-by-code", adminProtect, completeOrderByCode); // ✅ NEW

export default router;