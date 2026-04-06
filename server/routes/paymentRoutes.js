import express from "express";
import { razorpay } from "../utils/razorpay.js";
import { config } from "../config/keys.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    const amount = Number(req.body?.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      ...order,
      key: config.razorpayKeyId,
    });
  } catch (err) {
    console.error("Razorpay Error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

export default router;
