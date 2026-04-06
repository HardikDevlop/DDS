import express from "express";
import { getRazorpayClient } from "../utils/razorpay.js";
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

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create(options);
    res.json({
      ...order,
      key: config.razorpayKeyId,
    });
  } catch (err) {
    console.error("Razorpay Error:", err);
    const message =
      err.message === "Razorpay credentials are missing"
        ? "Payment gateway is not configured on the server"
        : "Failed to create order";
    res.status(500).json({ error: message });
  }
});

export default router;
