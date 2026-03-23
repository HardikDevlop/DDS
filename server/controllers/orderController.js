import Order from "../models/Order.js";
import nodemailer from "nodemailer";

// Utility: Generate a random 4-digit code
function generate4DigitCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// ─── Email utility ────────────────────────────────────────────────────────────
async function sendProviderCancellationEmail({ providerEmail, providerName, order }) {
  if (!providerEmail) return; // no email on file, skip silently

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,   // your Gmail address in .env
      pass: process.env.MAIL_PASS,   // Gmail App Password in .env
    },
  });

  const itemList = (order.items || [])
    .map((i) => `• ${i.title} — ₹${i.price}`)
    .join("\n");

  await transporter.sendMail({
    from: `"DDS Admin" <${process.env.MAIL_USER}>`,
    to: providerEmail,
    subject: `⚠️ Order Cancelled — Action Required [Order #${order._id?.toString().slice(-8)}]`,
    text: `
Hello ${providerName},

This is to inform you that the following order assigned to you has been CANCELLED by the customer.

──────────────────────────────
ORDER DETAILS
──────────────────────────────
Order ID   : ${order._id}
Customer   : ${order.user?.name || "N/A"}
Time Slot  : ${order.address?.timeSlot}
Address    : ${order.address?.fullAddress}

Services Booked:
${itemList}

Total Amount: ₹${order.totalAmount}
──────────────────────────────

Please do NOT visit the customer's location for this order.

If you have already travelled or incurred any expenses, please contact the admin immediately.

Regards,
DDS Support Team
    `.trim(),
  });
}

// ─── Create order ─────────────────────────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const { services, totalPrice } = req.body;
    const newOrder = new Order({
      user: req.user.id,
      services,
      totalPrice,
      status: "Confirmed",
      requestStatus: "Pending",
      createdAt: new Date(),
    });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Create Order Error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// ─── Place order (with codes) ─────────────────────────────────────────────────
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId, paymentType } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items to place order" });

    const happyCode = generate4DigitCode();
    let completeCode = generate4DigitCode();
    while (completeCode === happyCode) completeCode = generate4DigitCode();

    if (paymentType === "post") {
      const newOrder = new Order({
        user: req.userId,
        items,
        totalAmount,
        address: { ...address },
        status: "Pending",
        requestStatus: "Pending",
        paymentType: "post",
        createdAt: new Date(),
        happyCode,
        completeCode,
      });
      await newOrder.save();
      return res.status(201).json({
        message: "Order placed successfully. Admin will process it shortly.",
        order: newOrder,
      });
    }

    const newOrder = new Order({
      user: req.userId,
      items,
      totalAmount,
      address: { ...address },
      paymentId,
      status: "Confirmed",
      requestStatus: "Pending",
      happyCode,
      completeCode,
      createdAt: new Date(),
    });
    await newOrder.save();
    return res.status(201).json({
      message: "Order placed successfully. Admin will process it shortly.",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ placeOrder error:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
};

// ─── Get orders for a user ────────────────────────────────────────────────────
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId });
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Fetch Orders Error:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ─── Cancel order ─────────────────────────────────────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const orderUserId = order.user?._id?.toString() || order.user?.toString();
    if (orderUserId !== req.user?.id && orderUserId !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    order.status = "Cancelled";
    await order.save();

    // ✅ Send cancellation email to provider if one was assigned with an email
    if (order.assignedProviderDetails?.email) {
      try {
        await sendProviderCancellationEmail({
          providerEmail: order.assignedProviderDetails.email,
          providerName: order.assignedProviderDetails.name,
          order,
        });
        console.log(`📧 Cancellation email sent to ${order.assignedProviderDetails.email}`);
      } catch (mailErr) {
        console.error("❌ Failed to send cancellation email:", mailErr.message);
      }
    }

    res.status(200).json({ message: "Order cancelled" });
  } catch (err) {
    console.error("❌ Cancel Order Error:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

// ─── Get all orders (admin) — newest first ────────────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 }); // ✅ newest first
    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// ─── Change order time slot ───────────────────────────────────────────────────
export const changeOrderTimeSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSlot } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.address) return res.status(400).json({ message: "Order address missing" });

    order.address.timeSlot = timeSlot;
    await order.save();
    res.status(200).json({ message: "Time slot updated.", order });
  } catch (err) {
    console.error("Error in changeOrderTimeSlot:", err);
    res.status(500).json({ message: "Failed to update time slot" });
  }
};

// ─── Assign provider (admin) ──────────────────────────────────────────────────
export const assignProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile, email, note } = req.body;

    if (!name || !mobile)
      return res.status(400).json({ message: "Provider name and mobile are required." });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Completed" || order.status === "Cancelled")
      return res.status(400).json({ message: `Cannot assign provider to a ${order.status} order.` });

    order.assignedProviderDetails = {
      name: name.trim(),
      mobile: mobile.trim(),
      email: email ? email.trim() : undefined,
      note: note ? note.trim() : undefined,
      assignedAt: new Date(),
    };
    order.status = "processing";
    order.requestStatus = "Accepted";
    await order.save();

    res.status(200).json({
      message: "Provider assigned successfully. Order is now in processing.",
      order,
    });
  } catch (err) {
    console.error("❌ assignProvider error:", err);
    res.status(500).json({ message: "Failed to assign provider." });
  }
};

// ─── Complete order by happy code (admin) ─────────────────────────────────────
export const completeOrderByCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;

    if (!code) return res.status(400).json({ message: "Code is required." });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "Completed")
      return res.status(400).json({ message: "Order is already completed." });
    if (order.status === "Cancelled")
      return res.status(400).json({ message: "Cannot complete a cancelled order." });

    if (order.happyCode !== code.trim())
      return res.status(400).json({
        message: "Invalid code. Please check the happy code and try again.",
      });

    order.status = "Completed";
    order.completedAt = new Date();
    await order.save();

    res.status(200).json({ message: "Order completed successfully!", order });
  } catch (err) {
    console.error("❌ completeOrderByCode error:", err);
    res.status(500).json({ message: "Failed to complete order." });
  }
};