
import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { generateGroqText, generateGroqJSON, GROQ_MODELS, getGroqErrorMessage } from "../config/groq";
import { interviewQuestionPrompt, interviewAnalyzePrompt } from "../config/aiPrompts";
import StepIndicator from "../components/common/StepIndicator";
import InterviewControls from "../components/interview/InterviewControls";
import InterviewVideoFeed from "../components/interview/InterviewVideoFeed";
import TopicSelector from "../components/interview/TopicSelector";
import AnswerAnalyzer from "../components/interview/AnswerAnalyzer";
import InterviewResults from "../components/interview/InterviewResults";

const TOPICS = ["ReactJS", "JavaScript", "Cybersecurity", "MongoDB", "OOPs in C++", "Node.js", "System Design"];
const STEPS = ["Setup", "Interview", "Answer", "Feedback"];

function isValidQuestion(text) {
  if (!text) return false;
  const invalid = ["Error", "Please", "Rate", "Loading", "Groq", "missing"];
  return !invalid.some((p) => text.startsWith(p));
}

export default function Ai_interview() {
  const [totalScore, setTotalScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [recording, setRecording] = useState(false);
  const [videoMode, setVideoMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [response, setResponse] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const mediaRecorderRef = useRef(null);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const recordedChunks = useRef([]);
  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);

  const speakQuestion = useCallback((text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.rate = 0.95;
    const voices = speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Samantha")));
    speech.voice = voice || voices.find((v) => v.lang.startsWith("en")) || voices[0];
    speechSynthesis.speak(speech);
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
      const generatedQuestion = await generateGroqText(
        interviewQuestionPrompt(topic, difficulty),
        GROQ_MODELS.fast
      );
      const cleaned = generatedQuestion.replace(/^["']|["']$/g, "").trim();
      setQuestion(cleaned);
      setResponse(cleaned);
      speakQuestion(cleaned);
    } catch (error) {
      console.error("Error fetching interview questions:", error);
      setResponse(getGroqErrorMessage(error, "Error fetching interview questions."));
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
      const result = await generateGroqJSON(interviewAnalyzePrompt(activeQuestion, answer.trim()));
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
    } catch (error) {
      console.error("Error analyzing the answer:", error);
      setFeedback({
        score: 0,
        feedback: getGroqErrorMessage(error, "Error analyzing the answer."),
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
    } catch (error) {
      console.error("Error accessing media devices:", error);
      if (!isVideo) {
        // Speech-only mode still works without mic permission for typed answers
        return;
      }
      alert("Camera access denied or unavailable.");
      isRecordingRef.current = false;
      setRecording(false);
    }
  };

  const stopInterview = () => {
    isRecordingRef.current = false;
    if (mediaRecorderRef.current?.state !== "inactive") mediaRecorderRef.current.stop();
    if (stream) stream.getTracks().forEach((t) => t.stop());
    stopSpeechRecognition();
    setRecording(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] pt-20">
      <div className="min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-10 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[180px] top-1/4 -left-20 animate-pulse" />
          <div className="absolute w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[180px] bottom-1/4 -right-20 animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <motion.div
          className="relative z-10 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              AI <span className="gradient-text">Interview</span>
            </h1>
            <p className="text-slate-400 mt-2 text-sm">Practice with smart feedback, difficulty levels, and live transcription.</p>
          </div>

          <StepIndicator steps={STEPS} current={currentStep} />

          <div className="space-y-5">
            <TopicSelector
              topic={topic}
              setTopic={setTopic}
              topics={TOPICS}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              generateNewQuestion={fetchInterviewQuestions}
              response={response}
              loadingQuestion={loadingQuestion}
              isQuestionReady={isValidQuestion(response)}
            />

            <InterviewControls
              startInterview={startInterview}
              stopInterview={stopInterview}
              recording={recording}
              topic={topic}
              timer={timer}
            />

            <InterviewVideoFeed
              videoMode={videoMode}
              videoRef={videoRef}
              transcript={transcript}
              recording={recording}
            />

            <AnswerAnalyzer
              answer={answer}
              setAnswer={setAnswer}
              analyzeAnswer={analyzeAnswer}
              analyzing={analyzing}
              onNextQuestion={handleNextQuestion}
              hasFeedback={Boolean(feedback)}
            />

            <InterviewResults
              feedback={feedback}
              totalScore={totalScore}
              attempts={attempts}
              percentage={percentage}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
