import {
  FileText,
  Download,
  BookOpen,
  Calendar,
  Loader
} from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";

/* =====================
   NOTE TYPE
===================== */
interface Note {
  id: number;
  title: string;
  courseCode?: string;
  summary?: string;
  createdAt: string;
  fileCount?: number;

  classLevel: number;   // 🔴
  semester: number;     // 🔴

  sharedBy?: {
    id: number;
    name: string;
  };
}

export default function SharedNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔴 FILTER STATES
  const [classLevel, setClassLevel] = useState<number | "">("");
  const [semester, setSemester] = useState<number | "">("");

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
      setError("");
    } catch (err: any) {
      setError(err.message || "Notlar yüklenirken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  // 🔴 FILTER DEĞİŞİNCE TEKRAR ÇEK
  useEffect(() => {
    loadNotes();
  }, [classLevel, semester]);

  /* =====================
     DOWNLOAD
  ===================== */
  const handleDownload = async (noteId: number) => {
    try {
      const note = await apiService.notes.getById(noteId);
      if (note.files && note.files.length > 0) {
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
      {/* HEADER */}
      <section className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Paylaşılan Notlar
          </h1>
          <p className="text-lg text-purple-100">
            Tüm paylaşılan notları görüntüleyin ve indirin
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">

        {/* 🔴 FILTER BAR */}
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={classLevel}
            onChange={(e) =>
              setClassLevel(e.target.value ? Number(e.target.value) : "")
            }
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Tüm Sınıflar</option>
            <option value={1}>1. Sınıf</option>
            <option value={2}>2. Sınıf</option>
            <option value={3}>3. Sınıf</option>
            <option value={4}>4. Sınıf</option>
          </select>

          <select
            value={semester}
            onChange={(e) =>
              setSemester(e.target.value ? Number(e.target.value) : "")
            }
            className="border rounded-lg px-3 py-2"
          >
            <option value="">Tüm Dönemler</option>
            <option value={1}>Güz</option>
            <option value={2}>Bahar</option>
          </select>
        </div>

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
                className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-3">
                    <BookOpen className="text-purple-700" size={24} />
                  </div>

                  <h3 className="text-xl font-semibold mb-1">
                    {note.title}
                  </h3>

                  {/* 🔴 SINIF + DÖNEM */}
                  <p className="text-xs text-gray-500 mb-2">
                    {note.classLevel}. Sınıf •{" "}
                    {note.semester === 1 ? "Güz" : "Bahar"}
                  </p>

                  {note.sharedBy && (
                    <p className="text-sm text-gray-500 mb-2">
                      Paylaşan:{" "}
                      <span className="font-medium text-purple-700">
                        {note.sharedBy.name}
                      </span>
                    </p>
                  )}

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

                  <div className="flex justify-between text-sm text-gray-500 mb-4">
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
                    onClick={() => handleDownload(note.id)}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl flex items-center justify-center gap-2"
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Henüz not yok
            </h3>
            <p className="text-gray-500">
              Filtreye uygun not bulunamadı
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
