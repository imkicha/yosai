import { Router } from "express";
import { protect, requireRole } from "../middleware/auth.js";
import {
  createTicket, getMyTickets, getTicketDetail, addReply,
  getAllTickets, getTicketDetailAdmin, updateTicket,
} from "../controllers/support.controller.js";

const router = Router();

// Customer/Vendor
router.post("/", protect, createTicket);
router.get("/my", protect, getMyTickets);
router.get("/my/:id", protect, getTicketDetail);
router.post("/:id/reply", protect, addReply);

// Admin
router.get("/admin", protect, requireRole("admin"), getAllTickets);
router.get("/admin/:id", protect, requireRole("admin"), getTicketDetailAdmin);
router.patch("/admin/:id", protect, requireRole("admin"), updateTicket);
router.post("/admin/:id/reply", protect, requireRole("admin"), addReply);

export default router;
