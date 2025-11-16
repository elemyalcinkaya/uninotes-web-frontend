import { FileText, Download, BookOpen, ChevronRight, Calendar, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";

// Burada kendi Note tipimizi tanımlıyoruz
interface Note {
  id: number;
  title: string;
  courseCode?: string;
  summary?: string;
  createdAt: string;
  fileCount?: number;
  files?: {
    id: number;
    title: string;
    fileUrl: string;
  }[];
}

export default function SharedNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const data = await apiService.notes.getAll();
      setNotes(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Notlar yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (noteId: number, fileName: string) => {
    try {
      // Önce notun dosyalarını al
      const note = await apiService.notes.getById(noteId);
      if (note.files && note.files.length > 0) {
        // İlk dosyayı indir
        const file = note.files[0];
        await apiService.files.download(file.id, file.title);
      } else {
        alert("Bu not için dosya bulunamadı");
      }
    } catch (err: any) {
      alert(err.message || "İndirme sırasında bir hata oluştu");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin mx-auto text-purple-600 mb-4" size={48} />
          <p className="text-gray-600">Notlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Paylaşılan Notlar
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            Tüm paylaşılan notları görüntüleyin ve indirin
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {notes.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <BookOpen className="text-purple-700" size={24} />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {note.title}
                  </h3>
                  {note.courseCode && (
                    <p className="text-sm text-purple-700 font-medium mb-2">
                      {note.courseCode}
                    </p>
                  )}
                  {note.summary && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {note.summary}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(note.createdAt).toLocaleDateString("tr-TR")}
                    </div>
                    {note.fileCount !== undefined && (
                      <span className="text-purple-600 font-medium">
                        {note.fileCount} dosya
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleDownload(note.id, note.title)}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={18} />
                    İndir
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <FileText className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Henüz not yok</h3>
            <p className="text-gray-500">İlk notu paylaşan siz olun!</p>
          </div>
        )}
      </main>
    </div>
  );
}
