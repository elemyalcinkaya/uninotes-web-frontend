import { Mail, User, Calendar, FileText, Upload, Edit2, Camera } from "lucide-react";
import { useState } from "react";

export default function Profile() {
  // Kullanıcı bilgileri state'leri
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("Elem Yalçınkaya");
  const [email, setEmail] = useState("elem.yalcinkaya@universite.edu.tr");
  const [joinDate] = useState("Ocak 2024");
  const [profileImage, setProfileImage] = useState("");

  // Kullanıcının yüklediği notlar (örnek veri)
  const uploadedNotes = [
    { id: 1, title: "Introduction to Programming", courseCode: "CS 101", uploadDate: "2024-01-15" },
    { id: 2, title: "Data Structures", courseCode: "CS 102", uploadDate: "2024-02-10" },
    { id: 3, title: "Database Management", courseCode: "CS 202", uploadDate: "2024-03-05" },
  ];

  // Profil fotoğrafı değiştirme
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

  // Profil bilgilerini kaydetme
  const handleSave = () => {
    setIsEditing(false);
    // Burada API'ye kaydetme işlemi yapılabilir
    console.log("Profil güncellendi:", { username, email });
  };

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

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Sol Kolon - Profil Kartı */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center sticky top-24">
              {/* Profil Fotoğrafı */}
              <div className="relative inline-block mb-6">
                <img
                  src={profileImage}
                  alt="Profil Fotoğrafı"
                  className="w-32 h-32 rounded-full border-4 border-purple-200 object-cover"
                />
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

              {/* Kullanıcı Adı */}
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {username}
              </h2>
              <p className="text-purple-600 font-medium mb-4">
                {email}
              </p>

              {/* İstatistikler */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">{uploadedNotes.length}</p>
                  <p className="text-sm text-gray-600">Paylaşılan Not</p>
                </div>
              </div>

              {/* Katılma Tarihi */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span className="text-sm">Katılım: {joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon - Detaylar */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hesap Bilgileri */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Hesap Bilgileri</h3>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    <Edit2 size={18} />
                    Düzenle
                  </button>
                ) : null}
              </div>

              <div className="space-y-6">
                {/* Kullanıcı Adı */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Kullanıcı Adı
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <User className="text-gray-400" size={20} />
                      <span className="text-gray-900">{username}</span>
                    </div>
                  )}
                </div>

                {/* E-posta */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    E-posta Adresi
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                      <Mail className="text-gray-400" size={20} />
                      <span className="text-gray-900">{email}</span>
                    </div>
                  )}
                </div>

                {/* Kaydet/İptal Butonları */}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
                    >
                      İptal
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Paylaşılan Notlar */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Paylaşılan Notlarım</h3>
                <div className="flex items-center gap-2 text-purple-600">
                  <Upload size={20} />
                  <span className="font-semibold">{uploadedNotes.length} Not</span>
                </div>
              </div>

              {uploadedNotes.length > 0 ? (
                <div className="space-y-4">
                  {uploadedNotes.map((note) => (
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
                          <p className="text-sm text-purple-600">{note.courseCode}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(note.uploadDate).toLocaleDateString('tr-TR')}
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