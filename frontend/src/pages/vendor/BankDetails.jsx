import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Landmark, Plus, Pencil, Trash2, Star, X, CheckCircle } from "lucide-react";

const emptyForm = { bankName: "", accountHolderName: "", accountNumber: "", ifscCode: "", accountType: "savings" };

export default function VendorBankDetails() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-banks"],
    queryFn: () => api.get("/vendor-bank"),
  });

  const saveMut = useMutation({
    mutationFn: (payload) => editId ? api.put(`/vendor-bank/${editId}`, payload) : api.post("/vendor-bank", payload),
    onSuccess: () => {
      toast.success(editId ? "Updated" : "Bank account added");
      qc.invalidateQueries({ queryKey: ["vendor-banks"] });
      closeForm();
    },
    onError: (err) => toast.error(err?.message || "Failed"),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/vendor-bank/${id}`),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["vendor-banks"] }); },
  });

  const primaryMut = useMutation({
    mutationFn: (id) => api.patch(`/vendor-bank/${id}/primary`),
    onSuccess: () => { toast.success("Primary account updated"); qc.invalidateQueries({ queryKey: ["vendor-banks"] }); },
  });

  const closeForm = () => { setShowForm(false); setEditId(null); setForm(emptyForm); };
  const openEdit = (b) => {
    setForm({ bankName: b.bankName, accountHolderName: b.accountHolderName, accountNumber: b.accountNumber, ifscCode: b.ifscCode, accountType: b.accountType });
    setEditId(b._id);
    setShowForm(true);
  };

  const banks = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Landmark className="w-6 h-6 text-pink-600" /> Bank Details
        </h1>
        <button onClick={() => { closeForm(); setShowForm(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Account
        </button>
      </div>

      {showForm && (
        <div className="card p-6 border-2 border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">{editId ? "Edit Account" : "Add Bank Account"}</h3>
            <button onClick={closeForm}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveMut.mutate(form); }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input className="input" required value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} placeholder="State Bank of India" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
              <input className="input" required value={form.accountHolderName} onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input className="input" required value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
              <input className="input uppercase" required value={form.ifscCode} onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })} placeholder="SBIN0001234" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
              <select className="input" value={form.accountType} onChange={(e) => setForm({ ...form, accountType: e.target.value })}>
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>
            </div>
            <div className="flex items-end gap-3">
              <button type="button" onClick={closeForm} className="btn-outline">Cancel</button>
              <button type="submit" disabled={saveMut.isPending} className="btn-primary">{saveMut.isPending ? "Saving..." : editId ? "Update" : "Add"}</button>
            </div>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3">{[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : banks.length === 0 ? (
        <div className="card p-12 text-center">
          <Landmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No bank accounts added yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {banks.map((b) => (
            <div key={b._id} className={`card p-5 ${b.isPrimary ? "border-2 border-pink-200" : ""}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center flex-shrink-0">
                    <Landmark className="w-5 h-5 text-pink-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">{b.bankName}</p>
                      {b.isPrimary && <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3" /> Primary</span>}
                      {b.isVerified && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Verified</span>}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{b.accountHolderName}</p>
                    <p className="text-sm text-gray-500 break-all">A/C: ****{b.accountNumber?.slice(-4)} &middot; IFSC: {b.ifscCode} &middot; {b.accountType}</p>
                    <p className={`text-xs mt-1 ${b.status === "approved" ? "text-green-600" : b.status === "rejected" ? "text-red-600" : "text-yellow-600"}`}>
                      Status: {b.status || "pending"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  {!b.isPrimary && (
                    <button onClick={() => primaryMut.mutate(b._id)} className="text-xs text-pink-600 hover:bg-pink-50 px-2 py-1 rounded-lg">Set Primary</button>
                  )}
                  <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-gray-100 rounded-lg"><Pencil className="w-4 h-4 text-gray-500" /></button>
                  <button onClick={() => { if (confirm("Delete this account?")) deleteMut.mutate(b._id); }} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
