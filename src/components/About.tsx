import { BookOpen, Users, Sparkles, Mail, Phone, Globe, Lightbulb, Zap, Shield } from "lucide-react";
import "../styles/about.css";


export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {}
      <section className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50" />
        <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-16">
          <div className="text-center">
        
            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">UniNotes</span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
              A modern, collaborative platform where students connect through knowledge sharing
            </p>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* What is UniNotes? */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border-l-4 border-purple-600 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 p-3 rounded-xl">
                <BookOpen className="text-purple-700" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">What is UniNotes?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              UniNotes is a <span className="font-semibold text-purple-700">community-driven platform</span> where university students 
              can <span className="font-semibold">share</span> their lecture notes, <span className="font-semibold">discover</span> useful resources, 
              and <span className="font-semibold">download</span> materials to boost their learning. 
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              Our mission is to enhance <span className="font-semibold text-purple-700">collaboration</span> and 
              <span className="font-semibold text-purple-700"> efficient learning</span> in university life by connecting 
              learners in a clean, fast, and reliable environment.
            </p>
          </div>

          {/* Who We Are? */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-xl p-8 border border-purple-200 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-600 p-3 rounded-xl">
                <Users className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Who We Are?</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              The UniNotes team consists of students and educators from various departments. 
              We develop with principles of <span className="font-semibold text-purple-700">transparency</span>, 
              <span className="font-semibold text-purple-700"> accessibility</span>, and 
              <span className="font-semibold text-purple-700"> academic integrity</span>.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              We believe in collaboration, open access to knowledge, and making education accessible to everyone.
            </p>
          </div>
        </div>

        {/* Why UniNotes? */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-purple-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-4 rounded-xl shadow-lg">
              <Sparkles className="text-white" size={36} />
            </div>
            <h2 className="text-4xl font-bold text-gray-900">Why UniNotes?</h2>
          </div>
          <p className="text-xl text-gray-700 mb-8 ml-16">
            We provide an exceptional learning experience with these key features:
          </p>
          <div className="grid md:grid-cols-2 gap-6 ml-16">
            <div className="flex items-start gap-4 group">
              <Lightbulb className="text-purple-600 mt-1 group-hover:scale-110 transition-transform" size={24} />
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">Modern Interface</h4>
                <p className="text-gray-600">Easy navigation and quick access to notes</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <Zap className="text-purple-600 mt-1 group-hover:scale-110 transition-transform" size={24} />
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">Smart Tagging</h4>
                <p className="text-gray-600">Find exactly what you're looking for</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <Users className="text-purple-600 mt-1 group-hover:scale-110 transition-transform" size={24} />
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">Quality Content</h4>
                <p className="text-gray-600">Peer-reviewed content and community feedback</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <Shield className="text-purple-600 mt-1 group-hover:scale-110 transition-transform" size={24} />
              <div>
                <h4 className="font-bold text-lg text-gray-900 mb-1">Safe & Secure</h4>
                <p className="text-gray-600">Your notes are safe and accessible anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-t-4 border-purple-600">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="flex items-center gap-3 mb-8">
            
            <h3 className="text-2xl font-bold">Contact Us</h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <a href="mailto:info@uninotes.app" className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-all duration-300 hover:scale-105 flex items-center gap-3">
              <Mail className="group-hover:scale-110 transition-transform" size={20} /> 
              <span className="font-medium">info@uninotes.app</span>
            </a>
            <a href="tel:+90-000-000-00-00" className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-all duration-300 hover:scale-105 flex items-center gap-3">
              <Phone className="group-hover:scale-110 transition-transform" size={20} /> 
              <span className="font-medium">+90 000 000 00 00</span>
            </a>
            <a href="https://uninotes.app" target="_blank" className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-all duration-300 hover:scale-105 flex items-center gap-3">
              <Globe className="group-hover:scale-110 transition-transform" size={20} /> 
              <span className="font-medium">uninotes.app</span>
            </a>
          </div>

        </div>
      </footer>
    </div>
  );
}
