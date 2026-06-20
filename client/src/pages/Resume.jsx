import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FaCloudUploadAlt, FaFilePdf, FaCheckCircle } from "react-icons/fa";
import { generateGroqJSON, truncateText, getGroqErrorMessage } from "../config/groq";
import { resumeFullAnalysisPrompt } from "../config/aiPrompts";
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
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(1);
  const [analysis, setAnalysis] = useState(null);
  const inputRef = useRef(null);

  const reset = () => {
    setFile(null);
    setAnalysis(null);
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
    setStatus("Reading PDF...");
    setAnalysis(null);

    try {
      const resumeText = truncateText(await extractTextFromPdf(file));
      setStatus("Running ATS analysis (one smart pass)...");
      const result = await generateGroqJSON(resumeFullAnalysisPrompt(resumeText));
      setAnalysis(result);
      setStep(3);
      setStatus("Analysis complete!");
    } catch (error) {
      console.error("Error:", error);
      setStep(1);
      if (error?.code === "EMPTY_PDF") {
        setStatus("Could not read text from this PDF. Use a text-based PDF, not a scanned image.");
      } else {
        setStatus(getGroqErrorMessage(error, "Failed to analyze resume. Please try again."));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] pt-20">
      <div className="min-h-[calc(100vh-5rem)] p-4 sm:p-8 py-10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[180px] top-1/4 left-1/4 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[180px] bottom-1/4 right-1/4 animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <motion.div
          className="max-w-5xl mx-auto relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Resume <span className="gradient-text">ATS Analyzer</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">
              One-click PDF analysis — score, section ratings, keywords & career roadmap.
            </p>
          </div>

          <StepIndicator steps={STEPS} current={step} />

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Upload panel */}
            <div className="lg:col-span-2 card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-emerald-400 mb-1">Upload Resume</h2>
              <p className="text-slate-400 text-sm mb-5">PDF only · text-based · max 5 MB</p>

              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-2xl transition ${
                  dragOver ? "border-emerald-500 bg-emerald-500/5" : "border-slate-600 bg-slate-800/50 hover:bg-slate-800"
                }`}
              >
                {file ? (
                  <>
                    <FaFilePdf className="text-4xl text-red-400 mb-3" />
                    <span className="text-sm text-white font-medium text-center px-4">{file.name}</span>
                    <span className="text-xs text-slate-500 mt-1">{(file.size / 1024).toFixed(0)} KB</span>
                  </>
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-4xl text-slate-500 mb-3" />
                    <span className="text-sm text-slate-400">Drop PDF here or click to browse</span>
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

              <div className="flex gap-3 mt-5">
                <button
                  onClick={runFullAnalysis}
                  disabled={!file || loading}
                  className="flex-1 btn-gradient py-3.5 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {loading ? "Analyzing..." : "Analyze Resume"}
                </button>
                {(file || analysis) && (
                  <button
                    onClick={reset}
                    disabled={loading}
                    className="px-4 py-3.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium transition"
                  >
                    Reset
                  </button>
                )}
              </div>

              {loading && <LoadingSpinner text={status} />}
              {!loading && status && (
                <p className={`mt-4 text-sm flex items-center gap-2 ${analysis ? "text-emerald-400" : "text-slate-400"}`}>
                  {analysis && <FaCheckCircle />}
                  {status}
                </p>
              )}
            </div>

            {/* Results panel */}
            <div className="lg:col-span-3">
              {!analysis && !loading && (
                <div className="card-premium bg-slate-900/80 border-slate-700/50 p-8 h-full flex flex-col items-center justify-center text-center min-h-[320px]">
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
                    <FaFilePdf className="text-2xl text-slate-500" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Ready to analyze</h3>
                  <p className="text-slate-400 text-sm max-w-sm">
                    Upload your PDF and click Analyze. Get ATS score, section breakdown, missing keywords, and a career roadmap in one pass.
                  </p>
                </div>
              )}

              {loading && (
                <div className="card-premium bg-slate-900/80 border-slate-700/50 p-8 h-full flex items-center justify-center min-h-[320px]">
                  <LoadingSpinner text="AI is reviewing your resume..." />
                </div>
              )}

              {analysis && !loading && (
                <motion.div
                  className="space-y-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {/* Score + summary */}
                  <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                      <ScoreRing score={analysis.atsScore ?? 0} max={100} size={130} />
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-lg font-bold text-white mb-2">Professional Summary</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">{analysis.summary}</p>
                      </div>
                    </div>
                  </div>

                  {/* Section scores */}
                  {analysis.sectionScores && (
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6">
                      <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">Section Scores</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(analysis.sectionScores).map(([key, val]) => (
                          <div key={key} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-center">
                            <p className="text-2xl font-bold text-emerald-400">{val}<span className="text-sm text-slate-500">/10</span></p>
                            <p className="text-xs text-slate-400 mt-1">{SECTION_LABELS[key] || key}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Strengths & improvements */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6">
                      <h3 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wide">Strengths</h3>
                      <ul className="space-y-2">
                        {(analysis.strengths || []).map((s, i) => (
                          <li key={i} className="text-sm text-slate-300 flex gap-2">
                            <span className="text-emerald-500 shrink-0">+</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6">
                      <h3 className="text-sm font-bold text-amber-400 mb-3 uppercase tracking-wide">Improvements</h3>
                      <ul className="space-y-2">
                        {(analysis.improvements || []).map((s, i) => (
                          <li key={i} className="text-sm text-slate-300 flex gap-2">
                            <span className="text-amber-500 shrink-0">→</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Missing keywords */}
                  {analysis.missingKeywords?.length > 0 && (
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6">
                      <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wide">Missing ATS Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.missingKeywords.map((kw, i) => (
                          <span key={i} className="px-3 py-1.5 rounded-full text-xs bg-red-500/10 text-red-300 border border-red-500/20">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Roadmap */}
                  {analysis.roadmap?.length > 0 && (
                    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-8">
                      <h3 className="text-lg font-bold text-emerald-400 mb-4">Career Roadmap</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {analysis.roadmap.map((item, i) => (
                          <div key={i} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                            <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                            <p className="text-sm text-slate-400 leading-relaxed">{item.content}</p>
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
    </div>
  );
}
