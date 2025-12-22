import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  title = "Something went wrong",
  message = "We couldn’t load the data. Please try again.",
  onRetry,
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-14 w-14 flex items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={28} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-slate-800">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-slate-600 mt-2">
          {message}
        </p>

        {/* Action */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            <RefreshCcw size={16} />
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
