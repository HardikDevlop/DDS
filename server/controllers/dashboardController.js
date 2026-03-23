import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

const ORDER_STATUSES = ["Pending", "Confirmed", "processing", "Completed", "Cancelled", "Declined"];

export const getDashboardStats = async (req, res) => {
  try {
    const [products, users, orders, statusCounts] = await Promise.all([
      Product.countDocuments(),
      User.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const orderStatusCounts = {};
    ORDER_STATUSES.forEach((s) => (orderStatusCounts[s] = 0));
    statusCounts.forEach(({ _id, count }) => {
      if (_id != null && ORDER_STATUSES.includes(_id)) orderStatusCounts[_id] = count;
    });

    res.json({
      products,
      users,
      orders,
      orderStatusCounts,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
