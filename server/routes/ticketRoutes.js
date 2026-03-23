// 📁 server/routes/ticketRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createTicket, getMyTickets, getAllTickets, updateTicketStatus } from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, getMyTickets);
router.get("/all", getAllTickets);
router.patch("/:id", updateTicketStatus);

export default router;
