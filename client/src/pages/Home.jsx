import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ThemeContext } from "../context/ThemeContext";

import HeroSection from '../components/home/HeroSection.jsx';
import AiInterviewBanner from '../components/home/AiInterviewBanner.jsx';
import CompanyLogos from '../components/home/CompanyLogos.jsx';
import PremiumAccess from '../components/home/PremiumAccess.jsx';
import RecentJobs from '../components/home/RecentJobs.jsx';
import AboutSection from '../components/home/AboutSection.jsx';
import Footer from '../components/common/Footer.jsx';
import ListingItem from '../components/ListingItem.jsx';

import {
  FaRocket, FaRobot, FaFileAlt, FaArrowRight, FaBriefcase,
  FaCheckCircle, FaStar, FaBolt
} from 'react-icons/fa';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [latestResume, setLatestResume] = useState(null);
  const [interviewAnalytics, setInterviewAnalytics] = useState(null);

  const { theme } = useContext(ThemeContext);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/get?limit=9');
        const data = await res.json();
        if (Array.isArray(data)) {
          setOfferListings(data);
          setRentListings(data);
          setSaleListings(data);
          setRecommendedJobs(data.slice(0, 3));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, []);

  // Fetch candidate history if logged in for personalization
  useEffect(() => {
    if (!currentUser) return;
    const fetchPersonalization = async () => {
      try {
        const [resResume, resInterview] = await Promise.all([
          fetch('/api/resume/latest').then((r) => r.json()).catch(() => ({})),
          fetch('/api/interview/analytics').then((r) => r.json()).catch(() => ({})),
        ]);
        if (resResume.success && resResume.latest) setLatestResume(resResume.latest);
        if (resInterview.success) setInterviewAnalytics(resInterview);
      } catch (e) {
        console.warn('Personalization data error:', e);
      }
    };
    fetchPersonalization();
  }, [currentUser]);

  return (
    <div className={`${theme === "dark" ? "dark" : ""} bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-200 transition-colors duration-300`}>
      <HeroSection />

      {/* ── Personalized "Continue Where You Left Off" for Logged-in Candidates ── */}
      {currentUser && (
        <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10 relative z-20">
          <div className="card-premium p-6 sm:p-7 bg-slate-900/90 text-white border-slate-700/80 backdrop-blur-xl shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5 border-b border-slate-700/60 pb-4">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <FaBolt /> Welcome Back, {currentUser.username}
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  Continue Where You Left Off
                </h2>
              </div>
              <Link to="/profile" className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                View Full Profile & Readiness Score <FaArrowRight className="text-[10px]" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: Resume Status */}
              <Link
                to="/Resume"
                className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg">
                    <FaFileAlt />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">ATS Resume Audit</p>
                    <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                      {latestResume ? `${latestResume.atsScore}% Compatibility` : "Run First Audit"}
                    </p>
                  </div>
                </div>
                <FaArrowRight className="text-xs text-slate-500 group-hover:text-white transition" />
              </Link>

              {/* Card 2: Interview Coaching */}
              <Link
                to="/Ai_interview"
                className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-lg">
                    <FaRobot />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">AI Mock Interview</p>
                    <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition">
                      {interviewAnalytics?.averageScore ? `${interviewAnalytics.averageScore}/10 Pace` : "Practice Voice Round"}
                    </p>
                  </div>
                </div>
                <FaArrowRight className="text-xs text-slate-500 group-hover:text-white transition" />
              </Link>

              {/* Card 3: Job Recommendations */}
              <Link
                to="/search"
                className="p-4 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-lg">
                    <FaBriefcase />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Recommended Roles</p>
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition">
                      Explore Openings
                    </p>
                  </div>
                </div>
                <FaArrowRight className="text-xs text-slate-500 group-hover:text-white transition" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Curated Recommendations for candidate */}
      {currentUser && recommendedJobs.length > 0 && (
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                Personalized For You
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Recommended Positions
              </h2>
            </div>
            <Link to="/search" className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Browse All <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedJobs.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      <AiInterviewBanner />
      <CompanyLogos />
      <PremiumAccess />
      <RecentJobs rentListings={rentListings} saleListings={saleListings} />
      <AboutSection />
      <Footer />
    </div>
  );
}