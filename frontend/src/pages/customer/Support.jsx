import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { Headphones, Plus, MessageSquare, Send, X } from "lucide-react";

const statusColors = {
  open: "bg-blue-50 text-blue-700",
  in_progress: "bg-yellow-50 text-yellow-700",
  resolved: "bg-green-50 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export default function CustomerSupport() {
  const qc = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newTicket, setNewTicket] = useState({ subject: "", description: "", category: "order", priority: "medium" });

  const { data, isLoading } = useQuery({
    queryKey: ["my-tickets"],
    queryFn: () => api.get("/support/tickets"),
  });

  const detailQ = useQuery({
    queryKey: ["my-ticket", selected],
    queryFn: () => api.get(`/support/tickets/${selected}`),
    enabled: !!selected,
  });

  const createMut = useMutation({
    mutationFn: (payload) => api.post("/support/tickets", payload),
    onSuccess: () => {
      toast.success("Ticket submitted! We'll get back to you soon.");
      qc.invalidateQueries({ queryKey: ["my-tickets"] });
      setShowNew(false);
      setNewTicket({ subject: "", description: "", category: "order", priority: "medium" });
    },
    onError: (err) => toast.error(err?.message || "Failed to create ticket"),
  });

  const replyMut = useMutation({
    mutationFn: (msg) => api.post(`/support/tickets/${selected}/reply`, { message: msg }),
    onSuccess: () => {
      setReply("");
      qc.invalidateQueries({ queryKey: ["my-ticket", selected] });
    },
  });

  const tickets = data?.data || [];
  const ticket = detailQ.data?.data;

  if (showNew) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setShowNew(false)} className="text-gray-400 hover:text-gray-600">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-900">New Support Ticket</h1>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); createMut.mutate(newTicket); }} className="card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select className="input" value={newTicket.category} onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}>
                <option value="order">Order Issue</option>
                <option value="payment">Payment</option>
                <option value="product">Product</option>
                <option value="shipping">Shipping</option>
                <option value="refund">Refund</option>
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
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input className="input" required value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} placeholder="What do you need help with?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea className="input min-h-[120px]" required value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} placeholder="Please describe your issue in detail..." />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowNew(false)} className="btn-outline flex-1">Cancel</button>
            <button type="submit" disabled={createMut.isPending} className="btn-primary flex-1">{createMut.isPending ? "Submitting..." : "Submit Ticket"}</button>
          </div>
        </form>
      </div>
    );
  }

  if (selected && ticket) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">&larr;</button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-900">{ticket.subject}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-mono text-gray-400">#{ticket.ticketNumber}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[ticket.status]}`}>{ticket.status?.replace("_", " ")}</span>
            </div>
          </div>
        </div>
        <div className="card p-5 mb-4 bg-gray-50">
          <p className="text-sm text-gray-700">{ticket.description}</p>
          <p className="text-xs text-gray-400 mt-2">{formatDate(ticket.createdAt)}</p>
        </div>
        <div className="space-y-3 mb-4">
          {ticket.replies?.map((r, i) => (
            <div key={i} className={`card p-4 ${r.senderRole === "admin" ? "bg-purple-50 border-l-4 border-purple-400 ml-4" : "bg-white mr-4"}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold">{r.senderRole === "admin" ? "Support Team" : "You"}</span>
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
              placeholder="Type a reply..."
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
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        <button onClick={() => setShowNew(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>
      {isLoading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />)}</div>
      ) : tickets.length === 0 ? (
        <div className="card p-12 text-center">
          <Headphones className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-2">No support tickets yet</p>
          <p className="text-sm text-gray-400">Need help? Create a new ticket and our team will assist you.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <button key={t._id} onClick={() => setSelected(t._id)} className="card p-4 w-full text-left hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-gray-400">#{t.ticketNumber}</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[t.status]}`}>{t.status?.replace("_", " ")}</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{t.subject}</p>
              <p className="text-xs text-gray-400 mt-1">{t.category} &middot; {formatDate(t.createdAt)}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
