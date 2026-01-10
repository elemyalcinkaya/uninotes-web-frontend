import { Upload, FileText, X } from "lucide-react";
import { useState, useEffect } from "react";
import { apiService } from "../services/apiService";
import type { Course } from "../services/apiService";
import { useNavigate } from "react-router-dom";

export default function AddNotes() {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [summary, setSummary] = useState("");

  const [classLevel, setClassLevel] = useState<number>(1);
  const [semester, setSemester] = useState<number>(1);

  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch courses when class level or semester changes
  useEffect(() => {
    const fetchCourses = async () => {
      setLoadingCourses(true);
      try {
        const fetchedCourses = await apiService.courses.getByClassLevelAndSemester(
          classLevel,
          semester
        );
        setCourses(fetchedCourses);
        // Reset course selection when class/semester changes
        setCourseCode("");
        setCourseName("");
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [classLevel, semester]);

  // Handle course selection
  const handleCourseChange = (selectedCourseCode: string) => {
    setCourseCode(selectedCourseCode);

    // Auto-fill course name if a course is selected
    const selectedCourse = courses.find(c => c.courseCode === selectedCourseCode);
    if (selectedCourse && selectedCourse.courseName) {
      setCourseName(selectedCourse.courseName);
    } else {
      setCourseName("");
    }
  };


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
    // Reset previous errors
    setError("");

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`❌ File size cannot exceed 50MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      setSelectedFile(null);
      return;
    }

    // Strict file type validation - ONLY allow PDF, DOCX, JPEG/JPG
    const allowedExtensions = ['.pdf', '.docx', '.jpeg', '.jpg'];
    const fileName = file.name.toLowerCase();
    const fileExtension = '.' + fileName.split('.').pop();

    const isAllowed = allowedExtensions.includes(fileExtension);

    if (!isAllowed) {
      setError(`❌ Invalid file type! Only PDF, DOCX, and JPEG files are allowed. You uploaded: ${fileExtension.toUpperCase()}`);
      setSelectedFile(null);
      // Show alert for extra emphasis
      alert(`⚠️ File Upload Blocked!\n\nOnly the following file types are allowed:\n• PDF (.pdf)\n• Word Document (.docx)\n• JPEG Image (.jpeg, .jpg)\n\nYou tried to upload: ${fileExtension.toUpperCase()}\n\nPlease select a valid file.`);
      return;
    }

    // File is valid
    setSelectedFile(file);
    setError("");

    // Auto-populate course name from filename if not already set
    if (!courseName) {
      setCourseName(file.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setCourseCode("");
    setCourseName("");
    setSummary("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile || !courseCode || !courseName) {
      setError("Please fill in the file, course code, and course name fields!");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // CREATE NOTE - use courseName as title
      const note = await apiService.notes.create({
        title: courseName,
        courseCode: courseCode,
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
        setCourseCode("");
        setCourseName("");
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

  const isFormValid = selectedFile && courseCode && courseName;

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
              Upload File *
            </label>
            <p className="text-xs text-gray-500 mb-2">
              📎 <span className="font-bold text-purple-700">ONLY</span> allowed file types: <span className="font-medium text-purple-600">.pdf, .docx, .jpeg/.jpg</span>
            </p>
            <p className="text-xs text-red-600 mb-2 font-medium">
              ⚠️ Other file types will be rejected
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
                accept=".pdf,.docx,image/jpeg,image/jpg"
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
              {/* CLASS LEVEL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Class Level
                </label>
                <select
                  value={classLevel}
                  onChange={(e) => setClassLevel(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
                </select>
              </div>

              {/* SEMESTER */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value={1}>Fall</option>
                  <option value={2}>Spring</option>
                </select>
              </div>

              {/* COURSE CODE - REQUIRED */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Code *
                </label>
                {loadingCourses ? (
                  <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                    Loading courses...
                  </div>
                ) : (
                  <select
                    value={courseCode}
                    onChange={(e) => handleCourseChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.courseCode}>
                        {course.courseCode}
                        {course.isElective && " (Elective)"}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* COURSE NAME - REQUIRED (replaces Note Title) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Name *
                </label>
                <input
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter course name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* SUMMARY */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Add a description for your note (optional)"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>
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
