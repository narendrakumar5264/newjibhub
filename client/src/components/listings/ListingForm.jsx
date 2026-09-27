import React, { useState } from "react";
import {
  FaUserTie, FaBuilding, FaCity, FaMapMarkerAlt, FaCloudUploadAlt,
  FaTimes, FaMagic, FaBriefcase, FaClock, FaCheck, FaEye
} from "react-icons/fa";
import { expandAiDescription } from "../../config/groq";

export default function ListingForm({
  page, setPage, formData, handleChange, handleFileChange,
  handleUploadClick, handleRemoveImage, handleSubmit,
  isUploading, uploadStatus, uploadedImages, buttonText = "Submit Listing",
  setFormData,
}) {
  const [expandingAi, setExpandingAi] = useState(false);
  const [aiNotes, setAiNotes] = useState("");

  const rajasthanCities = [
    "Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Kota",
    "Bikaner", "Alwar", "Bharatpur", "Sikar", "Pali", "Tonk",
    "Bengaluru", "Mumbai", "Delhi NCR", "Hyderabad", "Pune", "Remote"
  ];

  const handleAiExpand = async () => {
    if (!formData.jobTitle || !aiNotes) {
      alert("Please provide at least a Job Title and rough bullet points/notes to expand.");
      return;
    }
    setExpandingAi(true);
    try {
      const res = await expandAiDescription(formData.jobTitle, formData.companyName || "Hiring Company", aiNotes);
      if (res.fullDescription) {
        setFormData((prev) => ({ ...prev, description: res.fullDescription }));
      }
    } catch (e) {
      alert(e.message || "Failed to expand description with AI");
    } finally {
      setExpandingAi(false);
    }
  };

  const steps = [
    { num: 1, label: "Company & Location" },
    { num: 2, label: "Role & AI Description" },
    { num: 3, label: "Media & Preview" },
  ];

  return (
    <div className="card-premium p-6 sm:p-10 animate-fade-in-up">
      {/* 3-Step Wizard Indicator */}
      <div className="flex items-center justify-between max-w-md mx-auto mb-8">
        {steps.map((st, i) => (
          <div key={st.num} className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                page >= st.num
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-500"
              }`}
            >
              {page > st.num ? <FaCheck className="text-[10px]" /> : st.num}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-slate-600 dark:text-slate-400">
              {st.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`w-8 sm:w-12 h-0.5 mx-1 ${page > st.num ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── STEP 1: COMPANY & LOCATION ── */}
      {page === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setPage(2); }} className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Company & Recruiter Details</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Introduce the hiring team and workplace location.</p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Recruiter Name</label>
            <div className="relative">
              <FaUserTie className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="e.g. Sarah Jenkins"
                className="input-premium pl-10 text-xs py-2.5"
                id="recruiterName"
                required
                onChange={handleChange}
                value={formData.recruiterName}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company Name</label>
            <div className="relative">
              <FaBuilding className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="e.g. Acme Technologies Inc."
                className="input-premium pl-10 text-xs py-2.5"
                id="companyName"
                required
                onChange={handleChange}
                value={formData.companyName}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">City / Region</label>
            <div className="relative">
              <FaCity className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
              <select
                id="city"
                className="input-premium pl-10 text-xs py-2.5 cursor-pointer"
                required
                onChange={handleChange}
                value={formData.city}
              >
                <option value="" disabled>Select City or Remote</option>
                {rajasthanCities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Workplace Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <textarea
                placeholder="e.g. 402 Cyber Hub, Tower B, Sector 21"
                className="input-premium pl-10 text-xs py-2.5 min-h-[70px]"
                id="address"
                required
                onChange={handleChange}
                value={formData.address}
              />
            </div>
          </div>

          <button type="submit" className="btn-gradient w-full py-3 rounded-xl text-xs uppercase tracking-wider font-semibold mt-4">
            Next: Role & Description →
          </button>
        </form>
      )}

      {/* ── STEP 2: ROLE & AI-ASSISTED DESCRIPTION ── */}
      {page === 2 && (
        <form onSubmit={(e) => { e.preventDefault(); setPage(3); }} className="space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Role & Requirements</h2>
            <button type="button" onClick={() => setPage(1)} className="text-xs text-slate-400 hover:text-white">
              ← Back
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Specify the position, required skills, and salary.</p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Full Stack Engineer"
              className="input-premium text-xs py-2.5"
              id="jobTitle"
              maxLength="100"
              minLength="4"
              required
              onChange={handleChange}
              value={formData.jobTitle}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Job Type</label>
              <select
                id="jobType"
                className="input-premium text-xs py-2.5 cursor-pointer"
                required
                onChange={handleChange}
                value={formData.jobType}
              >
                <option value="" disabled>Select Type</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Salary (₹/month)</label>
              <input
                type="number"
                placeholder="75000"
                className="input-premium text-xs py-2.5"
                id="salary"
                min="1000"
                max="5000000"
                required
                onChange={handleChange}
                value={formData.salary}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Skills Required</label>
              <input
                type="text"
                placeholder="e.g. React, Node.js, MongoDB, AWS"
                className="input-premium text-xs py-2.5"
                id="skillsRequired"
                required
                onChange={handleChange}
                value={formData.skillsRequired}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Experience Required</label>
              <input
                type="text"
                placeholder="e.g. 3+ Years"
                className="input-premium text-xs py-2.5"
                id="experienceRequired"
                required
                onChange={handleChange}
                value={formData.experienceRequired}
              />
            </div>
          </div>

          {/* AI Description Expander Assistant */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <FaMagic className="text-cyan-400" /> AI Description Writer
              </span>
              <button
                type="button"
                onClick={handleAiExpand}
                disabled={expandingAi}
                className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold disabled:opacity-50 transition"
              >
                {expandingAi ? "Expanding..." : "✨ Expand Notes with AI"}
              </button>
            </div>
            <textarea
              placeholder="Paste rough notes/bullet points here (e.g. building payment flow, remote team, health insurance, 3 rounds) and click Expand with AI..."
              value={aiNotes}
              onChange={(e) => setAiNotes(e.target.value)}
              className="input-premium text-xs min-h-[60px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Job Description</label>
            <textarea
              placeholder="Detailed responsibilities, expectations, and benefits..."
              className="input-premium text-xs min-h-[120px] leading-relaxed"
              id="description"
              required
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPage(1)}
              className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 btn-gradient py-3 rounded-xl text-xs uppercase tracking-wider font-semibold"
            >
              Next: Media & Live Preview →
            </button>
          </div>
        </form>
      )}

      {/* ── STEP 3: MEDIA UPLOAD & LIVE PREVIEW ── */}
      {page === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Media & Live Card Preview</h2>
            <button type="button" onClick={() => setPage(2)} className="text-xs text-slate-400 hover:text-white">
              ← Back
            </button>
          </div>

          {/* Upload Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Company Banner Images (max 6, first = cover)
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  <FaCloudUploadAlt className="text-3xl text-slate-400 mb-1" />
                  <span className="text-xs text-slate-400">Click to select image files</span>
                </div>
                <input className="hidden" type="file" id="images" accept="image/*" onChange={handleFileChange} multiple />
              </label>

              <button
                type="button"
                onClick={handleUploadClick}
                disabled={isUploading}
                className="btn-gradient px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold self-center sm:self-auto disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Upload Photos"}
              </button>
            </div>

            {uploadStatus && (
              <p className={`text-xs mt-2 font-medium ${uploadStatus.includes("success") ? "text-emerald-500" : "text-amber-500"}`}>
                {uploadStatus}
              </p>
            )}

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                {uploadedImages.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden h-16 border border-slate-700">
                    <img src={url} alt="listing" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute inset-0 bg-red-600/70 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Preview Card */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <FaEye className="text-cyan-400" /> Live Listing Preview
            </div>
            <div className="card-premium overflow-hidden border border-slate-300 dark:border-slate-700 p-4 max-w-sm">
              <div className="h-32 rounded-lg bg-slate-200 dark:bg-slate-800 overflow-hidden mb-3 relative">
                {uploadedImages.length > 0 ? (
                  <img src={uploadedImages[0]} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                    Company Image Cover
                  </div>
                )}
                <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {formData.jobType || "Full-Time"}
                </span>
              </div>

              <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                {formData.jobTitle || "Job Title"}
              </h4>
              <p className="text-xs text-slate-500 truncate">{formData.companyName || "Company Name"} • {formData.city || "City"}</p>
              <p className="text-xs font-bold gradient-text mt-2">₹{formData.salary || "0"}/month</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setPage(2)}
              className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="flex-1 btn-gradient py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold"
            >
              {buttonText}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
