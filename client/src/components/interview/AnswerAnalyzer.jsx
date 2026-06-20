import LoadingSpinner from "../common/LoadingSpinner";

export default function AnswerAnalyzer({
  answer,
  setAnswer,
  analyzeAnswer,
  analyzing,
  onNextQuestion,
  hasFeedback,
}) {
  const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;

  return (
    <div className="card-premium bg-slate-900/80 border-slate-700/50 p-6 sm:p-8 w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">Your Answer</h3>
        <span className="text-xs text-slate-500">{wordCount} words</span>
      </div>

      <textarea
        placeholder="Type your answer or use the microphone during the interview..."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-4 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none min-h-[120px] resize-y leading-relaxed"
      />

      <div className="flex flex-wrap gap-3 mt-4">
        <button
          onClick={analyzeAnswer}
          disabled={analyzing || !answer.trim()}
          className="flex-1 min-w-[140px] py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {analyzing ? "Analyzing..." : "Analyze Answer"}
        </button>
        {hasFeedback && (
          <button
            onClick={onNextQuestion}
            disabled={analyzing}
            className="flex-1 min-w-[140px] py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition"
          >
            Next Question
          </button>
        )}
      </div>

      {analyzing && <LoadingSpinner text="AI is evaluating your answer..." />}
    </div>
  );
}
