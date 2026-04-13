import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Headphones, Plus, MessageSquare, X, Send } from "lucide-react";

const statusColors = {
  open: "bg-blue-50 text-blue-700",
  in_progress: "bg-yellow-50 text-yellow-700",
  resolved: "bg-green-50 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function VendorSupport() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", category: "order", priority: "medium" });

  const { data, isLoading } = useQuery({
    queryKey: ["vendor-tickets"],
    queryFn: () => api.get("/support/tickets"),
  });

  const detailQ = useQuery({
    queryKey: ["vendor-ticket", selected],
    queryFn: () => api.get(`/support/tickets/${selected}`),
    enabled: !!selected,
  });

  const createMut = useMutation({
    mutationFn: (payload) => api.post("/support/tickets", payload),
    onSuccess: () => {
      toast.success("Ticket created");
      qc.invalidateQueries({ queryKey: ["vendor-tickets"] });
      setShowNew(false);
      setNewTicket({ subject: "", description: "", category: "order", priority: "medium" });
    },
    onError: (err) => toast.error(err?.message || "Failed"),
  });

  const replyMut = useMutation({
    mutationFn: (msg) => api.post(`/support/tickets/${selected}/reply`, { message: msg }),
    onSuccess: () => {
      setReply("");
      qc.invalidateQueries({ queryKey: ["vendor-ticket", selected] });
    },
  });

  const tickets = data?.data || [];
  const ticket = detailQ.data?.data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Headphones className="w-6 h-6 text-pink-600" /> Support
        </h1>
        <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {showNew && (
        <div className="card p-6 border-2 border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Create Support Ticket</h3>
            <button onClick={() => setShowNew(false)}><X className="w-4 h-4 text-gray-400" /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); createMut.mutate(newTicket); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input" value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}>
                  <option value="order">Order</option>
                  <option value="payment">Payment</option>
                  <option value="product">Product</option>
                  <option value="shipping">Shipping</option>
                  <option value="account">Account</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="input" value={newTicket.priority} onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input className="input" required value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} placeholder="Brief description of your issue" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="input min-h-[100px]" required value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} placeholder="Provide details about your issue..." />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowNew(false)} className="btn-outline">Cancel</button>
              <button type="submit" disabled={createMut.isPending} className="btn-primary">{createMut.isPending ? "Creating..." : "Submit Ticket"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 card p-0 overflow-hidden max-h-[70vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />)}</div>
          ) : tickets.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No tickets yet</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {tickets.map((t) => (
                <button key={t._id} onClick={() => setSelected(t._id)} className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${selected === t._id ? "bg-pink-50 border-l-4 border-pink-600" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-gray-400">#{t.ticketNumber}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>{t.status?.replace("_", " ")}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{t.subject}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(t.createdAt)}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 card p-6">
          {!selected ? (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a ticket to view conversation</p>
              </div>
            </div>
          ) : !ticket ? (
            <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-gray-400">#{ticket.ticketNumber}</p>
                  <h3 className="text-lg font-bold text-gray-900">{ticket.subject}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>{ticket.status?.replace("_", " ")}</span>
                    <span className="text-xs text-gray-400">{ticket.category} &middot; {ticket.priority}</span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-gray-100 rounded"><X className="w-4 h-4" /></button>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700">{ticket.description}</p>
              </div>
              <div className="space-y-3 max-h-[35vh] overflow-y-auto">
                {ticket.replies?.map((r, i) => (
                  <div key={i} className={`p-3 rounded-xl ${r.senderRole === "admin" ? "bg-purple-50 ml-4 lg:ml-8" : "bg-pink-50 mr-4 lg:mr-8"}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{r.senderRole === "admin" ? "Support Team" : "You"}</span>
                      <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700">{r.message}</p>
                  </div>
                ))}
              </div>
              {ticket.status !== "closed" && (
                <div className="flex gap-2">
                  <input
                    className="input flex-1"
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && reply.trim() && replyMut.mutate(reply)}
                  />
                  <button onClick={() => reply.trim() && replyMut.mutate(reply)} disabled={replyMut.isPending || !reply.trim()} className="btn-primary px-4">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
