import { Upload, FileText, X } from "lucide-react";
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
    // Check file size
    if (file.size > 50 * 1024 * 1024) {
      setError("File size cannot exceed 50MB");
      return;
    }

    // Check file type
    const allowedExtensions = ['.pdf', '.docx', '.jpeg', '.jpg'];
    const fileName = file.name.toLowerCase();
    const isAllowed = allowedExtensions.some(ext => fileName.endsWith(ext));

    if (!isAllowed) {
      setError("Only .pdf, .docx, and .jpeg files are allowed");
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
      setError("Please fill in the file and title fields!");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // CREATE NOTE
      const note = await apiService.notes.create({
        title,
        courseCode: courseCode || undefined,
        summary: summary || undefined,
        classLevel,
        semester,
        isShared: true,
      });

      // UPLOAD FILE
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
      setError(err.message || "An error occurred during upload");
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Add Note</h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            Share your notes and help your peers
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-4 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8">

          {/* DOSYA */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload File
            </label>
            <p className="text-xs text-gray-500 mb-2">
              📎 Allowed file types: <span className="font-medium text-purple-600">.pdf, .docx, .jpeg</span>
            </p>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${dragActive
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 bg-gray-50"
                }`}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileInput}
                accept=".pdf,.docx,.jpeg,.jpg"
              />

              {!selectedFile ? (
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center py-12 cursor-pointer"
                >
                  <Upload className="mb-4 text-gray-400" size={48} />
                  <p className="text-lg font-medium text-gray-700 mb-2">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    or
                  </p>
                  <span className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
                    Choose File
                  </span>
                  <p className="text-xs text-gray-400 mt-3">
                    Supported: PDF, DOCX, JPEG (Max 50MB)
                  </p>
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
                placeholder="Note Title"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* Ders Kodu */}
              <input
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                placeholder="Course Code (Optional)"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* SINIF */}
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value={1}>1st Year</option>
                <option value={2}>2nd Year</option>
                <option value={3}>3rd Year</option>
                <option value={4}>4th Year</option>
              </select>

              {/*DÖNEM */}
              <select
                value={semester}
                onChange={(e) => setSemester(Number(e.target.value))}
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value={1}>Fall</option>
                <option value={2}>Spring</option>
              </select>

              {/* Özet */}
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Note Summary"
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
            {uploading ? "Uploading..." : uploadSuccess ? "Uploaded!" : "Upload Note"}
          </button>
        </div>
      </main>
    </div>
  );
}
