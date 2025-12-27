import { Upload, FileText, X, Check } from "lucide-react";
import { useState } from "react";
import { apiService } from "../services/apiService";
import { useNavigate } from "react-router-dom";

export default function AddNotes() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);

  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [summary, setSummary] = useState("");

  // 🔴 YENİ: sınıf & dönem
  const [classLevel, setClassLevel] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: globalThis.File) => {
    if (file.size > 50 * 1024 * 1024) {
      setError("Dosya boyutu 50MB'dan büyük olamaz");
      return;
    }
    setSelectedFile(file);
    setError("");
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setTitle("");
    setCourseCode("");
    setSummary("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile || !title) {
      setError("Lütfen dosya ve başlık alanlarını doldurun!");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // 🔴 NOT OLUŞTUR
      const note = await apiService.notes.create({
        title,
        courseCode: courseCode || undefined,
        summary: summary || undefined,
        classLevel,   
        semester,     
        isShared: true,
      });

      // 🔴 DOSYA YÜKLE
      await apiService.files.upload(
        selectedFile,
        note.id,
        selectedFile.name
      );

      setUploadSuccess(true);

      setTimeout(() => {
        setSelectedFile(null);
        setTitle("");
        setCourseCode("");
        setSummary("");
        setUploadSuccess(false);
        navigate("/shared-notes");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Yükleme sırasında bir hata oluştu");
    } finally {
      setUploading(false);
    }
  };

  const isFormValid = selectedFile && title;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Not Ekle</h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            Notlarını paylaş, arkadaşlarına yardımcı ol
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* DOSYA */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Dosya Yükle
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                dragActive
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
              />

              {!selectedFile ? (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center py-12 cursor-pointer"
                >
                  <Upload className="mb-4 text-gray-400" size={48} />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Dosyayı sürükle bırak
                  </p>
                  <span className="bg-purple-600 text-white px-6 py-2 rounded-lg">
                    Dosya Seç
                  </span>
                </label>
              ) : (
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FileText className="text-purple-700" size={28} />
                    </div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button onClick={removeFile}>
                    <X size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* FORM */}
          {selectedFile && (
            <div className="space-y-6 mb-8">
              {/* Başlık */}
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Not Başlığı"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* Ders Kodu */}
              <input
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="Ders Kodu (Opsiyonel)"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* 🔴 SINIF */}
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value={1}>1. Sınıf</option>
                <option value={2}>2. Sınıf</option>
                <option value={3}>3. Sınıf</option>
                <option value={4}>4. Sınıf</option>
              </select>

              {/* 🔴 DÖNEM */}
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value={1}>Güz</option>
                <option value={2}>Bahar</option>
              </select>

              {/* Özet */}
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Not Özeti"
                rows={4}
                className="w-full px-4 py-3 border rounded-lg"
              />
            </div>
          )}

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <button
            onClick={handleUpload}
            disabled={!isFormValid || uploading || uploadSuccess}
            className="w-full py-4 rounded-xl bg-purple-600 text-white font-semibold"
          >
            {uploading ? "Yükleniyor..." : uploadSuccess ? "Yüklendi" : "Notu Yükle"}
          </button>
        </div>
      </main>
    </div>
  );
}
