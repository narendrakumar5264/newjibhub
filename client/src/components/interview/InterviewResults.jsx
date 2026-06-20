import ScoreRing from "../common/ScoreRing";

export default function InterviewResults({ feedback, totalScore, attempts, percentage }) {
  if (!feedback && attempts === 0) return null;

  const score = feedback?.score ?? 0;

  return (
    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-8 w-full">
      <h3 className="text-lg font-bold text-white mb-5">Latest Feedback</h3>

      {feedback ? (
        <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-start">
          <ScoreRing score={score} max={10} size={100} label="This Answer" />

          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">{feedback.feedback}</p>

            {feedback.strengths?.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-400 font-semibold mb-2">Strengths</p>
                <div className="flex flex-wrap gap-2">
                  {feedback.strengths.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {feedback.improvements?.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-wide text-amber-400 font-semibold mb-2">Improve</p>
                <div className="flex flex-wrap gap-2">
                  {feedback.improvements.map((s, i) => (
                    <span key={i} className="px-3 py-1 rounded-full text-xs bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-slate-400 text-sm">{feedback}</p>
      )}

      {attempts > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-700 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">{attempts}</p>
            <p className="text-xs text-slate-500">Questions</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-400">{totalScore}</p>
            <p className="text-xs text-slate-500">Total Points</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-teal-400">{percentage}%</p>
            <p className="text-xs text-slate-500">Avg Score</p>
          </div>
        </div>
      )}
    </div>
  );
}
