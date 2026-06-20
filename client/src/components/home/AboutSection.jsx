import React, { useContext } from 'react';
import { ThemeContext } from "../../context/ThemeContext";
import boyImage from '../../assets/giphy6.webp';
import { FaArrowRight } from 'react-icons/fa';

const stats = [
  { value: "500+", label: "Top Companies", emoji: "🏢" },
  { value: "1M+", label: "Jobs Available", emoji: "💼" },
  { value: "200K+", label: "Successful Hires", emoji: "🎉" },
  { value: "100+", label: "Industries", emoji: "🌍" },
];

export default function AboutSection() {
  const { theme } = useContext(ThemeContext);
  return (
    <section className="py-20 bg-white dark:bg-[#0e1629] transition-all duration-300 relative overflow-hidden">
      <div className="absolute bottom-8 right-[8%] text-4xl animate-float pointer-events-none">🏆</div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-3">
          <span className="text-sm font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">Who We Are</span>
        </div>
        <div className="text-center mb-14 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">About <span className="gradient-text">JobHub</span></h2>
          <p className="mt-3 text-base max-w-xl mx-auto text-slate-500 dark:text-slate-400">Your Gateway to the Best Job Opportunities</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-2/5">
            <div className="relative">
              <div className="absolute -inset-3 bg-cyan-500/15 rounded-3xl blur-xl" />
              <img src={boyImage} alt="Professional Workspace" className="relative w-full h-80 md:h-[430px] object-cover rounded-2xl shadow-2xl border-4 border-cyan-500/20" />
              <div className="absolute -bottom-4 -right-4 text-5xl animate-bounce-gentle">👨‍💻</div>
            </div>
          </div>
          <div className="w-full md:w-3/5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="card-premium p-5 text-center hover-lift">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <h3 className="text-2xl font-extrabold gradient-text">{stat.value}</h3>
                  <p className="text-xs mt-1 font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
            <p className="text-base leading-relaxed mb-6 text-slate-600 dark:text-slate-300">
              <span className="font-semibold gradient-text">JobHub</span> is dedicated to connecting job seekers with top employers. Our platform offers real-time job listings, AI-driven job matching, and career guidance tailored to your expertise and ambitions.
            </p>
            <a href="/about" className="inline-flex items-center gap-2 btn-gradient px-7 py-3 rounded-xl text-sm">Learn More <FaArrowRight className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
