import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Package, Search, CheckCircle, XCircle } from "lucide-react";

const statusBadge = (s) => {
  const map = {
    approved: "bg-green-100 text-green-700",
    pending_approval: "bg-yellow-100 text-yellow-700",
    rejected: "bg-red-100 text-red-700",
    draft: "bg-gray-100 text-gray-600",
    archived: "bg-gray-100 text-gray-500",
  };
  return map[s] || "bg-gray-100 text-gray-600";
};

export default function AdminProducts() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("pending_approval");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-products", filter],
    queryFn: async () => {
      const params = filter !== "all" ? `?status=${filter}` : "";
      const res = await api.get(`/admin/products${params}`);
      return res.data;
    },
  });

  const updateMut = useMutation({
    mutationFn: ({ id, status, reason }) => api.patch(`/admin/products/${id}/status`, { status, reason }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries(["admin-products"]);
      toast.success(`Product ${vars.status}`);
    },
    onError: () => toast.error("Failed to update product status"),
  });

  const products = (data || []).filter(p =>
    !search || p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const filters = [
    { key: "pending_approval", label: "Pending" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
    { key: "all", label: "All" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <p className="text-gray-500 text-sm mt-1">Review and approve vendor products</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input className="input pl-9" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${filter === f.key ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 card">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => {
            const lowestPrice = p.variants?.length ? Math.min(...p.variants.map(v => v.price)) : 0;
            return (
              <div key={p._id} className="card overflow-hidden">
                <div className="relative">
                  <img src={p.images?.[0] || "/placeholder.jpg"} alt={p.name} className="w-full h-40 object-cover" />
                  <span className={`absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full capitalize ${statusBadge(p.status)}`}>
                    {p.status?.replace("_", " ")}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">{p.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{p.vendorId?.brandName} · {p.category?.name || p.category}</p>
                  <p className="font-bold text-gray-900 mt-1">{formatPrice(lowestPrice)}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Submitted {formatDate(p.createdAt)}</p>

                  {p.status === "pending_approval" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => updateMut.mutate({ id: p._id, status: "approved" })}
                        disabled={updateMut.isPending}
                        className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white rounded-xl py-1.5 text-xs font-medium hover:bg-green-600 transition-colors">
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => updateMut.mutate({ id: p._id, status: "rejected", reason: "Does not meet listing guidelines" })}
                        disabled={updateMut.isPending}
                        className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white rounded-xl py-1.5 text-xs font-medium hover:bg-red-600 transition-colors">
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                  {p.status === "approved" && (
                    <button
                      onClick={() => updateMut.mutate({ id: p._id, status: "rejected" })}
                      className="w-full mt-3 bg-red-50 text-red-600 rounded-xl py-1.5 text-xs font-medium hover:bg-red-100 transition-colors">
                      Delist Product
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
