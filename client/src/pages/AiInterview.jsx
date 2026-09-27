import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { fetchAiQuestion, analyzeAiAnswer } from "../config/groq";
import StepIndicator from "../components/common/StepIndicator";
import InterviewControls from "../components/interview/InterviewControls";
import InterviewVideoFeed from "../components/interview/InterviewVideoFeed";
import TopicSelector from "../components/interview/TopicSelector";
import AnswerAnalyzer from "../components/interview/AnswerAnalyzer";
import InterviewResults from "../components/interview/InterviewResults";
import ScoreRing from "../components/common/ScoreRing";
import {
  FaHistory, FaLightbulb, FaDownload, FaTimes, FaMicrophone,
  FaCheckCircle, FaExclamationTriangle, FaChevronRight
} from "react-icons/fa";

const TOPICS = ["ReactJS", "JavaScript", "Cybersecurity", "MongoDB", "OOPs in C++", "Node.js", "System Design"];
const STEPS = ["Setup", "Interview", "Answer", "Feedback"];

function isValidQuestion(text) {
  if (!text) return false;
  const invalid = ["Error", "Please", "Rate", "Loading", "Groq", "missing"];
  return !invalid.some((p) => text.startsWith(p));
}

export default function Ai_interview() {
  const { currentUser } = useSelector((state) => state.user);

  const [totalScore, setTotalScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [recording, setRecording] = useState(false);
  const [videoMode, setVideoMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [topic, setTopic] = useState("JavaScript");
  const [difficulty, setDifficulty] = useState("Medium");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Phase 3 State
  const [analytics, setAnalytics] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const recordedChunks = useRef([]);
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);

  // Load analytics and session history
  const fetchAnalytics = useCallback(async () => {
    if (!currentUser) return;
    try {
      const [resAnalytics, resHistory] = await Promise.all([
        fetch("/api/interview/analytics"),
        fetch("/api/interview/history"),
      ]);
      const dataAnalytics = await resAnalytics.json();
      const dataHistory = await resHistory.json();
      if (dataAnalytics.success) setAnalytics(dataAnalytics);
      if (dataHistory.success) setHistory(dataHistory.sessions || []);
    } catch (e) {
      console.warn("Failed to load interview history:", e);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const speakQuestion = useCallback((text) => {
    try {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 0.95;
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        const voice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Samantha")));
        speech.voice = voice || voices.find((v) => v.lang.startsWith("en")) || voices[0];
      }
      window.speechSynthesis.speak(speech);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  }, []);

  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [recording]);

  useEffect(() => { setAnswer(transcript); }, [transcript]);

  useEffect(() => {
    if (feedback) setCurrentStep(4);
    else if (answer.trim()) setCurrentStep(3);
    else if (recording || isValidQuestion(response)) setCurrentStep(2);
    else setCurrentStep(1);
  }, [feedback, answer, recording, response]);

  async function fetchInterviewQuestions() {
    if (!topic) { setResponse("Please select a topic first."); return; }
    setLoadingQuestion(true);
    setFeedback(null);
    try {
      const generatedQuestion = await fetchAiQuestion(topic, difficulty);
      const cleaned = generatedQuestion.replace(/^["']|["']$/g, "").trim();
      setQuestion(cleaned);
      setResponse(cleaned);
      speakQuestion(cleaned);
    } catch (error) {
      console.error("Error fetching interview questions:", error);
      setResponse(error.message || "Error fetching interview questions.");
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function analyzeAnswer() {
    const activeQuestion = question || response;
    if (!isValidQuestion(activeQuestion)) {
      setFeedback({ score: 0, feedback: "Generate a question first before analyzing your answer.", strengths: [], improvements: [] });
      return;
    }
    if (!answer.trim()) {
      setFeedback({ score: 0, feedback: "Please enter or speak your answer first.", strengths: [], improvements: [] });
      return;
    }

    setAnalyzing(true);
    try {
      const result = await analyzeAiAnswer(activeQuestion, answer.trim());
      const score = Math.min(10, Math.max(1, Number(result.score) || 0));

      setFeedback({ ...result, score });
      setAttempts((prevAttempts) => {
        const nextAttempts = prevAttempts + 1;
        setTotalScore((prevTotal) => {
          const newTotal = prevTotal + score;
          setPercentage(((newTotal / nextAttempts / 10) * 100).toFixed(1));
          return newTotal;
        });
        return nextAttempts;
      });

      // Persist session to MongoDB
      if (currentUser) {
        try {
          await fetch("/api/interview/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              topic,
              difficulty,
              question: activeQuestion,
              answer: answer.trim(),
              score,
              feedback: result.feedback,
              strengths: result.strengths || [],
              improvements: result.improvements || [],
              durationSeconds: timer,
            }),
          });
          fetchAnalytics();
        } catch (saveErr) {
          console.warn("Could not save interview session:", saveErr);
        }
      }
    } catch (error) {
      console.error("Error analyzing the answer:", error);
      setFeedback({
        score: 0,
        feedback: error.message || "Error analyzing the answer.",
        strengths: [],
        improvements: [],
      });
    } finally {
      setAnalyzing(false);
    }
  }

  function handleNextQuestion() {
    setAnswer("");
    setTranscript("");
    setFeedback(null);
    fetchInterviewQuestions();
  }

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Speech recognition works best in Chrome or Edge."); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript + " ";
        else interim += event.results[i][0].transcript;
      }
      if (final) setTranscript((prev) => prev + final);
      else if (interim) setTranscript((prev) => prev.replace(/\s*$/, "") + " " + interim);
    };
    recognition.onerror = (event) => console.error("Speech recognition error:", event.error);
    recognition.onend = () => {
      if (isRecordingRef.current && recognitionRef.current) {
        try { recognition.start(); } catch { /* noop */ }
      }
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  const startInterview = async (isVideo) => {
    if (!topic) { alert("Please select an interview topic first."); return; }
    setVideoMode(isVideo);
    setTranscript("");
    setAnswer("");
    setFeedback(null);
    setTimer(0);
    isRecordingRef.current = true;
    setRecording(true);
    startSpeechRecognition();
    fetchInterviewQuestions();

    const constraints = isVideo ? { video: true, audio: false } : { audio: true };
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (isVideo && videoRef.current) videoRef.current.srcObject = mediaStream;
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunks.current = [];
      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.current.push(e.data); };
      mediaRecorder.onstop = () => {
        if (!isVideo) return;
        const blob = new Blob(recordedChunks.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.controls = true;
        }
      };
      mediaRecorder.start();
    } catch (err) {
      console.error("Camera/Mic permission error:", err);
    }
  };

  const stopInterview = () => {
    isRecordingRef.current = false;
    setRecording(false);
    stopSpeechRecognition();
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const printSessionReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 pt-20 transition-colors duration-200">
      <div className="min-h-[calc(100vh-5rem)] p-4 sm:p-8 py-10 relative overflow-hidden">
        {/* Glow ambient spots */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[180px] top-1/4 left-1/4 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[180px] bottom-1/4 right-1/4 animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <motion.div className="max-w-5xl mx-auto relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                AI Mock <span className="gradient-text">Interview Coach</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                Real-time speech evaluation, instant AI scoring, and personalized feedback.
              </p>
            </div>

            {/* Past History & Session Report Actions */}
            <div className="flex items-center gap-2.5">
              {currentUser && (
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition shadow-sm"
                >
                  <FaHistory className="text-emerald-500 dark:text-cyan-400" /> Past Sessions ({history.length})
                </button>
              )}
              {feedback && (
                <button
                  onClick={printSessionReport}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-2 transition shadow-sm"
                  title="Print / Export Report"
                >
                  <FaDownload /> Export Report
                </button>
              )}
            </div>
          </div>

          {/* Weak Areas Aggregator Banner */}
          {analytics?.weakestTopic && analytics?.totalSessions >= 2 && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-3 animate-fade-in">
              <FaLightbulb className="text-amber-400 text-base flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">AI Performance Insight</p>
                <p className="mt-0.5 leading-relaxed">{analytics.recommendation}</p>
              </div>
            </div>
          )}

          <StepIndicator steps={STEPS} current={currentStep} />

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left Column: Setup & Question */}
            <div className="lg:col-span-2 space-y-6">
              <TopicSelector
                topics={TOPICS}
                topic={topic}
                setTopic={setTopic}
                difficulty={difficulty}
                setDifficulty={setDifficulty}
                generateNewQuestion={fetchInterviewQuestions}
                response={response}
                loadingQuestion={loadingQuestion}
                isQuestionReady={isValidQuestion(response)}
              />

              <InterviewControls
                recording={recording}
                videoMode={videoMode}
                timer={timer}
                topic={topic}
                startInterview={startInterview}
                stopInterview={stopInterview}
              />

              {/* Live Mic Listening Waveform Indicator */}
              {recording && (
                <div className="card-premium bg-emerald-950/20 border-emerald-500/30 p-4 text-center animate-glow-pulse flex items-center justify-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <FaMicrophone className="text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-300">Listening to your verbal answer...</span>
                </div>
              )}

              {/* Analyzing Shimmer Card */}
              {analyzing && (
                <div className="card-premium bg-slate-900/80 border-cyan-500/40 p-6 text-center animate-shimmer">
                  <div className="w-8 h-8 border-3 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-3" />
                  <p className="text-xs font-bold text-cyan-300">Groq AI is analyzing your response...</p>
                  <p className="text-[11px] text-slate-400 mt-1">Evaluating technical accuracy, strengths, and areas to polish.</p>
                </div>
              )}

              {/* Overall Session Cumulative Progress */}
              {attempts > 0 && (
                <div className="card-premium p-5 text-center">
                  <p className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider mb-3">Session Average</p>
                  <div className="flex justify-center">
                    <ScoreRing score={Number(percentage) / 10} max={10} size={110} label="Current Pace" />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Interaction & Results */}
            <div className="lg:col-span-3 space-y-6">
              {videoMode && (
                <InterviewVideoFeed
                  videoRef={videoRef}
                  recording={recording}
                  stream={stream}
                />
              )}

              <AnswerAnalyzer
                answer={answer}
                setAnswer={setAnswer}
                analyzeAnswer={analyzeAnswer}
                analyzing={analyzing}
                onNextQuestion={handleNextQuestion}
                hasFeedback={!!feedback}
              />

              <InterviewResults
                feedback={feedback}
                totalScore={totalScore}
                attempts={attempts}
                percentage={percentage}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Past Sessions Replay Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="card-premium bg-slate-900 border-slate-700 w-full max-w-3xl p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => { setShowHistoryModal(false); setSelectedHistoryItem(null); }}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              <FaTimes className="text-lg" />
            </button>

            <h3 className="text-xl font-bold text-white mb-1">Your Practice History</h3>
            <p className="text-xs text-slate-400 mb-6">Review past answers and feedback to track your technical growth.</p>

            {history.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <p>No saved interview sessions yet. Complete your first question above to save it!</p>
              </div>
            ) : selectedHistoryItem ? (
              /* Detailed Replay View */
              <div className="space-y-4 text-xs">
                <button
                  onClick={() => setSelectedHistoryItem(null)}
                  className="text-cyan-400 font-semibold mb-2 flex items-center gap-1 hover:underline"
                >
                  ← Back to all sessions
                </button>
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-cyan-400">{selectedHistoryItem.topic} ({selectedHistoryItem.difficulty})</span>
                    <p className="font-semibold text-white text-sm mt-0.5">{selectedHistoryItem.question}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-400">{selectedHistoryItem.score}/10</span>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">Your Answer</p>
                  <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60 text-slate-300 leading-relaxed">
                    {selectedHistoryItem.answer}
                  </div>
                </div>

                <div>
                  <p className="font-bold text-slate-400 uppercase text-[10px] mb-1">AI Evaluation</p>
                  <p className="text-slate-300 leading-relaxed">{selectedHistoryItem.feedback}</p>
                </div>

                {selectedHistoryItem.strengths?.length > 0 && (
                  <div>
                    <p className="font-bold text-emerald-400 uppercase text-[10px] mb-1.5">Strengths</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedHistoryItem.strengths.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedHistoryItem.improvements?.length > 0 && (
                  <div>
                    <p className="font-bold text-amber-400 uppercase text-[10px] mb-1.5">Areas to Polish</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedHistoryItem.improvements.map((s, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* List of Past Sessions */
              <div className="space-y-3">
                {history.map((s) => (
                  <div
                    key={s._id}
                    onClick={() => setSelectedHistoryItem(s)}
                    className="p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 hover:border-slate-600 transition cursor-pointer flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
                          {s.topic}
                        </span>
                        <span className="text-slate-500 text-[11px]">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-white font-medium line-clamp-1">{s.question}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-emerald-400">{s.score}/10</span>
                      <FaChevronRight className="text-slate-500 text-xs" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
