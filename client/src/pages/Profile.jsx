import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
} from "../redux/user/userSlice";
import {
  FaUser, FaEnvelope, FaLock, FaTrash, FaSignOutAlt, FaCheckCircle,
  FaCamera, FaChartLine, FaBriefcase, FaRobot, FaFileAlt,
  FaCog, FaExclamationTriangle, FaTimes, FaExternalLinkAlt,
  FaCheck, FaArrowRight, FaClock, FaBuilding
} from "react-icons/fa";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import ScoreRing from "../components/common/ScoreRing";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const { currentUser, error } = useSelector((state) => state.user);

  // Active Tab
  const [activeTab, setActiveTab] = useState("readiness");

  // Account Settings Form State
  const [formData, setFormData] = useState({});
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Data State for Tabs
  const [applications, setApplications] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [interviewAnalytics, setInterviewAnalytics] = useState(null);
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [resumeHistory, setResumeHistory] = useState([]);
  const [latestResume, setLatestResume] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch all tab data in parallel
  const loadProfileData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoadingData(true);
      const [resApps, resListings, resInterviewAnalytics, resInterviewHist, resResumeHist, resResumeLatest] =
        await Promise.all([
          fetch("/api/application/my-applications").then((r) => r.json()).catch(() => ({})),
          fetch(`/api/user/listings/${currentUser._id}`).then((r) => r.json()).catch(() => []),
          fetch("/api/interview/analytics").then((r) => r.json()).catch(() => ({})),
          fetch("/api/interview/history").then((r) => r.json()).catch(() => ({})),
          fetch("/api/resume/history").then((r) => r.json()).catch(() => ({})),
          fetch("/api/resume/latest").then((r) => r.json()).catch(() => ({})),
        ]);

      if (resApps.success) setApplications(resApps.applications || []);
      if (Array.isArray(resListings)) setMyListings(resListings);
      if (resInterviewAnalytics.success) setInterviewAnalytics(resInterviewAnalytics);
      if (resInterviewHist.success) setInterviewHistory(resInterviewHist.sessions || []);
      if (resResumeHist.success) setResumeHistory(resResumeHist.history || []);
      if (resResumeLatest.success) setLatestResume(resResumeLatest.latest || null);
    } catch (err) {
      console.warn("Could not load profile analytics:", err);
    } finally {
      setLoadingData(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadProfileData();
  }, [loadProfileData]);

  // Cloudinary Avatar Upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "Realstate");
    data.append("cloud_name", "dvph1rffn");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.cloudinary.com/v1_1/dvph1rffn/image/upload", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const uploadImage = JSON.parse(xhr.responseText);
        setUploadedImage(uploadImage.url);
        setUploadStatus("Avatar uploaded successfully!");
        setFormData((prev) => ({ ...prev, avatar: uploadImage.url }));
      } else {
        setUploadStatus("Upload failed. Try again.");
      }
    };

    xhr.onerror = () => setUploadStatus("Network error during upload.");
    xhr.send(data);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUpdateSuccess(false);

    const dataToSend = {
      ...formData,
      avatar: uploadedImage || currentUser.avatar,
    };

    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        setLoading(false);
        return;
      }
      dispatch(updateUserSuccess(data));
      setLoading(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setMyListings((prev) => prev.filter((item) => item._id !== listingId));
      } else {
        alert(data.message || "Failed to delete listing");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (deleteConfirmText !== "DELETE") {
      alert('Please type "DELETE" to confirm.');
      return;
    }
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/sign-in");
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/sign-in");
    } catch (err) {
      dispatch(deleteUserFailure(err.message));
    }
  };

  // ── Calculate Composite Career Readiness Score ──
  const atsScore = latestResume?.atsScore || 0;
  const interviewAvg = interviewAnalytics?.averageScore ? interviewAnalytics.averageScore * 10 : 0;
  const profileFactor = (currentUser.username && currentUser.email && currentUser.avatar) ? 100 : 70;
  const applicationActivity = Math.min(100, applications.length * 20);

  // Weighted formula: 45% ATS Resume + 35% Interview Coach + 10% Profile + 10% Application Activity
  const readinessScore = Math.round(
    atsScore * 0.45 +
    interviewAvg * 0.35 +
    profileFactor * 0.10 +
    applicationActivity * 0.10
  );

  const getReadinessTier = (score) => {
    if (score >= 80) return { label: "Top-Tier Interview Magnet", color: "text-emerald-400", badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
    if (score >= 60) return { label: "Job-Ready Candidate", color: "text-teal-400", badge: "bg-teal-500/20 text-teal-300 border-teal-500/40" };
    if (score >= 40) return { label: "Emerging Professional", color: "text-amber-400", badge: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    return { label: "Needs Preparation", color: "text-rose-400", badge: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
  };

  const readinessData = [
    { category: "Resume ATS", score: atsScore, full: 100 },
    { category: "Interview Skills", score: Math.round(interviewAvg), full: 100 },
    { category: "Profile Quality", score: profileFactor, full: 100 },
    { category: "Applications", score: applicationActivity, full: 100 },
  ];

  const tier = getReadinessTier(readinessScore);

  const tabs = [
    { id: "readiness", label: "Career Readiness", icon: <FaChartLine /> },
    { id: "applications", label: `My Applications (${applications.length})`, icon: <FaBriefcase /> },
    { id: "listings", label: `My Job Postings (${myListings.length})`, icon: <FaBuilding /> },
    { id: "interviews", label: `Interview Practice (${interviewHistory.length})`, icon: <FaRobot /> },
    { id: "resumes", label: `Resume History (${resumeHistory.length})`, icon: <FaFileAlt /> },
    { id: "settings", label: "Account Settings", icon: <FaCog /> },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-200">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up">
        {/* Profile Hero Header Card */}
        <div className="card-premium overflow-hidden relative">
          <div className="h-32 sm:h-36 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 animate-gradient-shift" />

          <div className="px-6 sm:px-8 pb-6 flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 sm:-mt-16 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              {/* Avatar with Camera upload button */}
              <div className="relative group">
                <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleFileUpload} />
                <img
                  src={uploadedImage || currentUser.avatar}
                  alt="avatar"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-xl cursor-pointer"
                  onClick={() => fileRef.current?.click()}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-lg transition duration-200"
                >
                  <FaCamera />
                </button>
              </div>

              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center sm:justify-start gap-2">
                  {currentUser.username}
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${tier.badge}`}>
                    {tier.label}
                  </span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{currentUser.email}</p>
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-500">
                  <span>Joined {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{applications.length} Applications</span>
                  <span>•</span>
                  <span>{interviewHistory.length} Mock Sessions</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className="px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1.5 transition"
              >
                <FaSignOutAlt /> Sign Out
              </button>
            </div>
          </div>

          {uploadStatus && (
            <div className="px-8 pb-3 text-xs font-medium text-emerald-500 text-center sm:text-left">
              {uploadStatus}
            </div>
          )}
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="card-premium p-1.5 flex gap-1.5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TAB 1: CAREER READINESS DASHBOARD ── */}
        {activeTab === "readiness" && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Score Banner */}
            <div className="card-premium p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white border-slate-700/60">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  <ScoreRing score={readinessScore} max={100} size={130} label="Readiness Score" />
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">Overall Market Readiness</span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{tier.label}</h2>
                    <p className="text-xs text-slate-300 max-w-md leading-relaxed">
                      Calculated from your verified resume ATS match, speech-evaluated technical mock interviews, and platform recruitment engagement.
                    </p>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto">
                  <Link to="/Ai_interview">
                    <button className="btn-gradient w-full py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2">
                      <FaRobot /> Practice Interview (+Score)
                    </button>
                  </Link>
                  <Link to="/Resume">
                    <button className="w-full py-2.5 px-4 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800 text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 hover:bg-slate-700 transition">
                      <FaFileAlt /> Audit New Resume (+Score)
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Breakdown Chart & Next Recommended Steps */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pillar Breakdown Chart */}
              <div className="card-premium p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                  Score Vector Breakdown
                </h3>
                <div className="h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={readinessData} layout="vertical" margin={{ left: 10, right: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" />
                      <XAxis type="number" domain={[0, 100]} fontSize={10} stroke="#94a3b8" />
                      <YAxis dataKey="category" type="category" width={110} fontSize={11} stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "11px", color: "#fff" }}
                      />
                      <Bar dataKey="score" fill="#10b981" radius={[0, 6, 6, 0]} barSize={18} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recommended Next Actions Checklist */}
              <div className="card-premium p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                    High-Impact Next Actions
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-500 font-bold">1</div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {atsScore > 0 ? `Target ${latestResume?.targetJobTitle || 'your role'} keyword gaps` : "Upload a PDF Resume to generate your baseline ATS Score"}
                        </p>
                        <p className="text-slate-500 mt-0.5 text-[11px]">
                          {atsScore > 0 ? "Resolve missing ATS keywords in your resume." : "Increases your readiness metric by up to 45%."}
                        </p>
                      </div>
                      <Link to="/Resume" className="text-xs text-cyan-500 hover:underline flex items-center gap-1 font-semibold">
                        Go <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                      <div className="mt-0.5 text-teal-500 font-bold">2</div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                          {interviewAnalytics?.weakestTopic ? `Sharpen ${interviewAnalytics.weakestTopic.topic} scenarios` : "Complete an AI Mock Interview session"}
                        </p>
                        <p className="text-slate-500 mt-0.5 text-[11px]">
                          {interviewAnalytics?.weakestTopic ? `Average is currently ${interviewAnalytics.weakestTopic.average}/10.` : "Evaluates speech clarity and conceptual depth."}
                        </p>
                      </div>
                      <Link to="/Ai_interview" className="text-xs text-cyan-500 hover:underline flex items-center gap-1 font-semibold">
                        Practice <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                      <div className="mt-0.5 text-blue-500 font-bold">3</div>
                      <div className="flex-1 text-xs">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">Apply to matching job openings</p>
                        <p className="text-slate-500 mt-0.5 text-[11px]">Direct AI role-matching puts your profile in front of top recruiters.</p>
                      </div>
                      <Link to="/search" className="text-xs text-cyan-500 hover:underline flex items-center gap-1 font-semibold">
                        Browse <FaArrowRight className="text-[10px]" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: MY APPLICATIONS ── */}
        {activeTab === "applications" && (
          <div className="card-premium p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Applied Positions</h3>
              <span className="text-xs text-slate-500">{applications.length} submitted</span>
            </div>

            {applications.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <FaBriefcase className="text-4xl mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="font-semibold">No applications submitted yet</p>
                <p className="text-xs mt-1">Explore job openings on our search board and click Apply.</p>
                <Link to="/search">
                  <button className="btn-gradient mt-4 py-2 px-5 rounded-xl text-xs uppercase tracking-wider font-semibold">
                    Browse Jobs
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{app.jobTitle}</h4>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-500/20">
                          {app.matchScore || 0}% AI Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{app.companyName}</p>
                      <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <FaClock className="text-[10px]" /> Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {app.status}
                      </span>
                      {app.listingId && (
                        <Link to={`/listing/${app.listingId._id || app.listingId}`}>
                          <button className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-500 text-xs">
                            <FaExternalLinkAlt />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: MY JOB POSTINGS ── */}
        {activeTab === "listings" && (
          <div className="card-premium p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">My Posted Vacancies</h3>
                <p className="text-xs text-slate-500">Manage vacancies you have published as a recruiter.</p>
              </div>
              <Link to="/create-listing">
                <button className="btn-gradient py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold">
                  + Create Job
                </button>
              </Link>
            </div>

            {myListings.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <FaBuilding className="text-4xl mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="font-semibold">No listings created yet</p>
                <p className="text-xs mt-1">Post your open roles to recruit top technical candidates.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {myListings.map((listing) => (
                  <div
                    key={listing._id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {listing.imageUrls?.[0] && (
                        <img src={listing.imageUrls[0]} alt="job" className="w-12 h-12 rounded-lg object-cover" />
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">{listing.jobTitle}</h4>
                        <p className="text-xs text-slate-500">{listing.companyName} • ₹{listing.salary}/mo</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/listing/${listing._id}`}>
                        <button className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800">
                          View
                        </button>
                      </Link>
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDeleteListing(listing._id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/10 text-rose-500 hover:bg-rose-600/20 text-xs font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: INTERVIEW HISTORY ── */}
        {activeTab === "interviews" && (
          <div className="card-premium p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">AI Mock Interview Sessions</h3>
                <p className="text-xs text-slate-500">History of your spoken practice sessions and AI scorecards.</p>
              </div>
              <Link to="/Ai_interview">
                <button className="btn-gradient py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold">
                  Start New Session
                </button>
              </Link>
            </div>

            {interviewHistory.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <FaRobot className="text-4xl mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="font-semibold">No interview sessions recorded</p>
                <p className="text-xs mt-1">Head over to the AI Interview suite to practice verbal questions.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {interviewHistory.map((s) => (
                  <div
                    key={s._id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase text-[10px] bg-cyan-100 dark:bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-300 dark:border-cyan-800">
                          {s.topic}
                        </span>
                        <span className="text-slate-400 text-[11px]">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="text-sm font-extrabold text-emerald-500">{s.score}/10</span>
                    </div>

                    <p className="font-semibold text-slate-800 dark:text-slate-200">{s.question}</p>
                    <p className="text-slate-500 dark:text-slate-400 italic">" {s.answer.slice(0, 160)}... "</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: RESUME HISTORY & ROADMAP ── */}
        {activeTab === "resumes" && (
          <div className="card-premium p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Resume Evaluation Logs</h3>
                <p className="text-xs text-slate-500">Track how your ATS rating improved across PDF versions.</p>
              </div>
              <Link to="/Resume">
                <button className="btn-gradient py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold">
                  Analyze New Resume
                </button>
              </Link>
            </div>

            {resumeHistory.length === 0 ? (
              <div className="py-16 text-center text-slate-500">
                <FaFileAlt className="text-4xl mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                <p className="font-semibold">No resumes evaluated yet</p>
                <p className="text-xs mt-1">Upload your PDF in the ATS Resume Analyzer to begin tracking.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resumeHistory.map((r) => (
                  <div
                    key={r._id}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{r.fileName}</span>
                        <span className="text-slate-400 text-[11px]">({r.targetJobTitle})</span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-extrabold text-emerald-500">{r.atsScore}% ATS</span>
                      {r.roadmap?.length > 0 && (
                        <span className="text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                          {r.roadmap.filter((m) => m.completed).length}/{r.roadmap.length} Milestones Done
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 6: ACCOUNT SETTINGS ── */}
        {activeTab === "settings" && (
          <div className="space-y-6 animate-fade-in">
            {/* Update Info Form */}
            <div className="card-premium p-6 sm:p-8">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">Update Account Credentials</h3>

              {updateSuccess && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                  <FaCheckCircle /> Account updated successfully!
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <FaExclamationTriangle /> {error}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Username</label>
                  <div className="relative">
                    <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="text"
                      id="username"
                      defaultValue={currentUser.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="input-premium pl-10 text-xs py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="email"
                      id="email"
                      defaultValue={currentUser.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-premium pl-10 text-xs py-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <div className="relative">
                    <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      type="password"
                      id="password"
                      placeholder="Enter new password (leave blank to keep current)"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-premium pl-10 text-xs py-2.5"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full py-3 rounded-xl text-xs uppercase tracking-wider font-semibold disabled:opacity-50 mt-2"
                >
                  {loading ? "Updating Account..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="card-premium p-6 border-rose-200 dark:border-rose-900/40">
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-2">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Deleting your account will permanently remove your applications, interview sessions, and ATS resume history.
              </p>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600/10 text-rose-600 dark:text-rose-400 hover:bg-rose-600/20 text-xs font-semibold flex items-center gap-2 transition"
              >
                <FaTrash /> Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="card-premium bg-slate-900 border-rose-900/50 w-full max-w-md p-6 relative animate-scale-in text-white">
            <button
              onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <FaTimes />
            </button>

            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 text-xl">
              <FaExclamationTriangle />
            </div>

            <h3 className="text-lg font-bold text-center text-white">Permanently Delete Account?</h3>
            <p className="text-xs text-slate-300 text-center mt-2 leading-relaxed">
              This action cannot be undone. All of the following will be wiped permanently:
            </p>

            <ul className="my-4 space-y-1.5 text-xs text-rose-300 bg-rose-950/30 p-3 rounded-xl border border-rose-800/40">
              <li>• Your user profile and account credentials</li>
              <li>• {myListings.length} posted job vacancies</li>
              <li>• {applications.length} submitted job applications</li>
              <li>• {interviewHistory.length} recorded AI mock interview sessions</li>
              <li>• All saved ATS resume evaluation roadmaps</li>
            </ul>

            <div className="space-y-3">
              <label className="block text-[11px] text-slate-400">
                Type <strong className="text-white">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="input-premium py-2 text-xs"
              />

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={deleteConfirmText !== "DELETE"}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-30 transition"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
