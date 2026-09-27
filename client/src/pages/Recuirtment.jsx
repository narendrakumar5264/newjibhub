import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { ThemeContext } from "../context/ThemeContext";
import {
  FaUserTie, FaEnvelope, FaFileDownload, FaSearch, FaCheckCircle,
  FaTimesCircle, FaClock, FaFilter, FaBriefcase, FaEye, FaTimes, FaRobot
} from "react-icons/fa";

export default function Recruitment() {
  const { theme } = useContext(ThemeContext);
  const { currentUser } = useSelector((state) => state.user);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/application/recruiter");
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to load candidate applications");
      }
      setApplications(data.applications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      const res = await fetch(`/api/application/status/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to update status");
      }
      setApplications((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      if (selectedApp && selectedApp._id === appId) {
        setSelectedApp((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) return;
    const headers = ["Applicant Name", "Email", "Job Title", "Company", "Match Score", "Status", "Applied Date"];
    const rows = applications.map((app) => [
      `"${app.applicantName}"`,
      `"${app.applicantEmail}"`,
      `"${app.jobTitle}"`,
      `"${app.companyName}"`,
      `"${app.matchScore || 0}%"`,
      `"${app.status}"`,
      `"${new Date(app.createdAt).toLocaleDateString()}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jobhub_applicants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApplications = applications.filter((app) => {
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusOptions = ["Applied", "In Review", "Shortlisted", "Interviewing", "Accepted", "Rejected"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Shortlisted":
      case "Accepted":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300";
      case "In Review":
      case "Interviewing":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300";
      case "Rejected":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-300";
    }
  };

  const countByStatus = (status) => applications.filter((a) => a.status === status).length;

  return (
    <div className={`${theme === "dark" ? "dark" : ""} min-h-screen pt-24 pb-16 px-4 bg-slate-50 dark:bg-[#0b1120] transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Recruitment Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Review and manage incoming candidate applications for your posted jobs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              disabled={applications.length === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-colors"
            >
              <FaFileDownload className="text-emerald-500" /> Export CSV
            </button>
            <button
              onClick={fetchApplications}
              className="btn-gradient px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Candidates", count: applications.length, color: "text-blue-500" },
            { label: "In Review", count: countByStatus("In Review"), color: "text-amber-500" },
            { label: "Shortlisted", count: countByStatus("Shortlisted"), color: "text-emerald-500" },
            { label: "Interviewing", count: countByStatus("Interviewing"), color: "text-purple-500" },
          ].map((stat, i) => (
            <div key={i} className="card-premium p-4 sm:p-5">
              <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl font-extrabold mt-1 ${stat.color}`}>{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Filters Bar */}
        <div className="card-premium p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              type="text"
              placeholder="Search candidate name, email, or job title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pl-9 py-2 text-xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["All", ...statusOptions].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === status
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Applicants Table */}
        <div className="card-premium overflow-hidden">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-3 border-slate-200 dark:border-slate-700 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-500">Loading candidate applications...</p>
            </div>
          ) : error ? (
            <div className="py-16 text-center text-rose-500">
              <p className="text-sm font-medium">{error}</p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="py-16 text-center text-slate-500">
              <FaUserTie className="text-4xl mx-auto mb-3 text-slate-300 dark:text-slate-600" />
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No applications found</p>
              <p className="text-xs mt-1">When candidates apply for your posted jobs, they will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-slate-700/60">
                  <tr>
                    <th className="py-3.5 px-4 font-semibold">Candidate</th>
                    <th className="py-3.5 px-4 font-semibold">Target Job</th>
                    <th className="py-3.5 px-4 font-semibold">AI Match</th>
                    <th className="py-3.5 px-4 font-semibold">Status</th>
                    <th className="py-3.5 px-4 font-semibold">Applied Date</th>
                    <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{app.applicantEmail}</div>
                      </td>
                      <td className="py-4 px-4 font-medium text-slate-800 dark:text-slate-200">
                        {app.jobTitle}
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                          <FaRobot className="text-[10px]" />
                          {app.matchScore || 0}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={app.status}
                          disabled={updatingId === app._id}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className={`text-xs font-semibold rounded-lg px-2.5 py-1 border transition-colors cursor-pointer bg-white dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500 ${getStatusColor(app.status)}`}
                        >
                          {statusOptions.map((st) => (
                            <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-[11px]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <a
                            href={`mailto:${app.applicantEmail}?subject=Regarding your application for ${encodeURIComponent(app.jobTitle)} at ${encodeURIComponent(app.companyName)}`}
                            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors"
                            title="Send Email"
                          >
                            <FaEnvelope />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Candidate Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="card-premium w-full max-w-2xl p-6 sm:p-8 relative animate-scale-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedApp.applicantName}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Applied for <span className="font-semibold text-emerald-500">{selectedApp.jobTitle}</span> • {new Date(selectedApp.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="space-y-5 text-xs">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
                <div>
                  <p className="text-slate-400 font-medium uppercase text-[10px]">Email</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{selectedApp.applicantEmail}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-medium uppercase text-[10px]">AI Match Score</p>
                  <p className="font-bold text-emerald-500 text-sm mt-0.5">{selectedApp.matchScore || 0}% Match</p>
                </div>
              </div>

              {/* Cover Note */}
              {selectedApp.coverNote && (
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[10px] tracking-wider">
                    Candidate Note
                  </p>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {selectedApp.coverNote}
                  </div>
                </div>
              )}

              {/* Resume Text */}
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase text-[10px] tracking-wider">
                  Submitted Resume Summary & Experience
                </p>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 max-h-60 overflow-y-auto leading-relaxed whitespace-pre-line text-[11px]">
                  {selectedApp.resumeText || "No raw resume text provided."}
                </div>
              </div>

              {/* Status Update in Modal */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Update Status:</span>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                    className="text-xs font-semibold rounded-lg px-3 py-1.5 border bg-white dark:bg-slate-800 cursor-pointer"
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <a
                  href={`mailto:${selectedApp.applicantEmail}?subject=Interview Invitation for ${encodeURIComponent(selectedApp.jobTitle)}`}
                  className="btn-gradient py-2 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
                >
                  <FaEnvelope /> Contact Candidate
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
