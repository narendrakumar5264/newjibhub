export default function StepIndicator({ steps, current }) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8 flex-wrap">
      {steps.map((step, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                done ? "bg-emerald-500 text-white" : active ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500" : "bg-slate-800 text-slate-500"
              }`}
            >
              {done ? "✓" : num}
            </div>
            <span className={`text-xs hidden sm:inline ${active ? "text-emerald-400 font-medium" : "text-slate-500"}`}>
              {step}
            </span>
            {i < steps.length - 1 && <div className="w-6 sm:w-10 h-px bg-slate-700 hidden sm:block" />}
          </div>
        );
      })}
    </div>
  );
}
