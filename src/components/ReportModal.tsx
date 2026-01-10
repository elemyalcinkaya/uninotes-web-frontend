import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService, type ReportReason } from "../services/apiService";

interface ReportModalProps {
    noteId: number;
    onClose: () => void;
    onSuccess: () => void;
}

export default function ReportModal({ noteId, onClose, onSuccess }: ReportModalProps) {
    const [reportReasons, setReportReasons] = useState<ReportReason[]>([]);
    const [selectedReasonId, setSelectedReasonId] = useState<number | "">("");
    const [customText, setCustomText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadReportReasons();
    }, []);

    const loadReportReasons = async () => {
        try {
            const reasons = await apiService.reportReasons.getAll();
            setReportReasons(reasons);
        } catch (err: any) {
            setError("Failed to load report reasons");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedReasonId) {
            setError("Please select a reason");
            return;
        }

        // Check if "Other" is selected and custom text is required
        const selectedReason = reportReasons.find(r => r.id === Number(selectedReasonId));
        if (selectedReason?.reasonText === "Other" && !customText.trim()) {
            setError("Please provide details for 'Other' reason");
            return;
        }

        try {
            setLoading(true);
            setError("");
            await apiService.reports.create(noteId, Number(selectedReasonId));
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.message || "Failed to submit report");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-pink-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Report Note</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <p className="text-red-100 mt-2">Help us maintain a quality community</p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-3">
                            Why are you reporting this note?
                        </label>
                        <select
                            value={selectedReasonId}
                            onChange={(e) => {
                                setSelectedReasonId(e.target.value ? Number(e.target.value) : "");
                                setCustomText(""); // Reset custom text when changing reason
                            }}
                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all hover:border-red-300 bg-white"
                            required
                        >
                            <option value="">Select a reason...</option>
                            {reportReasons.map((reason) => (
                                <option key={reason.id} value={reason.id}>
                                    {reason.reasonText}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Custom Text Input for "Other" */}
                    {reportReasons.find(r => r.id === Number(selectedReasonId))?.reasonText === "Other" && (
                        <div className="mb-6 animate-fade-in">
                            <label className="block text-gray-700 font-semibold mb-3">
                                Please provide details:
                            </label>
                            <textarea
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value)}
                                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all hover:border-red-300 bg-white resize-none"
                                rows={4}
                                placeholder="Describe the issue..."
                                required
                            />
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-lg">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedReasonId}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 transition-all shadow-lg hover:shadow-xl"
                        >
                            {loading ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Animation styles */}
            <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}
