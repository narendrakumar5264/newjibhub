import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaGithub,
  FaHeart, FaPaperPlane, FaArrowRight, FaBriefcase, FaRobot,
  FaFileAlt, FaCrown, FaChevronRight, FaMapMarkerAlt, FaEnvelope,
} from 'react-icons/fa';
import { ThemeContext } from "../../context/ThemeContext";

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const socialLinks = [
    { icon: <FaFacebookF />, label: "Facebook", color: "hover:bg-blue-600 hover:shadow-blue-600/30" },
    { icon: <FaTwitter />, label: "Twitter", color: "hover:bg-sky-500 hover:shadow-sky-500/30" },
    { icon: <FaLinkedinIn />, label: "LinkedIn", color: "hover:bg-blue-700 hover:shadow-blue-700/30" },
    { icon: <FaInstagram />, label: "Instagram", color: "hover:bg-gradient-to-br hover:from-cyan-600 hover:to-pink-500 hover:shadow-pink-500/30" },
    { icon: <FaGithub />, label: "GitHub", color: "hover:bg-slate-800 dark:hover:bg-slate-600 hover:shadow-slate-800/30" },
  ];

  const quickLinks = [
    { to: "/search", icon: <FaBriefcase />, label: "Find Jobs" },
    { to: "/about", icon: <FaChevronRight />, label: "About Us" },
    { to: "/create-listing", icon: <FaChevronRight />, label: "Post a Job" },
    { to: "/", icon: <FaChevronRight />, label: "Home" },
  ];

  const featureLinks = [
    { to: "/Ai_interview", icon: <FaRobot />, label: "AI Interview Prep", badge: "AI" },
    { to: "/Resume", icon: <FaFileAlt />, label: "Resume Analysis", badge: "New" },
    { to: "/Subscription", icon: <FaCrown />, label: "Premium Plans", badge: "Pro" },
    { to: "/Recuirtment", icon: <FaBriefcase />, label: "Recruitment", badge: null },
  ];

  const topCompanies = ["Google", "Microsoft", "Amazon", "Tesla", "Apple", "Meta"];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#0b1120] dark:via-[#0f172a] dark:to-[#0b1120] transition-colors duration-500">
      {/* Top decorative gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/5 dark:bg-cyan-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/5 dark:bg-blue-500/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-1.5 group">
              <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Job<span className="gradient-text">Hub</span>
              </h3>
              <span className="text-lg animate-wave group-hover:animate-bounce-gentle">🚀</span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4 max-w-xs">
              Your gateway to premium career opportunities. Discover, apply, and land your dream job with AI-powered tools.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mt-6">
              {[
                { value: "1M+", label: "Jobs" },
                { value: "50K+", label: "Companies" },
                { value: "10M+", label: "Users" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex gap-2.5 mt-6">
              {socialLinks.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  aria-label={item.label}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 text-sm border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 hover:text-white hover:border-transparent hover:shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-300 ${item.color}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-cyan-500" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 py-1 transition-all duration-200"
                  >
                    <span className="text-[10px] text-slate-300 dark:text-slate-600 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all duration-200">
                      {link.icon}
                    </span>
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Top Companies as pills */}
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.15em] mt-8 mb-3 flex items-center gap-2">
              <span className="w-5 h-px bg-cyan-500" />
              Trending
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {topCompanies.map((company, i) => (
                <button
                  key={i}
                  onClick={() => navigate(`/search?company=${company.toLowerCase()}`)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/40 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-800/40 transition-all duration-200"
                >
                  {company}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-cyan-500" />
              Features
            </h4>
            <ul className="space-y-1.5">
              {featureLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="group flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 py-1.5 px-2.5 -ml-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200"
                  >
                    <span className="text-xs text-cyan-500/60 group-hover:text-cyan-500 transition-colors">
                      {link.icon}
                    </span>
                    <span className="flex-1">{link.label}</span>
                    {link.badge && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        link.badge === "AI"
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                          : link.badge === "New"
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                          : "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-5 h-px bg-cyan-500" />
              Stay Updated
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Get the latest job alerts and career insights delivered to your inbox.
            </p>

            {subscribed ? (
              <div className="flex items-center gap-2.5 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl animate-scale-in">
                <span className="text-lg">🎉</span>
                <div>
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">You're subscribed!</p>
                  <p className="text-xs text-emerald-600/70 dark:text-emerald-500/70">Check your inbox soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className={`relative rounded-xl border transition-all duration-300 ${
                  emailFocused
                    ? "border-cyan-400 dark:border-cyan-500 shadow-lg shadow-cyan-500/10"
                    : "border-slate-200 dark:border-slate-700"
                }`}>
                  <div className="flex items-center">
                    <FaEnvelope className={`ml-4 text-sm transition-colors duration-300 ${
                      emailFocused ? "text-cyan-500" : "text-slate-300 dark:text-slate-600"
                    }`} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailFocused(true)}
                      onBlur={() => setEmailFocused(false)}
                      placeholder="your@email.com"
                      required
                      className="flex-grow px-3 py-3.5 text-sm bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-2 btn-gradient py-3 rounded-xl text-sm"
                >
                  <FaPaperPlane className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  Subscribe
                </button>
              </form>
            )}

            {/* Contact info */}
            <div className="mt-6 space-y-2">
              <a href="mailto:jangidnarendra858@gmail.com" className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                <FaEnvelope className="text-[10px]" />
                jangidnarendra858@gmail.com
              </a>
              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                <FaMapMarkerAlt className="text-[10px]" />
                Rajasthan, India
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              © {new Date().getFullYear()} <span className="gradient-text font-semibold">JobHub</span>. All rights reserved.
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              Made with <FaHeart className="text-rose-500 text-[10px] animate-bounce-gentle" /> by
              <span className="font-semibold text-slate-500 dark:text-slate-400">TeamEagle</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
