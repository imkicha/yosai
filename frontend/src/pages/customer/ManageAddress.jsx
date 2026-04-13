import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Plus, Trash2, Edit2, ArrowLeft, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import api from "@/lib/api";
import toast from "react-hot-toast";

const emptyForm = { label: "Home", name: "", phone: "", street: "", city: "", state: "", pincode: "", isDefault: false };

export default function ManageAddress() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const { data, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await api.get("/user/addresses");
      return res.data;
    },
  });

  const addresses = data || [];

  const addMut = useMutation({
    mutationFn: (addr) => api.post("/user/addresses", addr),
    onSuccess: () => { qc.invalidateQueries(["addresses"]); setDialogOpen(false); toast.success("Address added"); },
    onError: (err) => toast.error(err?.message || "Failed to add address"),
  });

  const updateMut = useMutation({
    mutationFn: ({ id, ...data }) => api.put(`/user/addresses/${id}`, data),
    onSuccess: () => { qc.invalidateQueries(["addresses"]); setDialogOpen(false); toast.success("Address updated"); },
    onError: (err) => toast.error(err?.message || "Failed to update address"),
  });

  const deleteMut = useMutation({
    mutationFn: (id) => api.delete(`/user/addresses/${id}`),
    onSuccess: () => { qc.invalidateQueries(["addresses"]); toast.success("Address removed"); },
    onError: () => toast.error("Failed to remove address"),
  });

  const defaultMut = useMutation({
    mutationFn: (id) => api.patch(`/user/addresses/${id}/default`),
    onSuccess: () => qc.invalidateQueries(["addresses"]),
  });

  const openAdd = () => { setForm(emptyForm); setEditId(null); setDialogOpen(true); };
  const openEdit = (addr) => { setForm({ label: addr.label, name: addr.name, phone: addr.phone, street: addr.street, city: addr.city, state: addr.state, pincode: addr.pincode, isDefault: addr.isDefault }); setEditId(addr._id); setDialogOpen(true); };

  const handleSave = () => {
    if (!form.name || !form.phone || !form.street || !form.city || !form.state || !form.pincode) {
      toast.error("Please fill all required fields");
      return;
    }
    if (editId) {
      updateMut.mutate({ id: editId, ...form });
    } else {
      addMut.mutate(form);
    }
  };

  const isSaving = addMut.isPending || updateMut.isPending;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Manage Addresses</h1>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <MapPin className="mx-auto w-12 h-12 mb-3 text-gray-300" />
                <p>No saved addresses</p>
              </div>
            )}
            {addresses.map((addr) => (
              <motion.div key={addr._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`bg-white rounded-xl p-4 shadow-sm border flex items-start justify-between gap-4 ${addr.isDefault ? "border-pink-300" : "border-gray-100"}`}>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-pink-50 rounded-full p-2">
                    <MapPin className="w-4 h-4 text-pink-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {addr.label && <p className="text-xs font-semibold text-pink-600 uppercase">{addr.label}</p>}
                      {addr.isDefault && <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">Default</span>}
                    </div>
                    <p className="text-sm font-medium text-gray-800">{addr.name} · {addr.phone}</p>
                    <p className="text-sm text-gray-600">{addr.street}</p>
                    <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  {!addr.isDefault && (
                    <button onClick={() => defaultMut.mutate(addr._id)} className="p-2 rounded-full hover:bg-yellow-50 transition text-yellow-500" title="Set as default">
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => openEdit(addr)} className="p-2 rounded-full hover:bg-gray-100 transition text-gray-500">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteMut.mutate(addr._id)} disabled={deleteMut.isPending} className="p-2 rounded-full hover:bg-red-50 transition text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}

            <Button onClick={openAdd} className="w-full border-2 border-dashed border-pink-300 bg-white text-pink-600 hover:bg-pink-50" variant="outline">
              <Plus className="mr-2 w-4 h-4" /> Add New Address
            </Button>
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit Address" : "Add Address"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Label</Label>
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home" />
              </div>
              <div className="flex items-end gap-2">
                <input type="checkbox" id="isDefault" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="accent-pink-600" />
                <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default</label>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Full Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label>Street Address *</Label>
              <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="Door No, Street, Area" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City *</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
              <div>
                <Label>State *</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
              </div>
            </div>
            <div>
              <Label>Pincode *</Label>
              <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
            </div>
            <Button onClick={handleSave} disabled={isSaving} className="w-full bg-gradient-to-r from-pink-600 to-purple-600">
              <Check className="mr-2 w-4 h-4" />
              {isSaving ? "Saving..." : "Save Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
