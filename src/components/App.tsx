import { Upload, BookOpen, FileText, Home, User, LogOut } from "lucide-react";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";

import logo from "../assets/last-logo.png";
import About from "./About";
import SharedNotes from "./SharedNotes";
import AddNotes from "./AddNotes";
import Profil from "./Profil";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import { AuthProvider, useAuth } from "../hooks/useAuth";

function NavLink({ icon: Icon, label, to }: { icon: any; label: string; to: string }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition"
    >
      <Icon size={18} />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function Card({
  icon: Icon,
  title,
  desc,
  to,
}: {
  icon: any;
  title: string;
  desc: string;
  to?: string;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group w-full md:w-[380px] rounded-2xl bg-purple-200/60 hover:bg-purple-200 transition p-8 text-center shadow-sm"
    >
      <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded-full bg-white/70 ring-1 ring-white/60 group-hover:scale-105 transition">
        <Icon className="text-purple-700" size={44} />
      </div>
      <h3 className="text-2xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-700 leading-relaxed">{desc}</p>
    </button>
  );
}

function HomePage() {
  return (
    <>
      {/* Hero */}
      <main className="mx-auto max-w-7xl px-4">
        <section className="py-14 text-center">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
            Welcome to <span className="text-purple-700">UniNotes</span>!
          </h1>
        </section>

        {/* Cards */}
        <section className="pb-20 grid gap-8 md:grid-cols-3 place-items-center">
          <Card
            icon={BookOpen}
            title="About"
            desc="Learn more about UniNotes and how we help students share knowledge"
            to="/about"
          />
          <Card
            icon={FileText}
            title="Shared Notes"
            desc="Browse and download notes shared by fellow students"
            to="/shared-notes"
          />
          <Card
            icon={Upload}
            title="Add Your Note!"
            desc="Share your notes with the community and help others succeed"
            to="/add-notes"
          />
        </section>
      </main>
    </>
  );
}

function Layout() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Loading state - show minimal UI while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-purple-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <button
            onClick={handleLogoClick}
            className="cursor-pointer hover:opacity-80 transition"
          >
            <img src={logo} alt="UniNotes Logo" className="h-11 md:h-12 w-auto" />
          </button>
          <nav className="hidden md:flex items-center gap-4">
            <NavLink icon={Home} label="About" to="/about" />

            {isAuthenticated && user && (
              <span className="text-sm mr-2">
                Hoş geldin, <span className="font-semibold">{user.name}</span>
              </span>
            )}

            {isAuthenticated && (
              <>
                <NavLink icon={FileText} label="Shared Notes" to="/shared-notes" />
                <NavLink icon={Upload} label="Add Note" to="/add-notes" />
                <NavLink icon={User} label="Profile" to="/profile" />
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition"
                >
                  <span className="font-medium">Login</span>
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg:white/20 bg-white/20 hover:bg-white/30 transition"
                >
                  <span className="font-medium">Register</span>
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="shared-notes"
            element={
              <ProtectedRoute>
                <SharedNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="add-notes"
            element={
              <ProtectedRoute>
                <AddNotes />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profil />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </AuthProvider>  
  );
}
