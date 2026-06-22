import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { ThemeContext } from '../context/ThemeContext';
import {
  FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaPhoneAlt,
  FaCheckCircle, FaShieldAlt, FaClock, FaUserTie, FaBriefcase, FaClipboardList,
} from 'react-icons/fa';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { theme } = useContext(ThemeContext);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) { setError(true); setLoading(false); return; }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) { setError(true); setLoading(false); }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className={`${theme === "dark" ? "dark" : ""} min-h-screen pt-24 pb-12 px-4 bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300`}>
      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-3 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}
      {error && (
        <div className="text-center py-20 animate-fade-in-up">
          <div className="text-5xl mb-4">😔</div>
          <p className="text-xl font-medium text-rose-500">Something went wrong!</p>
        </div>
      )}
      {listing && !loading && !error && (
        <div className="max-w-5xl mx-auto animate-fade-in-up">
          <div className="card-premium overflow-hidden">
            {/* Header with Image */}
            <div className="relative h-56 sm:h-72 overflow-hidden">
              {listing.imageUrls.length > 0 && (
                <img src={listing.imageUrls[0]} alt="Company" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">{listing.jobTitle}</h1>
                <p className="text-lg text-white/80 font-medium">{listing.companyName}</p>
                <div className="flex items-center gap-2 mt-2 text-white/70 text-sm">
                  <FaMapMarkerAlt className="text-emerald-400" />
                  {listing.address}, {listing.city}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-8">
                  {/* Key Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { icon: <FaBriefcase className="text-emerald-500" />, label: "Type", value: listing.jobType },
                      { icon: <FaUserTie className="text-teal-500" />, label: "Experience", value: listing.experienceRequired },
                      { icon: <FaClock className="text-amber-500" />, label: "Skills", value: listing.skillsRequired },
                      { icon: <FaMapMarkerAlt className="text-emerald-500" />, label: "Location", value: listing.city },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                        <div className="text-lg mb-1">{item.icon}</div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Salary */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Salary:</span>
                    <span className="text-2xl font-extrabold gradient-text">₹{listing.salary}</span>
                    <span className="text-sm text-slate-500">per month</span>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Job Description</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{listing.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">(4.5/5)</span>
                  </div>

                  {/* Recruitment Process */}
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                      <FaClipboardList className="text-emerald-500" /> Recruitment Process
                    </h3>
                    <div className="space-y-4">
                      {[
                        { step: "1", title: "Online Application", desc: "Submit your resume and cover letter through our careers portal." },
                        { step: "2", title: "Initial Screening", desc: "Shortlisted candidates will be contacted for a brief virtual interview." },
                        { step: "3", title: "Technical Assessment", desc: "Complete an online coding challenge or problem-solving test." },
                        { step: "4", title: "Technical Interview", desc: "A detailed one-on-one or panel interview focusing on past projects." },
                        { step: "5", title: "HR Interview", desc: "Discussion on behavioral aspects, soft skills, and cultural fit." },
                        { step: "6", title: "Final Offer", desc: "Selected candidates receive an official offer letter." },
                        { step: "7", title: "Onboarding", desc: "Once accepted, candidates go through an onboarding process." },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{item.step}</span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{item.title}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:w-72 flex-shrink-0 space-y-6">
                  {/* Recruiter Info */}
                  <div className="card-premium p-6">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Recruiter Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{listing.recruiterName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-teal-500 flex-shrink-0" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">{listing.companyName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <Link to="/Recuirtment">
                    <button className="btn-gradient w-full py-4 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2">
                      <FaPhoneAlt /> Apply Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
