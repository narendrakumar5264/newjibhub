import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from "../../context/ThemeContext";
import { FaCheckCircle, FaArrowRight, FaRocket, FaBolt, FaChartLine } from 'react-icons/fa';

const benefits = [
  "Priority access to top job opportunities",
  "Personalized AI-powered job alerts",
  "Exclusive Job Market Trends & insights",
];
const highlights = [
  { icon: <FaRocket className="text-cyan-300 w-5 h-5" />, text: "2× faster job placement" },
  { icon: <FaBolt className="text-amber-300 w-5 h-5" />, text: "Early access before public listing" },
  { icon: <FaChartLine className="text-emerald-300 w-5 h-5" />, text: "Career growth analytics" },
];

export default function PremiumAccess() {
  const { theme } = useContext(ThemeContext);
  return (
    <section className="py-16 bg-slate-50 dark:bg-[#0e1629] transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-6 right-[5%] text-3xl animate-wiggle pointer-events-none">💎</div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="card-premium overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-3/5 p-8 md:p-10">
            <div className="inline-block mb-4 px-3 py-1 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-100 dark:border-cyan-800/30 rounded-full">
              <span className="text-cyan-600 dark:text-cyan-400 text-xs font-semibold uppercase tracking-wider">Premium Plan</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3 text-slate-900 dark:text-white">
              JobHub <span className="gradient-text">Premium</span> Access
            </h2>
            <p className="mb-6 text-base text-slate-500 dark:text-slate-400">Gain exclusive access to top job opportunities before they are publicly listed.</p>
            <ul className="space-y-3 mb-8">
              {benefits.map((text, i) => (
                <li key={i} className="flex items-center gap-3">
                  <FaCheckCircle className="text-emerald-500 w-4 h-4 flex-shrink-0" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{text}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider font-medium mb-1 text-slate-500 dark:text-slate-400">Starting from</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white">$19.99<span className="text-sm font-normal ml-1 text-slate-500 dark:text-slate-400">/month</span></p>
              </div>
              <Link to="/Subscription" className="sm:ml-auto">
                <button className="inline-flex items-center gap-2 btn-gradient px-7 py-3 rounded-xl text-sm">Join Premium <FaArrowRight className="w-4 h-4" /></button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">✓ Cancel anytime &nbsp;·&nbsp; ✓ No commitment required</p>
          </div>
          <div className="md:w-2/5 bg-gradient-to-br from-cyan-600 via-blue-600 to-blue-700 p-8 md:p-10 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute bottom-5 right-5 text-4xl animate-float-slow">✨</div>
            <h3 className="text-xl font-bold text-white mb-6">Why Choose Premium?</h3>
            <div className="space-y-5">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-2 bg-white/10 rounded-lg flex-shrink-0">{item.icon}</div>
                  <p className="text-white/90 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-white/70 text-sm">Join <span className="text-white font-semibold">10,000+</span> professionals already using JobHub Premium.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
