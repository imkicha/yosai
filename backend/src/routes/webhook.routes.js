import { Router } from "express";
import crypto from "crypto";
import Order from "../models/Order.js";
import { creditWallet } from "../services/wallet.service.js";
import { createNotification } from "../services/notification.service.js";
import Vendor from "../models/Vendor.js";

const router = Router();

router.post("/razorpay", async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const body = req.body; // raw buffer
  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || "").update(body).digest("hex");
  if (expected !== signature) return res.status(400).json({ error: "Invalid signature" });

  const event = JSON.parse(body.toString());
  if (event.event === "payment.captured") {
    const { order_id } = event.payload.payment.entity;
    await Order.updateOne({ "payment.razorpayOrderId": order_id }, { "payment.status": "paid" });
  }
  res.json({ received: true });
});

router.post("/shiprocket", async (req, res) => {
  const body = JSON.parse(req.body.toString());
  const { awb, current_status, order_id } = body;

  const order = await Order.findOne({ "subOrders.shipping.awbCode": awb });
  if (order) {
    for (const sub of order.subOrders) {
      if (sub.shipping?.awbCode === awb) {
        sub.shipping.shipmentStatus = current_status;
        if (current_status === "Delivered") {
          sub.status = "delivered";
          sub.shipping.deliveredAt = new Date();
          // Credit vendor
          const vendor = await Vendor.findById(sub.vendorId);
          if (vendor) {
            await creditWallet({ ownerId: vendor._id, ownerType: "vendor", amount: sub.vendorEarning, reason: "order_earning", referenceId: sub.subOrderId });
            await createNotification({ userId: vendor.userId, title: "Order Delivered", message: `₹${sub.vendorEarning} credited for order ${sub.subOrderId}`, type: "order_delivered" });
          }
          await createNotification({ userId: order.customerId, title: "Order Delivered!", message: `Your order ${sub.subOrderId} has been delivered.`, type: "order_delivered" });
        }
      }
    }
    await order.save();
  }
  res.json({ received: true });
});

export default router;
