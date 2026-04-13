import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { Tag, Plus, Pencil, Trash2, X } from "lucide-react";

const emptyForm = { code: "", discountType: "percentage", discountValue: "", minPurchaseAmount: "", maxDiscountAmount: "", validFrom: "", validTill: "", maxUsageLimit: "", isActive: true };

export default function VendorCoupons() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-coupons"],
    queryFn: () => api.get("/coupons"),
  });

  const saveMut = useMutation({
    mutationFn: (payload) => editId ? api.put(`/coupons/${editId}`, payload) : api.post("/coupons", payload),
    onSuccess: () => {
      toast.success(editId ? "Updated" : "Created");
      qc.invalidateQueries({ queryKey: ["vendor-coupons"] });
      closeForm();
    },
    onError: (err) => toast.error(err?.message || "Failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/coupons/${id}`),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["vendor-coupons"] }); },
  });

  const closeForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (c) => {
    setForm({
      code: c.code, discountType: c.discountType, discountValue: c.discountValue,
      minPurchaseAmount: c.minPurchaseAmount || "", maxDiscountAmount: c.maxDiscountAmount || "",
      validFrom: c.validFrom?.slice(0, 10) || "", validTill: c.validTill?.slice(0, 10) || "",
      maxUsageLimit: c.maxUsageLimit || "", isActive: c.isActive,
    });
    setEditId(c._id);
    setShowForm(true);
  };

  const coupons = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Tag className="w-6 h-6 text-pink-600" /> My Coupons
        </h1>
        <button onClick={() => { closeForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="card p-6 border-2 border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">{editId ? "Edit Coupon" : "New Coupon"}</h3>
            <button onClick={closeForm}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const payload = { ...form, discountValue: Number(form.discountValue) };
            if (form.minPurchaseAmount) payload.minPurchaseAmount = Number(form.minPurchaseAmount);
            if (form.maxDiscountAmount) payload.maxDiscountAmount = Number(form.maxDiscountAmount);
            if (form.maxUsageLimit) payload.maxUsageLimit = Number(form.maxUsageLimit);
            saveMut.mutate(payload);
          }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
              <input className="input uppercase" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SAVE20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="input" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input type="number" className="input" required value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Purchase</label>
              <input type="number" className="input" value={form.minPurchaseAmount} onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
              <input type="date" className="input" value={form.validFrom} onChange={(e) => setForm({ ...form, validFrom: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Till</label>
              <input type="date" className="input" value={form.validTill} onChange={(e) => setForm({ ...form, validTill: e.target.value })} />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="button" onClick={closeForm} className="btn-outline">Cancel</button>
              <button type="submit" disabled={saveMut.isPending} className="btn-primary">{saveMut.isPending ? "Saving..." : editId ? "Update" : "Create"}</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : coupons.length === 0 ? (
        <div className="card p-12 text-center">
          <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No coupons created yet</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {coupons.map((c) => (
            <div key={c._id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className="font-mono text-sm font-bold text-pink-700 bg-pink-50 px-3 py-1.5 rounded-lg flex-shrink-0">{c.code}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {c.discountType === "percentage" ? `${c.discountValue}% off` : `${formatPrice(c.discountValue)} off`}
                    {c.minPurchaseAmount ? ` on min ${formatPrice(c.minPurchaseAmount)}` : ""}
                  </p>
                  <p className="text-xs text-gray-400">
                    Used {c.usedCount || 0} times &middot; {c.validTill ? `Expires ${formatDate(c.validTill)}` : "No expiry"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full ${c.isActive ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {c.isActive ? "Active" : "Inactive"}
                </span>
                <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                <button onClick={() => { if (confirm("Delete?")) deleteMut.mutate(c._id); }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
