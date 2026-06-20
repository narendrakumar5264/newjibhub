import React, { useState, useContext, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { ThemeContext } from "../../context/ThemeContext";
import Header from '../common/Header.jsx';

import { useLocation, useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [message, setMessage] = useState('');
  const { theme } = useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();

  const Company = ["microsoft","intel","tcs","intuit","hp","meta","google","adobe","dell","redhat","samsung","oracle"];

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const companyFromUrl = urlParams.get('company');
    if (companyFromUrl) setSearchTerm(companyFromUrl);
  }, [location.search]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.length > 0) {
      const filtered = Company.filter((c) => c.toLowerCase().includes(value.toLowerCase()));
      setSuggestions(filtered);
      setMessage(filtered.length ? '' : `We currently do not operate in "${value}".`);
    } else { setSuggestions([]); setMessage(''); }
  };

  const handleSuggestionClick = (company) => { navigate(`/search?company=${company}`); setSuggestions([]); setSearchTerm(company); };
  const handleSubmit = (e) => { e.preventDefault(); if (searchTerm.trim()) { navigate(`/search?company=${searchTerm.trim()}`); setSuggestions([]); } };

  return (
    <div className={`relative w-full ${theme === "dark" ? "dark" : ""}`}>
      <div className="relative min-h-[580px] flex flex-col justify-center items-center text-white bg-gradient-to-br from-[#0b1120] via-[#0f1d35] to-[#0b1120]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(6,182,212,0.12)_0%,transparent_60%)]" />

        {/* Floating Animated Characters */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-24 left-[8%] text-5xl animate-float-slow" style={{animationDelay:'0s'}}>👨‍💻</div>
          <div className="absolute top-32 right-[10%] text-4xl animate-float" style={{animationDelay:'1s'}}>💼</div>
          <div className="absolute bottom-32 left-[15%] text-4xl animate-bounce-gentle" style={{animationDelay:'0.5s'}}>🎯</div>
          <div className="absolute bottom-24 right-[12%] text-5xl animate-float-slow" style={{animationDelay:'2s'}}>🌟</div>
          <div className="absolute top-1/2 left-[5%] text-3xl animate-wiggle" style={{animationDelay:'1.5s'}}>📊</div>
          <div className="absolute top-1/3 right-[5%] text-3xl animate-bounce-gentle" style={{animationDelay:'0.8s'}}>🤖</div>
          {/* Particles */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-cyan-400/40 rounded-full animate-particle" />
          <div className="absolute top-40 right-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-particle" style={{animationDelay:'1s'}} />
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-emerald-400/30 rounded-full animate-particle" style={{animationDelay:'2s'}} />
        </div>

        <div className="absolute top-0 z-10 w-full"><Header /></div>

        <div className="relative z-10 text-center px-4 mt-20 animate-fade-in-up">
          <div className="inline-block mb-4 px-5 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
            <span className="text-cyan-300 text-sm font-medium tracking-wide">🚀 1M+ Jobs Available</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
            Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400">Your Dream Job</span>
          </h1>
          <p className="sm:text-xl mt-4 font-medium max-w-[600px] mx-auto leading-relaxed text-slate-300">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">Opportunities, Growth, and Success</span> — all in one place.
          </p>

          <div className="relative mt-10 w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit}
              className="flex items-center gap-2 bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-2xl px-5 py-3.5 shadow-2xl border border-white/15 hover:border-cyan-400/30 transition-all duration-300">
              <FaSearch className="text-slate-400 w-4 h-4 flex-shrink-0" />
              <input type="text" placeholder="Search by company, role, or skill..."
                className="flex-grow bg-transparent text-white placeholder-slate-400 focus:outline-none text-sm sm:text-base"
                value={searchTerm} onChange={handleChange} />
              <button type="submit" className="btn-gradient px-6 py-2.5 rounded-xl text-sm flex-shrink-0">Search</button>
            </form>

            {suggestions.length > 0 && (
              <ul className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xl z-50 rounded-xl overflow-hidden">
                {suggestions.map((company, index) => (
                  <li key={index} onClick={() => handleSuggestionClick(company)}
                    className="px-5 py-3 cursor-pointer hover:bg-cyan-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors capitalize text-sm">
                    <FaSearch className="text-cyan-400 w-3 h-3" />{company}
                  </li>
                ))}
              </ul>
            )}
            {suggestions.length === 0 && message && (
              <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50 rounded-xl px-5 py-4 text-sm text-slate-600 dark:text-slate-300">{message}</div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Google", "Microsoft", "TCS", "Meta", "Intel"].map((tag) => (
              <button key={tag} onClick={() => navigate(`/search?company=${tag.toLowerCase()}`)}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 rounded-full text-xs text-slate-300 hover:text-white transition-all duration-200 backdrop-blur-sm">
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
