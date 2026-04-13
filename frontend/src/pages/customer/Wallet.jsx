import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, TrendingUp } from "lucide-react";

export default function Wallet() {
  const { data: wallet } = useQuery({ queryKey: ["wallet"], queryFn: () => api.get("/wallet") });
  const { data: txns } = useQuery({ queryKey: ["transactions"], queryFn: () => api.get("/wallet/transactions") });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Wallet</h1>
      <div className="card p-8 mb-6 brand-gradient text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute -bottom-10 -right-20 w-60 h-60 bg-white/5 rounded-full" />
        <WalletIcon className="w-8 h-8 mb-4 opacity-80" />
        <p className="text-white/80 text-sm mb-1">Available Balance</p>
        <p className="text-4xl font-bold">{formatPrice(wallet?.data?.balance || 0)}</p>
        <p className="text-white/60 text-sm mt-2">INR · Wallet Balance</p>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-pink-600" /> Transaction History</h3>
        {!txns?.data?.length ? (
          <p className="text-gray-400 text-sm text-center py-8">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {txns.data.map((t) => (
              <div key={t._id} className="flex items-center gap-3 py-3 border-b last:border-0 border-gray-50">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${t.type === "credit" ? "bg-green-50" : "bg-red-50"}`}>
                  {t.type === "credit" ? <ArrowDownLeft className="w-4 h-4 text-green-600" /> : <ArrowUpRight className="w-4 h-4 text-red-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 capitalize">{t.reason?.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-400">{formatDate(t.createdAt)}</p>
                </div>
                <p className={`font-bold text-sm ${t.type === "credit" ? "text-green-600" : "text-red-500"}`}>
                  {t.type === "credit" ? "+" : "-"}{formatPrice(t.amount)}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
