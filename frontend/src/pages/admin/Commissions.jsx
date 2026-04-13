import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { Percent, Plus, Trash2, Edit2, X } from "lucide-react";

const emptySlab = () => ({ minAmount: "", maxAmount: "", rate: "" });

export default function AdminCommissions() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ label: "", slabs: [emptySlab()], isDefault: false });

  const { data, isLoading } = useQuery({
    queryKey: ["admin-commissions"],
    queryFn: async () => {
      const res = await api.get("/admin/commissions");
      return res.data;
    },
  });

  const createMut = useMutation({
    mutationFn: (d) => editId ? api.patch(`/admin/commissions/${editId}`, d) : api.post("/admin/commissions", d),
    onSuccess: () => {
      qc.invalidateQueries(["admin-commissions"]);
      toast.success(editId ? "Commission updated" : "Commission created");
      setShowForm(false);
      setEditId(null);
      setForm({ label: "", slabs: [emptySlab()], isDefault: false });
    },
    onError: () => toast.error("Failed to save commission"),
  });

  const commissions = data || [];

  const addSlab = () => setForm(f => ({ ...f, slabs: [...f.slabs, emptySlab()] }));
  const removeSlab = (i) => setForm(f => ({ ...f, slabs: f.slabs.filter((_, idx) => idx !== i) }));
  const setSlab = (i, key, val) => setForm(f => {
    const slabs = [...f.slabs];
    slabs[i] = { ...slabs[i], [key]: val };
    return { ...f, slabs };
  });

  const handleEdit = (c) => {
    setEditId(c._id);
    setForm({ label: c.label, slabs: c.slabs.map(s => ({ minAmount: s.minAmount, maxAmount: s.maxAmount || "", rate: s.rate })), isDefault: c.isDefault });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const slabs = form.slabs.map(s => ({ minAmount: Number(s.minAmount), maxAmount: s.maxAmount ? Number(s.maxAmount) : undefined, rate: Number(s.rate) }));
    createMut.mutate({ ...form, slabs });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commission Engine</h1>
          <p className="text-gray-500 text-sm mt-1">Configure dynamic commission slabs</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm({ label: "", slabs: [emptySlab()], isDefault: false }); }}
          className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Config
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card p-6 border-2 border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editId ? "Edit" : "New"} Commission Config</h2>
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
                <input className="input" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} placeholder="e.g. Standard Rate" required />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} className="w-4 h-4 accent-purple-600" />
                <label htmlFor="isDefault" className="text-sm text-gray-700">Set as Default Config</label>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Commission Slabs</label>
                <button type="button" onClick={addSlab} className="text-purple-600 text-sm flex items-center gap-0.5 hover:underline">
                  <Plus className="w-3.5 h-3.5" /> Add Slab
                </button>
              </div>
              <div className="space-y-2">
                {form.slabs.map((s, i) => (
                  <div key={i} className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
                    <input type="number" className="input flex-1 min-w-[80px] text-sm" value={s.minAmount} onChange={e => setSlab(i, "minAmount", e.target.value)} placeholder="Min ₹" required />
                    <input type="number" className="input flex-1 min-w-[80px] text-sm" value={s.maxAmount} onChange={e => setSlab(i, "maxAmount", e.target.value)} placeholder="Max ₹ (∞)" />
                    <input type="number" className="input w-20 sm:w-24 text-sm" value={s.rate} onChange={e => setSlab(i, "rate", e.target.value)} placeholder="%" required min={0} max={100} step={0.1} />
                    <span className="text-gray-400 text-sm">%</span>
                    {form.slabs.length > 1 && (
                      <button type="button" onClick={() => removeSlab(i)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">Commission rate applied as % of order value within the amount range</p>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="btn-outline flex-1">Cancel</button>
              <button type="submit" disabled={createMut.isPending} className="btn-primary flex-1">
                {createMut.isPending ? "Saving..." : (editId ? "Update" : "Create")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Commission List */}
      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : commissions.length === 0 ? (
        <div className="text-center py-16 card">
          <Percent className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No commission configs yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {commissions.map(c => (
            <div key={c._id} className={`card p-5 ${c.isDefault ? "border-2 border-purple-200" : ""}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Percent className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-gray-900">{c.label}</p>
                      {c.isDefault && <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Default</span>}
                      {!c.isActive && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Inactive</span>}
                    </div>
                    <p className="text-xs text-gray-400 capitalize">{c.appliedTo === "global" ? "Global Config" : `Vendor Override`}</p>
                  </div>
                </div>
                <button onClick={() => handleEdit(c)} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="text-left py-1 font-medium">Min Amount</th>
                      <th className="text-left py-1 font-medium">Max Amount</th>
                      <th className="text-left py-1 font-medium">Commission Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {c.slabs?.map((slab, i) => (
                      <tr key={i}>
                        <td className="py-1.5">{formatPrice(slab.minAmount)}</td>
                        <td className="py-1.5">{slab.maxAmount ? formatPrice(slab.maxAmount) : "No limit"}</td>
                        <td className="py-1.5 font-semibold text-purple-600">{slab.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
