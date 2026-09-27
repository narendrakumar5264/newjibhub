import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import {
  FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaPhoneAlt,
  FaCheckCircle, FaShieldAlt, FaClock, FaUserTie, FaBriefcase, FaClipboardList,
  FaPaperPlane, FaTimes, FaFileAlt, FaCheck, FaExclamationCircle
} from 'react-icons/fa';
import { calculateAiMatch } from '../config/groq';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { theme } = useContext(ThemeContext);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  // Application state
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationData, setApplicationData] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState('');
  const [applySuccess, setApplySuccess] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [matchScore, setMatchScore] = useState(null);
  const [calculatingMatch, setCalculatingMatch] = useState(false);

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

  // Check application status if user is logged in
  useEffect(() => {
    if (!currentUser || !params.listingId) return;
    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/application/check/${params.listingId}`);
        const data = await res.json();
        if (data.applied) {
          setHasApplied(true);
          setApplicationData(data.application);
          if (data.application.matchScore) {
            setMatchScore(data.application.matchScore);
          }
        }
      } catch (err) {
        console.error('Error checking application status:', err);
      }
    };
    checkStatus();
  }, [currentUser, params.listingId]);

  // Check if a saved resume exists from Resume ATS analysis
  useEffect(() => {
    const savedResume = localStorage.getItem('jobhub_parsed_resume');
    if (savedResume && !resumeText) {
      setResumeText(savedResume);
    }
  }, []);

  // Calculate live match score if resumeText and listing exist
  useEffect(() => {
    if (!resumeText || !listing?.skillsRequired || matchScore !== null || calculatingMatch) return;
    const runMatch = async () => {
      try {
        setCalculatingMatch(true);
        const res = await calculateAiMatch(resumeText, listing.skillsRequired, listing.jobTitle);
        if (res.matchScore !== undefined) {
          setMatchScore(res.matchScore);
        }
      } catch (e) {
        console.warn('Match calculation skipped:', e.message);
      } finally {
        setCalculatingMatch(false);
      }
    };
    runMatch();
  }, [resumeText, listing]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    setApplying(true);
    setApplyError('');
    try {
      const res = await fetch('/api/application/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: params.listingId,
          coverNote,
          resumeText,
          matchScore: matchScore || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Failed to submit application');
      }
      setHasApplied(true);
      setApplicationData(data.application);
      setApplySuccess(true);
      if (resumeText) {
        localStorage.setItem('jobhub_parsed_resume', resumeText);
      }
    } catch (err) {
      setApplyError(err.message);
    } finally {
      setApplying(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      'In Review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      Shortlisted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      Interviewing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      Accepted: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800',
      Rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[status] || statusColors.Applied}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {status}
      </span>
    );
  };

  return (
    <main className={`${theme === "dark" ? "dark" : ""} min-h-screen pt-24 pb-20 px-4 bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300`}>
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
              {listing.imageUrls?.length > 0 && (
                <img src={listing.imageUrls[0]} alt="Company" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">{listing.jobTitle}</h1>
                  <p className="text-lg text-white/90 font-medium">{listing.companyName}</p>
                  <div className="flex items-center gap-2 mt-2 text-white/70 text-sm">
                    <FaMapMarkerAlt className="text-emerald-400" />
                    {listing.address}, {listing.city}
                  </div>
                </div>

                {/* Match Score Badge */}
                {matchScore !== null && (
                  <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 px-4 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto">
                    <span className="text-xs uppercase font-bold tracking-wider">AI Role Match</span>
                    <span className="text-xl font-extrabold text-white">{matchScore}%</span>
                  </div>
                )}
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

                  {/* Salary & Application Status Alert */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-100 dark:border-emerald-800/30">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Salary:</span>
                      <span className="text-2xl font-extrabold gradient-text">₹{listing.salary}</span>
                      <span className="text-sm text-slate-500">per month</span>
                    </div>

                    {hasApplied && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">Your Status:</span>
                        {getStatusBadge(applicationData?.status || 'Applied')}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Job Description</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{listing.description}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">
                      <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalfAlt />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">(4.5/5) Verified Recruiter</span>
                  </div>

                  {/* Recruitment Process */}
                  <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/50">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
                      <FaClipboardList className="text-emerald-500" /> Recruitment Process
                    </h3>
                    <div className="space-y-4">
                      {[
                        { step: "1", title: "Online Application", desc: "Submit your application with your resume and optional cover note." },
                        { step: "2", title: "AI Resume & ATS Screening", desc: "Our recruitment engine ranks and matches candidate skill alignments." },
                        { step: "3", title: "AI Mock Interview Practice", desc: "Sharpen answers in JobHub's AI Mock Interview suite while you wait." },
                        { step: "4", title: "Recruiter Review", desc: "Shortlisted candidates are invited directly for technical rounds." },
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

                {/* Desktop Sidebar */}
                <div className="lg:w-80 flex-shrink-0 space-y-6">
                  {/* Recruiter Card */}
                  <div className="card-premium p-6">
                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Hiring Company</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <FaShieldAlt className="text-teal-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{listing.companyName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Recruiter: {listing.recruiterName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Apply Action Card */}
                  <div className="card-premium p-6">
                    {hasApplied ? (
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mx-auto text-xl">
                          <FaCheck />
                        </div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Application Submitted</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Applied on {new Date(applicationData?.createdAt).toLocaleDateString()}
                        </p>
                        <div className="pt-2">
                          {getStatusBadge(applicationData?.status || 'Applied')}
                        </div>
                      </div>
                    ) : currentUser ? (
                      <div className="space-y-3">
                        <button
                          onClick={() => setShowApplyModal(true)}
                          className="btn-gradient w-full py-3.5 rounded-xl text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover-lift"
                        >
                          <FaPaperPlane /> Apply for this Job
                        </button>
                        <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                          Takes less than 1 minute
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                          Sign in to submit your job application
                        </p>
                        <Link to="/sign-in">
                          <button className="btn-gradient w-full py-3 rounded-xl text-sm uppercase tracking-wider">
                            Sign In to Apply
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile Apply Bar */}
      {listing && !loading && !error && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 px-4 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[160px]">{listing.jobTitle}</p>
            <p className="text-sm font-bold gradient-text">₹{listing.salary}/mo</p>
          </div>
          <div>
            {hasApplied ? (
              getStatusBadge(applicationData?.status || 'Applied')
            ) : currentUser ? (
              <button
                onClick={() => setShowApplyModal(true)}
                className="btn-gradient py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider font-semibold"
              >
                Apply Now
              </button>
            ) : (
              <Link to="/sign-in">
                <button className="btn-gradient py-2.5 px-5 rounded-xl text-xs uppercase tracking-wider font-semibold">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="card-premium w-full max-w-lg p-6 sm:p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowApplyModal(false); setApplySuccess(false); setApplyError(''); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <FaTimes className="text-lg" />
            </button>

            {applySuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 flex items-center justify-center mx-auto text-2xl">
                  <FaCheckCircle />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Application Sent!</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Your application for <span className="font-semibold">{listing.jobTitle}</span> at <span className="font-semibold">{listing.companyName}</span> has been received.
                </p>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                  <p>✓ Profile synced: <span className="font-semibold">{currentUser.username}</span> ({currentUser.email})</p>
                  {matchScore !== null && <p>✓ AI Role Match Score: <span className="font-semibold text-emerald-500">{matchScore}%</span></p>}
                </div>
                <div className="pt-2 flex gap-3">
                  <Link to="/Ai_interview" className="flex-1">
                    <button className="btn-gradient w-full py-3 rounded-xl text-xs uppercase tracking-wider font-semibold">
                      Practice Mock Interview
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowApplyModal(false)}
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Apply for {listing.jobTitle}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">{listing.companyName} • {listing.city}</p>

                {applyError && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-xs text-rose-600 dark:text-rose-300">
                    <FaExclamationCircle className="flex-shrink-0" />
                    <span>{applyError}</span>
                  </div>
                )}

                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {/* Candidate Info Confirmation */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{currentUser.username}</p>
                      <p className="text-slate-500 dark:text-slate-400">{currentUser.email}</p>
                    </div>
                    <span className="text-emerald-500 font-semibold text-[11px] bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      Auto-filled
                    </span>
                  </div>

                  {/* Resume / Qualifications Text */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Resume Content / Skills Summary
                      </label>
                      {calculatingMatch && (
                        <span className="text-[11px] text-cyan-500 animate-pulse">Calculating AI Match...</span>
                      )}
                      {matchScore !== null && !calculatingMatch && (
                        <span className="text-[11px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                          {matchScore}% Match
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={4}
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume summary or key skills here for instant AI role matching..."
                      className="input-premium text-xs leading-relaxed"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Tip: If you previously analyzed a resume in ATS Analyzer, it is auto-loaded here.
                    </p>
                  </div>

                  {/* Cover Note */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Note to Recruiter (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      placeholder="Why are you a good fit for this role? Share relevant highlights..."
                      className="input-premium text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={applying}
                    className="btn-gradient w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {applying ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Application...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Submit Application
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
