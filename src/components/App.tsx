import { Upload, BookOpen, FileText, Home, User, LogOut } from "lucide-react";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";

import logo from "../assets/last-logo.png";
import About from "./About";
import SharedNotes from "./SharedNotes";
import AddNotes from "./AddNotes";
import Profil from "./Profil";
import Login from "./Login";
import Register from "./Register";
import ContactUs from "./ContactUs.tsx";
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
      className="group relative w-full md:w-[380px] rounded-2xl bg-white hover:shadow-2xl transition-all duration-300 p-8 text-center shadow-lg border border-purple-100 hover:border-purple-300 hover:-translate-y-2 overflow-hidden"
    >
      {/* Gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500" />

      {/* Icon container */}
      <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 ring-4 ring-purple-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
        <Icon className="text-purple-700" size={44} />
      </div>

      {/* Content */}
      <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-purple-700 transition-colors">
        {title}
      </h3>
      <p className="text-gray-600 leading-relaxed">
        {desc}
      </p>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  );
}

function HomePage() {
  return (
    <>
      {/* Hero Section with Animated Background */}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50" />

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium">Your Knowledge Sharing Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight animate-fade-in-up">
            Welcome to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-200">
              UniNotes
            </span>
            !
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Share knowledge, collaborate with peers, and excel together
          </p>
        </div>
      </section>

      {/* Cards Section */}
      <main className="mx-auto max-w-7xl px-4 py-20 bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Get Started
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our features and start sharing knowledge today
          </p>
        </div>

        <section className="grid gap-8 md:grid-cols-3 place-items-center">
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

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
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
          <p className="text-gray-600">Loading...</p>
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
            {isAuthenticated && user && (
              <span className="text-sm mr-2">
                Welcome, <span className="font-semibold">{user.name}</span>
              </span>
            )}

            <NavLink icon={Home} label="About" to="/about" />

            {isAuthenticated && (
              <>
                <NavLink icon={FileText} label="Shared Notes" to="/shared-notes" />
                <NavLink icon={Upload} label="Add Note" to="/add-notes" />
                <NavLink icon={User} label="Profile" to="/profile" />
                <NavLink icon={Home} label="Contact Us" to="/contact" />
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
          <Route path="contact" element={<ContactUs />} />
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
