import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, Package, ShoppingBag, Star } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#DB2777", "#7C3AED", "#3B82F6", "#10B981", "#F59E0B"];

export default function VendorAnalytics() {
  const { data, isLoading } = useQuery({
    queryKey: ["vendor-analytics"],
    queryFn: async () => {
      const [ordersRes, productsRes, walletRes] = await Promise.all([
        api.get("/orders/vendor"),
        api.get("/products/vendor/my"),
        api.get("/wallet"),
      ]);
      return { orders: ordersRes.data, products: productsRes.data, wallet: walletRes.data };
    },
  });

  if (isLoading) return (
    <div className="space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />)}
    </div>
  );

  // Flatten all sub-orders across orders
  const orders = (data?.orders || []).flatMap(o => (o.subOrders || []).map(s => ({ ...s, createdAt: o.createdAt })));
  const products = data?.products || [];
  const balance = data?.wallet?.balance || 0;

  // Revenue by month (last 6 months)
  const monthlyRevenue = orders
    .filter(o => o.status === "delivered")
    .reduce((acc, o) => {
      const month = new Date(o.createdAt).toLocaleString("default", { month: "short" });
      acc[month] = (acc[month] || 0) + o.vendorEarning;
      return acc;
    }, {});
  const revenueData = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));

  // Order status breakdown
  const statusBreakdown = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(statusBreakdown).map(([name, value]) => ({ name, value }));

  // Top products by revenue
  const productRevenue = orders
    .filter(o => o.status === "delivered")
    .flatMap(o => o.items || [])
    .reduce((acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + item.price * item.quantity;
      return acc;
    }, {});
  const topProducts = Object.entries(productRevenue)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, revenue]) => ({ name: name.length > 20 ? name.slice(0, 20) + "…" : name, revenue }));

  const totalRevenue = orders.filter(o => o.status === "delivered").reduce((s, o) => s + o.vendorEarning, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const stats = [
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "text-pink-600", bg: "bg-pink-50" },
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Products", value: totalProducts, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Avg. Order Value", value: formatPrice(avgOrderValue), icon: Star, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Your store performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      {revenueData.length > 0 && (
        <div className="card p-6">
          <h2 className="font-bold text-gray-900 mb-4">Revenue Over Time</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DB2777" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#DB2777" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={v => formatPrice(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#DB2777" fill="url(#revenueGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        {topProducts.length > 0 && (
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Top Products by Revenue</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={90} />
                <Tooltip formatter={v => formatPrice(v)} />
                <Bar dataKey="revenue" fill="#DB2777" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Order Status Pie */}
        {pieData.length > 0 && (
          <div className="card p-6">
            <h2 className="font-bold text-gray-900 mb-4">Order Status Breakdown</h2>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
