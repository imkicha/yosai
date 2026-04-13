import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle, Banknote } from "lucide-react";

export default function VendorWallet() {
  const qc = useQueryClient();
  const [showPayout, setShowPayout] = useState(false);
  const [amount, setAmount] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-wallet"],
    queryFn: async () => {
      const [walletRes, txRes] = await Promise.all([
        api.get("/wallet"),
        api.get("/wallet/transactions"),
      ]);
      // walletRes = { success, data: wallet }; txRes = { success, data: [...] }
      return { wallet: walletRes.data, transactions: txRes.data };
    },
  });

  const payoutMut = useMutation({
    mutationFn: (amt) => api.post("/wallet/payout", { amount: amt }),
    onSuccess: () => {
      toast.success("Payout request submitted!");
      setShowPayout(false);
      setAmount("");
      qc.invalidateQueries(["vendor-wallet"]);
    },
    onError: (err) => toast.error(err?.message || "Failed to request payout"),
  });

  const balance = data?.wallet?.balance || 0;
  const transactions = data?.transactions || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>

      {/* Balance Card */}
      <div className="brand-gradient rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <WalletIcon className="w-6 h-6 opacity-80" />
          <span className="opacity-80 text-sm">Available Balance</span>
        </div>
        <p className="text-4xl font-bold">{formatPrice(balance)}</p>
        <p className="text-sm opacity-60 mt-1">Earnings from delivered orders</p>
        <button
          onClick={() => setShowPayout(true)}
          className="mt-4 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 transition-all">
          <Banknote className="w-4 h-4" /> Request Payout
        </button>
      </div>

      {/* Payout Modal */}
      {showPayout && (
        <div className="card p-6 border-2 border-pink-100">
          <h3 className="font-bold text-gray-900 mb-4">Request Payout</h3>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
              <input
                type="number"
                className="input"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder={`Max: ${balance}`}
                max={balance}
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">Payouts are processed within 3-5 business days</p>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowPayout(false)} className="btn-outline flex-1">Cancel</button>
            <button
              onClick={() => payoutMut.mutate(Number(amount))}
              disabled={payoutMut.isPending || !amount || Number(amount) > balance || Number(amount) <= 0}
              className="btn-primary flex-1">
              {payoutMut.isPending ? "Submitting..." : "Request Payout"}
            </button>
          </div>
        </div>
      )}

      {/* Transactions */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-4">Transaction History</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No transactions yet</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((tx) => (
              <div key={tx._id} className="py-3 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${tx.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                  {tx.type === "credit"
                    ? <ArrowDownCircle className="w-5 h-5 text-green-500" />
                    : <ArrowUpCircle className="w-5 h-5 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 capitalize">{tx.reason?.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-400">{formatDate(tx.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className={`font-semibold text-sm ${tx.type === "credit" ? "text-green-600" : "text-red-600"}`}>
                    {tx.type === "credit" ? "+" : "-"}{formatPrice(tx.amount)}
                  </p>
                  <p className="text-xs text-gray-400">Bal: {formatPrice(tx.balanceAfter)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
