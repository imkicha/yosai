import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";
import { FileText, Upload, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";

const statusIcons = {
  submitted: { icon: Clock, color: "text-blue-500", bg: "bg-blue-50", label: "Submitted" },
  pending: { icon: Clock, color: "text-yellow-500", bg: "bg-yellow-50", label: "Pending Review" },
  verified: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", label: "Verified" },
  approved: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-50", label: "Approved" },
  rejected: { icon: XCircle, color: "text-red-500", bg: "bg-red-50", label: "Rejected" },
};

export default function VendorDocuments() {
  const qc = useQueryClient();
  const [uploading, setUploading] = useState(null);

  const { data: requiredDocs } = useQuery({
    queryKey: ["required-docs"],
    queryFn: () => api.get("/documents/required"),
  });

  const { data: myDocs } = useQuery({
    queryKey: ["my-docs"],
    queryFn: () => api.get("/documents/my"),
  });

  const submitMut = useMutation({
    mutationFn: ({ documentId, fileUrl, identificationNumber }) =>
      api.post("/documents/submit", { documentId, fileUrl, identificationNumber }),
    onSuccess: () => {
      toast.success("Document submitted");
      qc.invalidateQueries({ queryKey: ["my-docs"] });
      setUploading(null);
    },
    onError: (err) => toast.error(err?.message || "Failed"),
  });

  const required = requiredDocs?.data || [];
  const submitted = myDocs?.data || [];
  const submittedMap = submitted.reduce((acc, d) => { acc[d.documentId?._id || d.documentId] = d; return acc; }, {});

  const handleSubmit = (docId, e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    submitMut.mutate({
      documentId: docId,
      fileUrl: formData.get("fileUrl"),
      identificationNumber: formData.get("identificationNumber"),
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <FileText className="w-6 h-6 text-pink-600" /> Documents
      </h1>

      <div className="grid gap-4">
        {required.map((doc) => {
          const existing = submittedMap[doc._id];
          const st = existing ? statusIcons[existing.verificationStatus] || statusIcons.pending : null;
          const StIcon = st?.icon || AlertCircle;

          return (
            <div key={doc._id} className="card p-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{doc.documentName}</p>
                      {doc.isRequired && <span className="text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">Required</span>}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">Type: {doc.documentType} &middot; Code: {doc.documentCode}</p>
                  </div>
                </div>
                {existing ? (
                  <div className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${st.bg} ${st.color}`}>
                    <StIcon className="w-3.5 h-3.5" /> {st.label}
                  </div>
                ) : (
                  <button onClick={() => setUploading(uploading === doc._id ? null : doc._id)} className="btn-outline text-xs flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                )}
              </div>

              {existing && (
                <div className="mt-3 pl-13 ml-13">
                  {existing.identificationNumber && <p className="text-xs text-gray-500">ID: {existing.identificationNumber}</p>}
                  {existing.fileUrl && <a href={existing.fileUrl} target="_blank" rel="noreferrer" className="text-xs text-pink-600 hover:underline">View Document</a>}
                  {existing.adminComment && <p className="text-xs text-gray-500 mt-1">Admin: {existing.adminComment}</p>}
                  {existing.verificationStatus === "rejected" && (
                    <button onClick={() => setUploading(doc._id)} className="text-xs text-pink-600 hover:underline mt-1">Re-upload</button>
                  )}
                </div>
              )}

              {uploading === doc._id && (
                <form onSubmit={(e) => handleSubmit(doc._id, e)} className="mt-4 p-4 bg-gray-50 rounded-xl space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">File URL</label>
                    <input name="fileUrl" className="input text-sm" required placeholder="https://..." />
                    <p className="text-xs text-gray-400 mt-1">Upload your file to cloud storage and paste the URL here</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Identification Number (optional)</label>
                    <input name="identificationNumber" className="input text-sm" placeholder="e.g., PAN number" />
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setUploading(null)} className="btn-outline text-xs">Cancel</button>
                    <button type="submit" disabled={submitMut.isPending} className="btn-primary text-xs">{submitMut.isPending ? "Submitting..." : "Submit"}</button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
