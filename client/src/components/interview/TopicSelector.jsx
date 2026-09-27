import LoadingSpinner from "../common/LoadingSpinner";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function TopicSelector({
  topic,
  setTopic,
  topics,
  difficulty,
  setDifficulty,
  generateNewQuestion,
  response,
  loadingQuestion,
  isQuestionReady,
}) {
  return (
    <div className="card-premium p-6 sm:p-8 w-full">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Interview Setup</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block font-semibold">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm"
          >
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block font-semibold">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-3 rounded-xl text-xs font-semibold transition ${
                  difficulty === d
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                    : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={generateNewQuestion}
        disabled={!topic || loadingQuestion}
        className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-emerald-500/20"
      >
        {loadingQuestion ? "Generating..." : "Get New Question"}
      </button>

      {loadingQuestion && <LoadingSpinner text="AI is preparing your question..." />}

      {response && !loadingQuestion && (
        <div className={`mt-5 p-5 rounded-xl border ${isQuestionReady ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-100" : "bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-500/30 text-amber-950 dark:text-amber-100"}`}>
          <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-2 font-bold">Current Question</p>
          <p className="text-sm sm:text-base leading-relaxed font-medium">{response}</p>
        </div>
      )}
    </div>
  );
}
