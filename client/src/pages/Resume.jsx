import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaCloudUploadAlt, FaFilePdf, FaCheckCircle, FaBriefcase, FaHistory,
  FaCheckSquare, FaSquare, FaChartLine, FaArrowUp, FaTimes
} from "react-icons/fa";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { analyzeAiResume, truncateText } from "../config/groq";
import { extractTextFromPdf, isPdfFile } from "../config/pdf";
import ScoreRing from "../components/common/ScoreRing";
import StepIndicator from "../components/common/StepIndicator";
import LoadingSpinner from "../components/common/LoadingSpinner";

const STEPS = ["Upload PDF", "AI Analysis", "Results"];
const SECTION_LABELS = {
  education: "Education",
  experience: "Experience",
  skills: "Skills",
  formatting: "Formatting",
};

export default function Resume() {
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(1);
  const [analysis, setAnalysis] = useState(null);
  const [currentRecordId, setCurrentRecordId] = useState(null);
  const [targetJobTitle, setTargetJobTitle] = useState("Software Engineer");
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const inputRef = useRef(null);

  // Fetch score history for the chart
  const fetchHistory = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/resume/history");
      const data = await res.json();
      if (data.success && data.history) {
        setHistory(data.history);
      }
    } catch (e) {
      console.warn("Could not load resume history:", e);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const reset = () => {
    setFile(null);
    setAnalysis(null);
    setCurrentRecordId(null);
    setStatus("");
    setStep(1);
    if (inputRef.current) inputRef.current.value = "";
  };

  const selectFile = (selected) => {
    if (!selected) return;
    if (!isPdfFile(selected)) {
      setStatus("Only PDF files are allowed.");
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setStatus("PDF must be under 5 MB.");
      return;
    }
    setFile(selected);
    setAnalysis(null);
    setStatus("");
    setStep(1);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    selectFile(e.dataTransfer.files[0]);
  }, []);

  const runFullAnalysis = async () => {
    if (!file) {
      setStatus("Please select a PDF resume first.");
      return;
    }

    setLoading(true);
    setStep(2);
    setStatus("Reading PDF in-browser...");
    setAnalysis(null);

    try {
      const rawText = await extractTextFromPdf(file);
      const resumeText = truncateText(rawText);

      // Cache locally for job application prefill
      localStorage.setItem("jobhub_parsed_resume", resumeText);

      setStatus("Running comprehensive ATS analysis...");
      const result = await analyzeAiResume(resumeText);
      setAnalysis(result);
      setStep(3);
      setStatus("Analysis complete!");

      // Persist to MongoDB
      if (currentUser) {
        try {
          const res = await fetch("/api/resume/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fileName: file.name,
              targetJobTitle,
              atsScore: result.atsScore,
              sectionScores: result.sectionScores,
              summary: result.summary,
              strengths: result.strengths || [],
              improvements: result.improvements || [],
              missingKeywords: result.missingKeywords || [],
              roadmap: result.roadmap || [],
            }),
          });
          const savedData = await res.json();
          if (savedData.success && savedData.record) {
            setCurrentRecordId(savedData.record._id);
            fetchHistory();
          }
        } catch (saveErr) {
          console.warn("Could not save resume to history:", saveErr);
        }
      }
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setStep(1);
      if (error?.code === "EMPTY_PDF") {
        setStatus("Could not read text from this PDF. Please use a text-based PDF, not a scanned image.");
      } else {
        setStatus(error.message || "Failed to analyze resume. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Toggle checklist milestone
  const handleToggleMilestone = async (index) => {
    if (!analysis?.roadmap) return;
    const updatedRoadmap = [...analysis.roadmap];
    updatedRoadmap[index] = {
      ...updatedRoadmap[index],
      completed: !updatedRoadmap[index].completed,
    };
    setAnalysis({ ...analysis, roadmap: updatedRoadmap });

    if (currentRecordId) {
      try {
        await fetch(`/api/resume/roadmap/${currentRecordId}/${index}`, {
          method: "PATCH",
        });
      } catch (err) {
        console.warn("Could not persist milestone toggle:", err);
      }
    }
  };

  // Format history data for Recharts
  const chartData = history.map((item, idx) => ({
    name: `v${idx + 1} (${new Date(item.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })})`,
    score: item.atsScore,
    target: item.targetJobTitle,
  }));

  return (
    <div className="min-h-screen bg-[#0b1120] pt-20">
      <div className="min-h-[calc(100vh-5rem)] p-4 sm:p-8 py-10 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[180px] top-1/4 left-1/4 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[180px] bottom-1/4 right-1/4 animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <motion.div className="max-w-5xl mx-auto relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Top Title Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Resume <span className="gradient-text">ATS Analyzer</span>
              </h1>
              <p className="text-slate-400 mt-1 text-sm">
                Single-pass PDF evaluation — scoring, keyword gaps, and an interactive career roadmap.
              </p>
            </div>

            {history.length > 0 && (
              <button
                onClick={() => setShowHistoryModal(true)}
                className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-2 self-start sm:self-auto transition"
              >
                <FaChartLine className="text-emerald-400" /> Score Progression ({history.length})
              </button>
            )}
          </div>

          <StepIndicator steps={STEPS} current={step} />

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Column: Upload & Options */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-7">
                <h2 className="text-base font-bold text-emerald-400 mb-1">Upload Resume</h2>
                <p className="text-slate-400 text-xs mb-4">Text-based PDF only · Maximum 5 MB</p>

                {/* Target Role input for role-specific scoring */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <FaBriefcase className="text-emerald-400 text-xs" /> Target Role
                  </label>
                  <input
                    type="text"
                    value={targetJobTitle}
                    onChange={(e) => setTargetJobTitle(e.target.value)}
                    placeholder="e.g. Full Stack Developer, Frontend Engineer"
                    className="input-premium py-2 text-xs"
                  />
                </div>

                {/* Drag and Drop Zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`cursor-pointer flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-2xl transition ${
                    dragOver ? "border-emerald-500 bg-emerald-500/10" : "border-slate-600 bg-slate-800/40 hover:bg-slate-800/80"
                  }`}
                >
                  {file ? (
                    <>
                      <FaFilePdf className="text-4xl text-rose-400 mb-2" />
                      <span className="text-xs text-white font-medium text-center px-4 truncate max-w-full">{file.name}</span>
                      <span className="text-[11px] text-slate-400 mt-1">{(file.size / 1024).toFixed(0)} KB</span>
                    </>
                  ) : (
                    <>
                      <FaCloudUploadAlt className="text-4xl text-slate-400 mb-2" />
                      <span className="text-xs text-slate-300 font-medium">Drop PDF here or click to browse</span>
                      <span className="text-[11px] text-slate-500 mt-1">Files are read locally in your browser</span>
                    </>
                  )}
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => selectFile(e.target.files[0])}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-2.5 mt-5">
                  <button
                    onClick={runFullAnalysis}
                    disabled={!file || loading}
                    className="flex-1 btn-gradient py-3 rounded-xl text-xs uppercase tracking-wider font-semibold disabled:opacity-40"
                  >
                    {loading ? "Analyzing..." : "Analyze Resume"}
                  </button>
                  {(file || analysis) && (
                    <button
                      onClick={reset}
                      disabled={loading}
                      className="px-3.5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold transition"
                    >
                      Reset
                    </button>
                  )}
                </div>

                {loading && <LoadingSpinner text={status} />}
                {!loading && status && (
                  <p className={`mt-3 text-xs flex items-center gap-1.5 ${analysis ? "text-emerald-400" : "text-slate-400"}`}>
                    {analysis && <FaCheckCircle />}
                    {status}
                  </p>
                )}
              </div>

              {/* Score Progression Mini-Chart in Sidebar */}
              {history.length >= 2 && (
                <div className="card-premium bg-slate-900/80 border-slate-700/50 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Score Progression</p>
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <FaArrowUp className="text-[10px]" />
                      +{history[history.length - 1].atsScore - history[0].atsScore}%
                    </span>
                  </div>
                  <div className="h-32 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" hide />
                        <YAxis domain={[0, 100]} hide />
                        <Tooltip
                          contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                          itemStyle={{ color: "#10b981" }}
                        />
                        <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#scoreGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Detailed Analysis Results */}
            <div className="lg:col-span-3">
              {!analysis && !loading && (
                <div className="card-premium bg-slate-900/80 border-slate-700/50 p-8 h-full flex flex-col items-center justify-center text-center min-h-[360px]">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                    <FaFilePdf className="text-3xl text-slate-500" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Ready to Evaluate Your Resume</h3>
                  <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                    Upload your PDF above to generate an ATS compatibility score, identify missing domain keywords, and produce a customized career progression roadmap.
                  </p>
                </div>
              )}

              {loading && (
                <div className="card-premium bg-slate-900/80 border-slate-700/50 p-8 h-full flex items-center justify-center min-h-[360px]">
                  <LoadingSpinner text="AI is auditing your resume structure & keywords..." />
                </div>
              )}

              {analysis && !loading && (
                <motion.div className="space-y-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  {/* Score + Summary */}
                  <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-7">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      <ScoreRing score={analysis.atsScore ?? 0} max={100} size={120} label="ATS Match" />
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 justify-center sm:justify-start mb-1.5">
                          <h3 className="text-base font-bold text-white">Executive Summary</h3>
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                            {targetJobTitle}
                          </span>
                        </div>
                        <p className="text-slate-300 text-xs leading-relaxed">{analysis.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* 4-Vector Section Scores */}
                  {analysis.sectionScores && (
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-5">
                      <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">Section Breakdowns</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(analysis.sectionScores).map(([key, val]) => (
                          <div key={key} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-center">
                            <p className="text-2xl font-extrabold text-emerald-400">{val}<span className="text-xs text-slate-500">/10</span></p>
                            <p className="text-[11px] text-slate-400 mt-1 capitalize">{SECTION_LABELS[key] || key}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Improvements */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-5">
                      <h3 className="text-xs font-bold text-emerald-400 mb-3 uppercase tracking-wider">Key Strengths</h3>
                      <ul className="space-y-2">
                        {(analysis.strengths || []).map((s, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-emerald-500 font-bold shrink-0">✓</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-5">
                      <h3 className="text-xs font-bold text-amber-400 mb-3 uppercase tracking-wider">Actionable Fixes</h3>
                      <ul className="space-y-2">
                        {(analysis.improvements || []).map((s, i) => (
                          <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-amber-500 font-bold shrink-0">→</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Missing Keywords */}
                  {analysis.missingKeywords?.length > 0 && (
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-5">
                      <h3 className="text-xs font-bold text-rose-400 mb-3 uppercase tracking-wider">
                        Missing Keywords for {targetJobTitle}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1 rounded-full text-xs bg-rose-500/10 text-rose-300 border border-rose-500/20">
                            + {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Career Roadmap Checklist */}
                  {analysis.roadmap?.length > 0 && (
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                          Career Roadmap Checklist
                        </h3>
                        <span className="text-[11px] text-slate-400">Click milestones to check off</span>
                      </div>

                      <div className="space-y-3">
                        {analysis.roadmap.map((item, i) => (
                          <div
                            key={i}
                            onClick={() => handleToggleMilestone(i)}
                            className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start gap-3.5 ${
                              item.completed
                                ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                                : "bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 text-slate-300"
                            }`}
                          >
                            <div className="mt-0.5 text-base flex-shrink-0">
                              {item.completed ? (
                                <FaCheckSquare className="text-emerald-400" />
                              ) : (
                                <FaSquare className="text-slate-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-xs font-bold ${item.completed ? "line-through text-slate-400" : "text-white"}`}>
                                {item.title}
                              </h4>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* History Progression Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="card-premium bg-slate-900 border-slate-700 w-full max-w-2xl p-6 sm:p-8 relative">
            <button onClick={() => setShowHistoryModal(false)} className="absolute top-5 right-5 text-slate-400 hover:text-white">
              <FaTimes className="text-lg" />
            </button>
            <h3 className="text-xl font-bold text-white mb-1">ATS Score Progression History</h3>
            <p className="text-xs text-slate-400 mb-6">Track how your resume score has evolved across versions.</p>

            <div className="h-64 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px", fontSize: "11px" }}
                    itemStyle={{ color: "#10b981" }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {history.map((rec) => (
                <div key={rec._id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{rec.fileName}</span>
                    <span className="text-[11px] text-slate-400 ml-2">({rec.targetJobTitle})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-400">{rec.atsScore}%</span>
                    <span className="text-slate-500 text-[10px]">{new Date(rec.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
