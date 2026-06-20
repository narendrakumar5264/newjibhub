export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="w-5 h-5 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-sm text-slate-400">{text}</span>
    </div>
  );
}
