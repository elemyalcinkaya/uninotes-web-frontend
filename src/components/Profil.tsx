import {
  FileText,
  Upload,
  Loader,
  Trash2
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../services/apiService";

interface Note {
  id: number;
  title: string;
  courseCode?: string;
  summary?: string;
  createdAt: string;
  fileCount?: number;

  isShared?: boolean;

  files?: {
    id: number;
    title: string;
    fileUrl: string;
  }[];
}

export default function Profile() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [uploadedNotes, setUploadedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setUsername(user.name);
      setEmail(user.email);
      loadUserNotes();
    }
  }, [user]);

  const loadUserNotes = async () => {
    try {
      setLoading(true);


      const notes = await apiService.notes.getMyNotes();


      setUploadedNotes(notes);
    } catch (err) {
      console.error("Notlar yüklenirken hata:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: number, noteTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${noteTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await apiService.notes.delete(noteId);
      // Refresh the notes list
      await loadUserNotes();
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err.message || "An error occurred while deleting the note");
    }
  };


  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Profile
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            View and manage your account information
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sol Kolon */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-2xl p-8 text-center sticky top-24 border border-purple-100 hover:shadow-purple-200/50 transition-all duration-300">
              <div className="mb-6">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-purple-200 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center text-5xl font-bold text-purple-700 shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {username}
              </h2>
              <p className="text-purple-600 font-medium mb-4">
                {email}
              </p>

              {/* Counter */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <p className="text-3xl font-bold text-purple-600">
                    {uploadedNotes.filter(n => n.isShared).length}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Shared Notes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shared Notes */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-purple-100 hover:shadow-purple-200/50 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">My Shared Notes</h3>
                <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-4 py-2 rounded-xl">
                  <Upload size={20} />
                  <span className="font-semibold">
                    {uploadedNotes.filter(n => n.isShared).length} Notes
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader className="animate-spin mx-auto text-purple-600 mb-4" size={32} />
                  <p className="text-gray-500">Loading...</p>
                </div>
              ) : uploadedNotes.length > 0 ? (
                <div className="space-y-4">
                  {uploadedNotes
                    .filter(note => note.isShared)
                    .map((note) => (
                      <div
                        key={note.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-purple-50 hover:from-purple-50 hover:to-purple-100 rounded-xl transition-all duration-300 border border-gray-100 hover:border-purple-200 hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-3 rounded-lg shadow-sm">
                            <FileText className="text-purple-700" size={24} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{note.title}</h4>
                            {note.courseCode && (
                              <p className="text-sm text-purple-600">{note.courseCode}</p>
                            )}
                            {note.isShared && (
                              <p className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                Shared
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString("en-US")}
                          </div>
                          <button
                            onClick={() => handleDelete(note.id, note.title)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md"
                            title="Delete note"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">You haven't shared any notes yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
