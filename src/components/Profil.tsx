import {
  Mail,
  User,
  Calendar,
  FileText,
  Upload,
  Edit2,
  Camera,
  Loader
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

  // 🔴 EKLENDİ – SADECE BU
  isShared?: boolean;

  files?: {
    id: number;
    title: string;
    fileUrl: string;
  }[];
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [uploadedNotes, setUploadedNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState("");

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    console.log("Profil güncellendi:", { username, email });
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
        <div className="mx-auto max-w-7xl px-4 py-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Profilim
          </h1>
          <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
            Hesap bilgilerinizi görüntüleyin ve düzenleyin
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sol Kolon */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center sticky top-24">
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-purple-200 bg-purple-100 flex items-center justify-center text-4xl font-bold text-purple-700">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {profileImage && (
                  <img
                    src={profileImage}
                    alt="Profil Fotoğrafı"
                    className="w-32 h-32 rounded-full border-4 border-purple-200 object-cover absolute inset-0"
                  />
                )}
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg"
                >
                  <Camera size={20} />
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {username}
              </h2>
              <p className="text-purple-600 font-medium mb-4">
                {email}
              </p>

              {/* 🔴 SAYAÇ DÜZELTİLDİ */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">
                    {uploadedNotes.filter(n => n.isShared).length}
                  </p>
                  <p className="text-sm text-gray-600">Paylaşılan Not</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span className="text-sm">Kullanıcı ID: {user.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon */}
          <div className="lg:col-span-2 space-y-8">
            {/* Paylaşılan Notlar */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Paylaşılan Notlarım</h3>
                <div className="flex items-center gap-2 text-purple-600">
                  <Upload size={20} />
                  <span className="font-semibold">
                    {uploadedNotes.filter(n => n.isShared).length} Not
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <Loader className="animate-spin mx-auto text-purple-600 mb-4" size={32} />
                  <p className="text-gray-500">Yükleniyor...</p>
                </div>
              ) : uploadedNotes.length > 0 ? (
                <div className="space-y-4">
                  {uploadedNotes
                      .filter(note => note.isShared)
                      .map((note) => (
                    <div
                      key={note.id}
                      className="flex items-center justify-between p-4 bg-gray-50 hover:bg-purple-50 rounded-xl transition-colors border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-purple-100 p-3 rounded-lg">
                          <FileText className="text-purple-700" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{note.title}</h4>
                          {note.courseCode && (
                            <p className="text-sm text-purple-600">{note.courseCode}</p>
                          )}
                          {/* 🔴 EKLENDİ */}
                          {note.isShared && (
                            <p className="text-xs text-green-600 font-medium">
                              🌍 Paylaşılan
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString("tr-TR")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">Henüz not paylaşmadınız</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
