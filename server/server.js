import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import cron from 'node-cron';
import connectDB from './utils/connectDB.js';
import { adminCredentialRotationJob } from './jobs/adminCredentialRotation.js';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://ddsonline.in',
  'https://admindharm.ddsonline.in',
  'https://admindds.ddsonline.in',
  'https://callcentrepanel.ddsonline.in',
  'https://admin-mmo0.onrender.com',
  'https://provider-snbb.onrender.com',
  'https://client-d5uz.onrender.com',
  'https://daksh-client.onrender.com',
  'https://daksh-admin.onrender.com',
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;

  const normalizedOrigin = origin.replace(/\/$/, '');
  if (allowedOrigins.has(normalizedOrigin)) {
    return true;
  }

  try {
    const { hostname, protocol } = new URL(normalizedOrigin);
    if (protocol !== 'https:' && hostname !== 'localhost') {
      return false;
    }

    return hostname === 'ddsonline.in' || hostname.endsWith('.ddsonline.in') || hostname === 'localhost';
  } catch {
    return false;
  }
};

app.use(cors({
  origin: function (origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Schedule admin credential rotation job to run daily at midnight
cron.schedule('0 0 * * *', () => {
  console.log('[Cron] Running daily admin credential rotation check...');
  adminCredentialRotationJob();
});

// Also run the job immediately when server starts (for testing)
adminCredentialRotationJob();

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

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
