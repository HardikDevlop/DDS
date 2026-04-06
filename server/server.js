import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import connectDB from './utils/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import productRoutes from "./routes/productRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import helpRoutes from './routes/helpRoutes.js';
import ticketRoutes from "./routes/ticketRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import quoteRoutes from "./routes/quoteRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// For ES modules __dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ CORS allowed origins - use actual domain/subdomain names
const allowedOrigins = [
  // 'http://localhost:5173',
  // 'http://localhost:5174',
  'https://admindharm.ddsonline.in/',
  'https://admindharm.ddsonline.in',
  'https://ddsonline.in',
  // 'http://localhost:5175',
  'https://admin-mmo0.onrender.com',
  'https://provider-snbb.onrender.com',
  // 'https://client-d5uz.onrender.com',
  // 'https://daksh-client.onrender.com',
  // 'https://daksh-admin.onrender.com',
  // 'https://admindds.ddsonline.in',
  // 'https://callcentrepanel.ddsonline.in',
];

// ✅ CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect DB
connectDB();

// ✅ Static upload path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/admin", adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api/help', helpRoutes);
app.use('/api/tickets', ticketRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/quotes", quoteRoutes);

// ✅ Default API check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// ✅ Start server
// On platforms like Render, you must listen on the PORT they provide
// and bind to 0.0.0.0 (default when hostname is omitted).
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
