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
    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-8 w-full">
      <h3 className="text-lg font-bold text-white mb-4">Setup</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wide mb-2 block">Topic</label>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
          >
            <option value="">Select a topic</option>
            {topics.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-400 uppercase tracking-wide mb-2 block">Difficulty</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                className={`flex-1 py-3 rounded-xl text-sm font-medium transition ${
                  difficulty === d
                    ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700"
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
        className="mt-4 w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loadingQuestion ? "Generating..." : "Get New Question"}
      </button>

      {loadingQuestion && <LoadingSpinner text="AI is preparing your question..." />}

      {response && !loadingQuestion && (
        <div className={`mt-5 p-5 rounded-xl border ${isQuestionReady ? "bg-emerald-500/5 border-emerald-500/30" : "bg-amber-500/5 border-amber-500/30"}`}>
          <p className="text-xs uppercase tracking-wide text-emerald-400 mb-2 font-semibold">Current Question</p>
          <p className="text-white text-base leading-relaxed">{response}</p>
        </div>
      )}
    </div>
  );
}
