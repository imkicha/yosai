import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { v4 as uuidv4 } from "uuid";

export const getCart = async (req, res) => {
  try {
    const cartId = req.query.cartId || req.headers["x-cart-id"];
    if (!cartId) return res.json({ success: true, data: { items: [] } });
    const cart = await Cart.findOne({ cartId }).populate("items.productId", "name images status");
    res.json({ success: true, data: cart || { items: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    let { cartId, productId, variantId, quantity = 1, selectedSize, selectedColor } = req.body;
    if (!cartId) cartId = uuidv4();

    const product = await Product.findById(productId).populate("vendorId", "_id");
    if (!product || product.status !== "approved")
      return res.status(400).json({ success: false, message: "Product not available" });

    const variant = variantId ? product.variants.id(variantId) : product.variants[0];
    if (!variant || variant.stock < quantity)
      return res.status(400).json({ success: false, message: "Insufficient stock" });

    let cart = await Cart.findOne({ cartId });
    if (!cart) {
      cart = await Cart.create({ cartId, userId: req.user?._id || null, items: [] });
    }

    const existingIdx = cart.items.findIndex(
      (i) => i.productId.toString() === productId && i.variantId?.toString() === variantId && i.selectedSize === selectedSize
    );

    if (existingIdx > -1) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({ productId, variantId, vendorId: product.vendorId._id, name: product.name, image: product.images[0], price: variant.price, mrp: variant.mrp, quantity, selectedSize, selectedColor });
    }

    await cart.save();
    res.json({ success: true, data: cart, cartId });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { cartId, itemId, quantity } = req.body;
    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });
    if (quantity <= 0) cart.items.pull(itemId);
    else item.quantity = quantity;
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { cartId, itemId } = req.body;
    const cart = await Cart.findOne({ cartId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });
    cart.items.pull(itemId);
    await cart.save();
    res.json({ success: true, data: cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const { cartId } = req.body;
    await Cart.findOneAndDelete({ cartId });
    res.json({ success: true, message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
