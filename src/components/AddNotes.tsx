import { Upload, FileText, X, Check } from "lucide-react";
import { useState } from "react";

interface NoteFile {
  id: string;
  file: File;
  courseName: string;
  courseCode: string;
  description: string;
}

export default function AddNotes() {
  const [dragActive, setDragActive] = useState(false);
  const [noteFile, setNoteFile] = useState<NoteFile | null>(null);
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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

  const handleFile = (file: File) => {
    const newNote: NoteFile = {
      id: Date.now().toString(),
      file: file,
      courseName: "",
      courseCode: "",
      description: ""
    };
    setNoteFile(newNote);
  };

  const removeFile = () => {
    setNoteFile(null);
    setCourseName("");
    setCourseCode("");
    setDescription("");
  };

  const handleUpload = () => {
    if (!noteFile || !courseName || !courseCode || !description) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    setUploading(true);
    
    // Simulated upload
    setTimeout(() => {
      console.log("Uploading note:", {
        file: noteFile.file.name,
        courseName,
        courseCode,
        description
      });
      setUploading(false);
      setUploadSuccess(true);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setNoteFile(null);
        setCourseName("");
        setCourseCode("");
        setDescription("");
        setUploadSuccess(false);
      }, 2000);
    }, 1500);
  };

  const isFormValid = noteFile && courseName && courseCode && description;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Not Ekle
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            Notlarını paylaş, arkadaşlarına yardımcı ol
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Drag and Drop Area */}
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
              
              {!noteFile ? (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center py-12 cursor-pointer"
                >
                  <Upload
                    className={`mb-4 ${
                      dragActive ? "text-purple-600" : "text-gray-400"
                    }`}
                    size={48}
                  />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Dosyayı sürükle bırak
                  </p>
                  <p className="text-sm text-gray-500 mb-4">veya</p>
                  <span className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Dosya Seç
                  </span>
                  <p className="text-xs text-gray-400 mt-4">
                    PDF, DOC, DOCX, PPT, PPTX (Maks. 50MB)
                  </p>
                </label>
              ) : (
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <FileText className="text-purple-700" size={28} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {noteFile.file.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(noteFile.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={removeFile}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          {noteFile && (
            <div className="space-y-6 mb-8">
              {/* Course Name */}
              <div>
                <label
                  htmlFor="course-name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Ders Adı
                </label>
                <input
                  id="course-name"
                  type="text"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Örn: Introduction to Programming"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Course Code */}
              <div>
                <label
                  htmlFor="course-code"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Ders Kodu
                </label>
                <input
                  id="course-code"
                  type="text"
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="Örn: CS 101"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Not Açıklaması
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu notlar hangi konuları içeriyor? (Örn: Döngüler, diziler, fonksiyonlar)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {description.length}/500 karakter
                </p>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!isFormValid || uploading || uploadSuccess}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              isFormValid && !uploading && !uploadSuccess
                ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Yükleniyor...
              </>
            ) : uploadSuccess ? (
              <>
                <Check size={24} />
                Başarıyla Yüklendi!
              </>
            ) : (
              <>
                <Upload size={24} />
                Notu Yükle
              </>
            )}
          </button>

          {!isFormValid && noteFile && (
            <p className="text-sm text-amber-600 text-center mt-4">
              Lütfen tüm alanları doldurun
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-xl p-6">
          <h3 className="font-semibold text-purple-900 mb-3">
            📚 Not Paylaşım Kuralları
          </h3>
          <ul className="text-sm text-purple-800 space-y-2">
            <li>• Sadece kendi hazırladığınız veya paylaşım izni olan notları yükleyin</li>
            <li>• Notlarınızın okunaklı ve düzenli olduğundan emin olun</li>
            <li>• Uygun olmayan içerik paylaşmayın</li>
            <li>• Dosya boyutu 50MB'ı geçmemelidir</li>
          </ul>
        </div>
      </main>
    </div>
  );
}