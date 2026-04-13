import { Router } from "express";
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from "../controllers/cart.controller.js";

const router = Router();
router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);
router.delete("/clear", clearCart);
export default router;
