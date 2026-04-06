import { FiAlertCircle, FiX } from "react-icons/fi";

export function ErrorModal({ title, message, onClose, onRetry }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-red-200 max-w-md w-full overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiAlertCircle className="w-6 h-6 text-red-600" />
            <h2 className="text-lg font-bold text-red-900">{title || "Error"}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            {message || "An unexpected error occurred. Please try again."}
          </p>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Dismiss
            </button>
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
