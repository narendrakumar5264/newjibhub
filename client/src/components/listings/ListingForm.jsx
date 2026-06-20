import React from "react";
import { FaUserTie, FaBuilding, FaCity, FaMapMarkerAlt, FaCloudUploadAlt, FaTimes } from "react-icons/fa";

export default function ListingForm({
  page, setPage, formData, handleChange, handleFileChange,
  handleUploadClick, handleRemoveImage, handleSubmit,
  isUploading, uploadStatus, uploadedImages, buttonText = "Submit",
}) {
  const rajasthanCities = [
    "Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Kota",
    "Bikaner", "Alwar", "Bharatpur", "Sikar", "Pali", "Tonk"
  ];

  return (
    <div className="card-premium p-8 sm:p-10 animate-fade-in-up">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              page >= step
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
            }`}>
              {step}
            </div>
            {step < 2 && (
              <div className={`w-16 h-1 rounded-full transition-all duration-500 ${page >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>

      {page === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); setPage(2); }} className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Recruiter Details</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3 mb-4">Tell us about the company posting this job.</p>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Recruiter Name</label>
            <div className="relative">
              <FaUserTie className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="John Doe" className="input-premium pl-11" id="recruiterName" required onChange={handleChange} value={formData.recruiterName} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
            <div className="relative">
              <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="TechCorp Inc." className="input-premium pl-11" id="companyName" required onChange={handleChange} value={formData.companyName} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">City</label>
            <div className="relative">
              <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select id="city" className="input-premium pl-11" required onChange={handleChange} value={formData.city}>
                <option value="" disabled>Select City</option>
                {rajasthanCities.map((city) => (<option key={city} value={city}>{city}</option>))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-400" />
              <textarea placeholder="Full address..." className="input-premium pl-11 min-h-[80px]" id="address" required onChange={handleChange} value={formData.address} />
            </div>
          </div>

          <button type="submit" className="btn-gradient w-full py-3.5 rounded-xl text-sm uppercase tracking-wider mt-2">
            Next Step →
          </button>
        </form>
      )}

      {page === 2 && (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Job Details</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 -mt-3 mb-4">Describe the position and its requirements.</p>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Job Title</label>
            <input type="text" placeholder="Senior Frontend Developer" className="input-premium" id="jobTitle" maxLength="100" minLength="5" required onChange={handleChange} value={formData.jobTitle} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Job Description</label>
            <textarea placeholder="Describe the role, responsibilities..." className="input-premium min-h-[100px]" id="description" required onChange={handleChange} value={formData.description} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Skills Required</label>
              <textarea placeholder="React, Node.js..." className="input-premium min-h-[80px]" id="skillsRequired" required onChange={handleChange} value={formData.skillsRequired} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Experience Required</label>
              <textarea placeholder="2+ years..." className="input-premium min-h-[80px]" id="experienceRequired" required onChange={handleChange} value={formData.experienceRequired} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Salary (₹/month)</label>
              <input type="number" placeholder="50000" className="input-premium" id="salary" min="5000" max="1000000" required onChange={handleChange} value={formData.salary} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Job Type</label>
              <select id="jobType" className="input-premium" required onChange={handleChange} value={formData.jobType}>
                <option value="" disabled>Select Type</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Company Images <span className="text-slate-400 font-normal">(max 6, first = cover)</span>
            </label>
            <div className="flex gap-3">
              <label className="flex-1 cursor-pointer">
                <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                  <FaCloudUploadAlt className="text-2xl text-slate-400 mb-2" />
                  <span className="text-sm text-slate-500">Click to select files</span>
                </div>
                <input className="hidden" type="file" id="images" accept="image/*" onChange={handleFileChange} multiple />
              </label>
              <button
                type="button"
                onClick={handleUploadClick}
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium text-sm transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed self-center"
                disabled={isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {uploadStatus && (
              <p className={`text-sm mt-2 font-medium ${uploadStatus.includes("successfully") ? "text-emerald-500" : "text-rose-500"}`}>
                {uploadStatus}
              </p>
            )}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative group">
                    <img src={url} alt={`Uploaded ${index}`} className="w-20 h-20 object-cover rounded-xl shadow-md ring-1 ring-slate-200 dark:ring-slate-700" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setPage(1)}
              className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors uppercase tracking-wider"
            >
              ← Back
            </button>
            <button type="submit" className="flex-1 btn-gradient py-3.5 rounded-xl text-sm uppercase tracking-wider">
              {buttonText}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
