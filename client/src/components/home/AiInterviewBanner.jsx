import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from "react-icons/fi";
import { FaBrain } from "react-icons/fa";
import yourGif from '../../assets/gif.gif';

export default function AiInterviewBanner() {
  return (
    <section className="py-20 bg-white dark:bg-[#0b1120] transition-colors duration-300 relative overflow-hidden">
      {/* Floating Characters */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-[8%] text-4xl animate-float" style={{animationDelay:'0.5s'}}>🧠</div>
        <div className="absolute bottom-10 left-[6%] text-3xl animate-bounce-gentle" style={{animationDelay:'1s'}}>💡</div>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800/30 px-4 py-1.5 rounded-full">
              <FaBrain className="text-cyan-600 dark:text-cyan-400 w-3.5 h-3.5" />
              <span className="text-cyan-600 dark:text-cyan-400 text-sm font-semibold uppercase tracking-wider">AI-Powered</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Ace Your Interview with{' '}
              <span className="gradient-text">AI Practice</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
              JobHub's AI interviewer gives you real-time feedback on your answers, helping you build confidence and land your dream role faster.
            </p>
            <ul className="space-y-3 text-sm text-left max-w-sm mx-auto lg:mx-0">
              {["Role-specific interview questions","Instant performance feedback","Track your improvement over time"].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                  <span className="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4 justify-center lg:justify-start pt-2">
              <Link to="/Ai_interview" className="inline-flex items-center gap-2 btn-gradient px-7 py-3 rounded-xl text-sm">
                Start Practice Interview <FiArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-sm text-slate-400 dark:text-slate-500">Free to try · No sign-up needed</span>
            </div>
          </div>
          <div className="flex-1 w-full max-w-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute -inset-4 bg-cyan-400/10 dark:bg-cyan-500/10 rounded-3xl blur-2xl" />
              <img src={yourGif} alt="AI Interview visualization" className="relative w-full rounded-2xl shadow-2xl border border-slate-200/20 dark:border-slate-700/30" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
