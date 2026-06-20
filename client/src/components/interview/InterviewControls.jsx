import { motion } from "framer-motion";
import { FaMicrophone, FaVideo, FaStop } from "react-icons/fa";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function InterviewControls({
  startInterview,
  stopInterview,
  recording,
  topic,
  timer,
}) {
  return (
    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Interview Session</h3>
          <p className="text-sm text-slate-400 mt-1">
            {topic ? `Topic: ${topic}` : "Select a topic below to begin"}
          </p>
        </div>
        {recording && (
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-sm font-mono font-semibold">{formatTime(timer)}</span>
            <span className="text-red-400/80 text-xs">Recording</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <motion.button
          className="flex items-center gap-2 px-5 py-3 bg-blue-600/90 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => startInterview(false)}
          disabled={recording || !topic}
          whileHover={{ scale: recording || !topic ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaMicrophone /> Audio Interview
        </motion.button>
        <motion.button
          className="flex items-center gap-2 px-5 py-3 bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => startInterview(true)}
          disabled={recording || !topic}
          whileHover={{ scale: recording || !topic ? 1 : 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FaVideo /> Video Interview
        </motion.button>
        {recording && (
          <motion.button
            className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition"
            onClick={stopInterview}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaStop /> End Session
          </motion.button>
        )}
      </div>
    </div>
  );
}
