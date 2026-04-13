import User from "../models/User.js";

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true }).select("-password");
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    res.json({ success: true, data: user.addresses || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const newAddress = req.body;

    // If this is default, unset others
    if (newAddress.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    // If no addresses yet, make this default
    if (user.addresses.length === 0) newAddress.isDefault = true;

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json({ success: true, data: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    if (req.body.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    Object.assign(addr, req.body);
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const addr = user.addresses.id(req.params.addressId);
    if (!addr) return res.status(404).json({ success: false, message: "Address not found" });

    addr.deleteOne();
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach((a) => { a.isDefault = a._id.toString() === req.params.addressId; });
    await user.save();
    res.json({ success: true, data: user.addresses });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
