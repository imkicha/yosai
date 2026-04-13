import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice, formatDate, statusColor } from "@/lib/utils";
import { TrendingUp, Package, ShoppingBag, Wallet, AlertCircle, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function VendorDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-dashboard"],
    queryFn: async () => {
      const [statsRes, ordersRes, walletRes] = await Promise.all([
        api.get("/vendors/me"),
        api.get("/orders/vendor?limit=5"),
        api.get("/wallet"),
      ]);
      // statsRes = { success, data: vendor }; ordersRes = { success, data: [...] }; walletRes = { success, data: wallet }
      return { vendor: statsRes.data, orders: ordersRes.data, wallet: walletRes.data };
    },
  });

  if (isLoading) return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  const vendor = data?.vendor;
  // orders API returns array of order objects, flatten to sub-orders
  const orders = (data?.orders || []).flatMap(o => (o.subOrders || []).map(s => ({ ...s, createdAt: o.createdAt })));
  const wallet = data?.wallet;

  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const delayedOrders = orders.filter(o => o.isDelayed).length;

  const stats = [
    { label: "Total Revenue", value: formatPrice(vendor?.totalRevenue || 0), icon: TrendingUp, color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Wallet Balance", value: formatPrice(wallet?.balance || 0), icon: Wallet, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Products", value: vendor?.productCount || 0, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Pending Orders", value: pendingOrders, icon: ShoppingBag, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {vendor?.brandName}</p>
      </div>

      {/* Status Banner */}
      {vendor?.status !== "approved" && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${vendor?.status === "pending" ? "bg-yellow-50 border-yellow-200 text-yellow-800" : "bg-red-50 border-red-200 text-red-800"}`}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">
              {vendor?.status === "pending" ? "Application Under Review" : `Account ${vendor?.status}`}
            </p>
            <p className="text-sm opacity-80">
              {vendor?.status === "pending" ? "Your vendor application is being reviewed by our team. You'll be notified once approved." : "Please contact support for assistance."}
            </p>
          </div>
        </div>
      )}

      {/* Delayed Orders Alert */}
      {delayedOrders > 0 && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800">
          <Clock className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium">{delayedOrders} order(s) haven't been processed in 48+ hours. Please take action.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="card p-6">
        <h2 className="font-bold text-gray-900 mb-4">Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No orders yet</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 5).map((order) => (
              <div key={order.subOrderId} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{order.subOrderId}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{formatDate(order.createdAt)} · {order.items?.length} item(s)</p>
                  {order.isDelayed && <span className="text-xs text-red-500 font-medium">Delayed</span>}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 text-sm">{formatPrice(order.subtotal)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColor(order.status)}`}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
