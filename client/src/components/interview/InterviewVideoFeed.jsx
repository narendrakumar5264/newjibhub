import { motion } from "framer-motion";

export default function InterviewVideoFeed({ videoMode, videoRef, transcript, recording }) {
  if (!videoMode && !recording && !transcript) return null;

  return (
    <motion.div
      className="card-premium bg-slate-900/80 border-slate-700/50 p-6 w-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {videoMode && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-xl shadow-lg border border-slate-700 aspect-video object-cover bg-black"
        />
      )}
      {(recording || transcript) && (
        <div className={`${videoMode ? "mt-4" : ""} p-4 rounded-xl bg-slate-800/80 border border-slate-700`}>
          <div className="flex items-center gap-2 mb-2">
            {recording && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
            <p className="text-xs uppercase tracking-wide text-slate-400 font-semibold">Live Transcript</p>
          </div>
          <p className="text-slate-200 leading-relaxed min-h-[3rem]">
            {transcript || (recording ? "Listening... speak your answer clearly." : "")}
          </p>
        </div>
      )}
    </motion.div>
  );
}
