export default function Loader({ text = "Loading...", fullScreen = false }) {
  return (
    <div
      className={`flex flex-col items-center justify-center
        ${fullScreen ? "fixed inset-0 bg-slate-900 z-50" : "py-10"}`}
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-300 border-t-sky-500"></div>

      <p className="mt-3 text-sm text-slate-400">
        {text}
      </p>
    </div>
  );
}
