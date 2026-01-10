import {
  FileText,
  Download,
  BookOpen,
  Calendar,
  Loader,
  Sparkles,
  TrendingUp,
  FileType,
  FileImage,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import ReportModal from "./ReportModal";

interface Note {
  id: number;
  title: string;
  courseCode?: string;
  summary?: string;
  createdAt: string;
  fileCount?: number;

  classLevel: number;
  semester: number;

  sharedBy?: {
    id: number;
    name: string;
  };
}

export default function SharedNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [fileInfo, setFileInfo] = useState<Record<number, string>>({});

  // FILTER STATES
  const [classLevel, setClassLevel] = useState<number | "">("");
  const [semester, setSemester] = useState<number | "">("");

  // REPORT MODAL STATE
  const [reportModalNoteId, setReportModalNoteId] = useState<number | null>(null);

  /* =====================
     LOAD NOTES
  ===================== */
  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await apiService.notes.getShared(
        classLevel || undefined,
        semester || undefined
      );
      setNotes(data);

      // Fetch file info for each note to get file names for icons
      const fileInfoMap: Record<number, string> = {};
      for (const note of data) {
        try {
          const files = await apiService.files.getAll(note.id);
          if (files && files.length > 0) {
            fileInfoMap[note.id] = files[0].title;
          }
        } catch (err) {
          console.error(`Failed to fetch file info for note ${note.id}:`, err);
        }
      }
      setFileInfo(fileInfoMap);

      setError("");
    } catch (err: any) {
      setError(err.message || "Error loading notes");
    } finally {
      setLoading(false);
    }
  };

  // RELOAD WHEN FILTERS CHANGE
  useEffect(() => {
    loadNotes();
  }, [classLevel, semester]);

  /* =====================
     FILE TYPE ICON HELPER
  ===================== */
  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase().split('.').pop();

    if (ext === 'pdf') {
      return (
        <div className="flex items-center gap-1.5 bg-red-100 text-red-700 px-2 py-1 rounded-md">
          <FileText size={16} />
          <span className="text-xs font-bold">PDF</span>
        </div>
      );
    }

    if (ext === 'docx' || ext === 'doc') {
      return (
        <div className="flex items-center gap-1.5 bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
          <FileType size={16} />
          <span className="text-xs font-bold">WORD</span>
        </div>
      );
    }

    if (ext === 'jpeg' || ext === 'jpg' || ext === 'png') {
      return (
        <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-2 py-1 rounded-md">
          <FileImage size={16} />
          <span className="text-xs font-bold">JPEG</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
        <FileText size={16} />
        <span className="text-xs font-bold">FILE</span>
      </div>
    );
  };

  /* =====================
     DOWNLOAD
  ===================== */
  const handleDownload = async (noteId: number) => {
    try {
      setDownloadingId(noteId);

      // Find the note in our current list
      const note = notes.find(n => n.id === noteId);

      if (!note) {
        alert("Note not found");
        return;
      }

      // For shared notes, we need to fetch the full note details including files
      // But we'll use the files endpoint directly to avoid 405 error
      const files = await apiService.files.getAll(noteId);

      if (files && files.length > 0) {
        const file = files[0];

        // Track the download
        try {
          await apiService.downloads.track(noteId, file.id);
        } catch (trackErr) {
          console.error("Failed to track download:", trackErr);
          // Continue with download even if tracking fails
        }

        await apiService.files.download(file.id, file.title);
      } else {
        alert("No files found for this note");
      }
    } catch (err: any) {
      console.error("Download error:", err);
      alert(err.message || "An error occurred during download");
    } finally {
      setDownloadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader className="animate-spin mx-auto text-purple-600 mb-4" size={48} />
            <Sparkles className="absolute top-0 right-0 text-purple-400 animate-pulse" size={20} />
          </div>
          <p className="text-gray-600 font-medium">Loading notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50">
      {/* HEADER */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center">

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 animate-fade-in-up">
            Shared Notes
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Browse and download notes shared by fellow students
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mt-8 animate-fade-in-up delay-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-3xl font-bold">
                <TrendingUp size={28} className="text-green-300" />
                {notes.length}
              </div>
              <p className="text-sm text-purple-200 mt-1">Available Notes</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12">

        {/* FILTER BAR */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-purple-100 animate-fade-in">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <BookOpen size={20} className="text-purple-600" />
              <span>Filter by:</span>
            </div>

            <select
              value={classLevel}
              onChange={(e) =>
                setClassLevel(e.target.value ? Number(e.target.value) : "")
              }
              className="flex-1 min-w-[150px] border-2 border-purple-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all hover:border-purple-300 bg-white"
            >
              <option value="">All Classes</option>
              <option value={1}>1st Year</option>
              <option value={2}>2nd Year</option>
              <option value={3}>3rd Year</option>
              <option value={4}>4th Year</option>
            </select>

            <select
              value={semester}
              onChange={(e) =>
                setSemester(e.target.value ? Number(e.target.value) : "")
              }
              className="flex-1 min-w-[150px] border-2 border-purple-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all hover:border-purple-300 bg-white"
            >
              <option value="">All Semesters</option>
              <option value={1}>Fall</option>
              <option value={2}>Spring</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-shake">
            <p className="text-sm text-red-600 font-medium">{error}</p>
          </div>
        )}

        {notes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note, index) => (
              <div
                key={note.id}
                className="group bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-purple-200 transition-all duration-300 hover:-translate-y-2 overflow-hidden animate-fade-in-up relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Card Header with Gradient */}
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

                {/* Report Button - Top Right */}
                <button
                  onClick={() => setReportModalNoteId(note.id)}
                  className="absolute top-4 right-4 z-10 bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-lg shadow-lg transition-all hover:scale-110 flex items-center gap-1.5 text-xs font-semibold"
                  title="Report this note"
                >
                  <AlertTriangle size={14} />
                  Report
                </button>

                <div className="p-6 pt-12">
                  {/* Icon */}
                  <div className="relative mb-4">
                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <BookOpen className="text-purple-700" size={28} />
                    </div>
                    {note.fileCount && note.fileCount > 1 && (
                      <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                        {note.fileCount}
                      </div>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Class + Semester Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {note.classLevel}th Year
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
                      {note.semester === 1 ? "Fall" : "Spring"}
                    </span>
                  </div>

                  {/* Shared By */}
                  {(note.sharedBy || (note as any).user) && (
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Shared by:{" "}
                      <span className="font-semibold text-purple-700">
                        {note.sharedBy?.name || (note as any).user?.name || 'Unknown'}
                      </span>
                    </p>
                  )}

                  {/* Course Code */}
                  {note.courseCode && (
                    <div className="mb-3">
                      <span className="inline-block bg-gray-100 text-gray-700 text-sm font-mono px-3 py-1 rounded-lg">
                        {note.courseCode}
                      </span>
                    </div>
                  )}

                  {/* Summary */}
                  {note.summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {note.summary}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} />
                      {new Date(note.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </div>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownload(note.id)}
                    disabled={downloadingId === note.id}
                    className="mt-4 w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold group-hover:scale-105"
                  >
                    {downloadingId === note.id ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        Downloading...
                      </>
                    ) : (
                      <>
                        {fileInfo[note.id] && getFileIcon(fileInfo[note.id])}
                        <Download size={18} />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-purple-100 animate-fade-in">
            <div className="relative inline-block mb-6">
              <FileText className="mx-auto text-gray-300" size={80} />
              <Sparkles className="absolute -top-2 -right-2 text-purple-400 animate-pulse" size={24} />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No notes found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              No notes match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        )}
      </main>

      {/* Report Modal */}
      {reportModalNoteId !== null && (
        <ReportModal
          noteId={reportModalNoteId}
          onClose={() => setReportModalNoteId(null)}
          onSuccess={() => {
            alert("Report submitted successfully. Thank you for helping us maintain quality!");
          }}
        />
      )}

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-out;
        }

        .delay-100 {
          animation-delay: 100ms;
        }

        .delay-200 {
          animation-delay: 200ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
