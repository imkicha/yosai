import { Router } from "express";
import { getWallet, getTransactions, requestPayout, getPayoutRequests } from "../controllers/wallet.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();
router.get("/", protect, getWallet);
router.get("/transactions", protect, getTransactions);
router.post("/payout", protect, requestPayout);
router.get("/payouts", protect, getPayoutRequests);
export default router;
