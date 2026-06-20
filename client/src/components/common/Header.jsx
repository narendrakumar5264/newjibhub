import { useState, useEffect, useContext, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ThemeContext } from "../../context/ThemeContext";
import {
  deleteUserFailure, deleteUserSuccess, signOutUserStart,
} from "../../redux/user/userSlice";
import {
  FaBars, FaListAlt, FaSignOutAlt, FaMoon, FaSun, FaTimes,
  FaFileAlt, FaUser, FaPlus, FaBriefcase, FaRobot, FaCrown,
  FaHome, FaInfoCircle, FaSearch,
} from "react-icons/fa";

export default function Header() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [themeAnimating, setThemeAnimating] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const menuRef = useRef(null);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) { dispatch(deleteUserFailure(data.message)); return; }
      dispatch(deleteUserSuccess(data));
      setMenuOpen(false);
    } catch (error) { dispatch(deleteUserFailure(error.message)); }
  };

  // Scroll detection for shrink/shadow effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [menuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Animated theme toggle
  const handleThemeToggle = () => {
    setThemeAnimating(true);
    toggleTheme();
    setTimeout(() => setThemeAnimating(false), 500);
  };

  const navLinks = [
    { to: "/", label: "Home", icon: <FaHome /> },
    { to: "/about", label: "About", icon: <FaInfoCircle /> },
    { to: "/listing", label: "My Listings", icon: <FaListAlt /> },
    { to: "/search", label: "Jobs", icon: <FaSearch /> },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 dark:bg-[#0b1120]/95 backdrop-blur-2xl shadow-lg shadow-slate-900/5 dark:shadow-black/20 py-2"
            : "bg-white/70 dark:bg-[#0b1120]/80 backdrop-blur-xl py-3.5"
        } border-b border-slate-200/50 dark:border-slate-700/30`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-1.5">
            <div className="relative">
              <span className="text-2xl font-black tracking-tight text-slate-800 dark:text-white transition-colors">
                Job
              </span>
              <span className="text-2xl font-black tracking-tight gradient-text">
                Hub
              </span>
            </div>
            <span className="animate-wave text-lg ml-0.5 group-hover:animate-bounce-gentle transition-transform">🚀</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                  isActive(link.to)
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  <span className={`text-xs transition-all duration-300 ${
                    isActive(link.to) ? "opacity-100" : "opacity-0 group-hover:opacity-60"
                  }`}>
                    {link.icon}
                  </span>
                  {link.label}
                </span>
                {/* Active indicator dot */}
                {isActive(link.to) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500 animate-scale-in" />
                )}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={handleThemeToggle}
              className={`ml-2 p-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 ${
                theme === "light"
                  ? "bg-slate-100 hover:bg-slate-200 text-slate-500"
                  : "bg-slate-800 hover:bg-slate-700 text-amber-400"
              } ${themeAnimating ? "rotate-[360deg]" : ""}`}
              style={{ transition: themeAnimating ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)" : "all 0.3s" }}
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <FaMoon className="text-sm" /> : <FaSun className="text-sm" />}
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Post a Job CTA */}
            <Link to="/create-listing" className="hidden sm:block">
              <button className="group relative btn-gradient px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 overflow-hidden">
                <FaPlus className="text-xs transition-transform duration-300 group-hover:rotate-90" />
                <span>Post a Job</span>
                {/* Shine effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </button>
            </Link>

            {/* User Menu */}
            {currentUser ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="relative group"
                  aria-label="User menu"
                >
                  <img
                    className={`rounded-full h-9 w-9 object-cover cursor-pointer transition-all duration-300 ${
                      menuOpen
                        ? "ring-[3px] ring-emerald-500 scale-105"
                        : "ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-emerald-500/50 group-hover:scale-105"
                    }`}
                    src={currentUser.avatar}
                    alt="profile"
                  />
                  {/* Online status dot */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0b1120] rounded-full" />
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-900/15 dark:shadow-black/40 border border-slate-100 dark:border-slate-700/50 z-50 overflow-hidden animate-scale-in origin-top-right">
                    {/* User info header */}
                    <div className="relative px-5 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10" />
                      <div className="relative flex items-center gap-3">
                        <img
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white/30"
                          src={currentUser.avatar}
                          alt=""
                        />
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{currentUser.username}</p>
                          <p className="text-xs text-emerald-100 truncate">{currentUser.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2 stagger-children">
                      {[
                        { to: "/profile", icon: <FaUser />, label: "Profile", color: "text-emerald-500" },
                        { to: "/Resume", icon: <FaFileAlt />, label: "Resume Analysis", color: "text-teal-500" },
                        { to: "/Ai_interview", icon: <FaRobot />, label: "AI Interview", color: "text-emerald-500" },
                        { to: "/listing", icon: <FaListAlt />, label: "My Listings", color: "text-amber-500" },
                        { to: "/Subscription", icon: <FaCrown />, label: "Subscription", color: "text-yellow-500" },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200 group/item"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className={`text-sm ${item.color} transition-transform duration-200 group-hover/item:scale-110`}>
                            {item.icon}
                          </span>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover/item:text-slate-900 dark:group-hover/item:text-white transition-colors">
                            {item.label}
                          </span>
                        </Link>
                      ))}

                      <div className="mx-4 my-1.5 h-px bg-slate-100 dark:bg-slate-700" />

                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-5 py-2.5 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-3 text-rose-600 dark:text-rose-400 transition-all duration-200 group/signout"
                      >
                        <FaSignOutAlt className="text-sm transition-transform duration-200 group-hover/signout:-translate-x-0.5" />
                        <span className="text-sm font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/sign-in">
                <button className="px-5 py-2 rounded-xl text-sm font-semibold border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0">
                  Log In
                </button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 active:scale-95"
              aria-label="Toggle mobile menu"
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <FaBars
                  size={18}
                  className={`absolute transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                  }`}
                />
                <FaTimes
                  size={18}
                  className={`absolute transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full transition-all duration-400 ease-in-out overflow-hidden ${
            mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 dark:bg-[#0b1120]/95 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-700/30 shadow-xl">
            <div className="flex flex-col py-4 px-5 gap-1 stagger-children">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive(link.to)
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98]"
                  }`}
                >
                  <span className={`text-sm ${isActive(link.to) ? "text-emerald-500" : "text-slate-400"}`}>
                    {link.icon}
                  </span>
                  {link.label}
                  {isActive(link.to) && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 animate-glow-pulse" />
                  )}
                </Link>
              ))}

              {/* Post a Job — mobile */}
              <Link
                to="/create-listing"
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-emerald-500 to-teal-600 transition-all duration-200 active:scale-[0.98] mt-1"
              >
                <FaPlus className="text-sm" />
                Post a Job
              </Link>

              <div className="h-px bg-slate-200 dark:bg-slate-700 my-2" />

              {/* Theme Toggle — mobile */}
              <button
                onClick={handleThemeToggle}
                className="flex items-center gap-3 px-4 py-3.5 text-slate-700 dark:text-slate-300 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 active:scale-[0.98]"
              >
                <div className={`p-2 rounded-lg transition-all duration-300 ${
                  theme === "light" ? "bg-slate-100 text-slate-500" : "bg-slate-800 text-amber-400"
                }`}>
                  {theme === "light" ? <FaMoon className="text-sm" /> : <FaSun className="text-sm" />}
                </div>
                {theme === "light" ? "Dark Mode" : "Light Mode"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40 md:hidden animate-fade-in"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
