import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

export const getOrCreateWallet = async (ownerId, ownerType) => {
  let wallet = await Wallet.findOne({ ownerId, ownerType });
  if (!wallet) wallet = await Wallet.create({ ownerId, ownerType, balance: 0 });
  return wallet;
};

export const creditWallet = async ({ ownerId, ownerType, amount, reason, referenceId, note }) => {
  const wallet = await Wallet.findOneAndUpdate(
    { ownerId, ownerType },
    { $inc: { balance: amount } },
    { upsert: true, new: true }
  );
  await Transaction.create({
    walletId: wallet._id,
    type: "credit",
    amount,
    reason,
    referenceId,
    note,
    balanceAfter: wallet.balance,
  });
  return wallet;
};

export const debitWallet = async ({ ownerId, ownerType, amount, reason, referenceId, note }) => {
  const wallet = await Wallet.findOne({ ownerId, ownerType });
  if (!wallet || wallet.balance < amount) throw new Error("Insufficient wallet balance");

  wallet.balance -= amount;
  await wallet.save();

  await Transaction.create({
    walletId: wallet._id,
    type: "debit",
    amount,
    reason,
    referenceId,
    note,
    balanceAfter: wallet.balance,
  });
  return wallet;
};
