import Razorpay from "razorpay";
import { config } from "../config/keys.js";

export const getRazorpayClient = () => {
  if (!config.razorpayKeyId || !config.razorpaySecret) {
    throw new Error("Razorpay credentials are missing");
  }

  return new Razorpay({
    key_id: config.razorpayKeyId,
    key_secret: config.razorpaySecret,
  });
};
