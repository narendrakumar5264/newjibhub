import React from "react";
import { FaInstagram, FaLinkedin, FaGithub, FaTwitter, FaPhone, FaEnvelope, FaReact, FaNodeJs, FaDatabase, FaCode } from "react-icons/fa";
import { SiTailwindcss, SiExpress, SiMongodb } from "react-icons/si";

export default function About() {
  return (
    <div className="min-h-screen pt-20 pb-16 bg-slate-50 dark:bg-[#0b1120]">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white py-24 px-6 animate-gradient-shift">
        <div className="absolute top-10 left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative z-10 max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-block mb-4 px-4 py-1.5 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
            <span className="text-cyan-300 text-sm font-medium">🚀 About Us</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            About <span className="text-yellow-300">JobHub</span>
          </h1>
          <p className="text-xl font-medium mt-4 text-emerald-100 max-w-2xl mx-auto">
            Empowering Careers, One Job at a Time
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        {/* About Card */}
        <div className="card-premium p-8 sm:p-10 mb-10 animate-fade-in-up">
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              <span className="font-semibold gradient-text">JobHub</span> is a fully functional, full-stack job-finding platform designed to connect talented individuals with the best job opportunities. Our mission is to make job searching seamless, efficient, and rewarding.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              Whether you're looking for full-time jobs, internships, or freelance gigs, <span className="font-semibold gradient-text">JobHub</span> simplifies the process and connects you with the right opportunities through AI-powered tools and a modern, intuitive interface.
            </p>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Built with Modern Tech</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <FaReact className="text-cyan-500" />, name: "React" },
              { icon: <SiTailwindcss className="text-sky-500" />, name: "Tailwind" },
              { icon: <FaNodeJs className="text-green-500" />, name: "Node.js" },
              { icon: <SiExpress className="text-slate-500 dark:text-slate-400" />, name: "Express" },
              { icon: <SiMongodb className="text-emerald-500" />, name: "MongoDB" },
              { icon: <FaCode className="text-teal-500" />, name: "REST API" },
            ].map((tech, i) => (
              <div key={i} className="card-premium p-4 flex flex-col items-center gap-2 hover-lift cursor-default">
                <div className="text-2xl">{tech.icon}</div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="card-premium p-8 sm:p-10 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-8">Get in Touch</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
            <a
              href="tel:9875709813"
              className="flex items-center gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover-lift transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                <FaPhone className="text-emerald-600 dark:text-emerald-400 text-lg" />
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium text-sm">+91 9875709813</span>
            </a>
            <a
              href="mailto:jangidnarendra858@gmail.com"
              className="flex items-center gap-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 hover-lift transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-emerald-600 dark:text-emerald-400 text-lg" />
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium text-sm truncate">jangidnarendra858@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Social Links */}
        <div className="text-center mb-10 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Connect with Us</h2>
          <div className="flex justify-center gap-4">
            {[
              { icon: <FaInstagram />, href: "https://www.instagram.com/narendrajangid2022/", color: "hover:bg-pink-500 hover:border-pink-500" },
              { icon: <FaLinkedin />, href: "https://www.linkedin.com/in/narendra-kumar-9b2223257/", color: "hover:bg-blue-600 hover:border-blue-600" },
              { icon: <FaGithub />, href: "https://github.com/narendrakumar5264", color: "hover:bg-slate-800 hover:border-slate-800 dark:hover:bg-slate-600" },
              { icon: <FaTwitter />, href: "https://x.com/JangifNarendra", color: "hover:bg-sky-500 hover:border-sky-500" },
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-white transition-all duration-300 hover-lift ${social.color}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
