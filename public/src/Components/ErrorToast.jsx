import { useEffect } from "react";
import { FiAlertCircle, FiX } from "react-icons/fi";

const T = {
  bg: "#f8fafc",
  bgWhite: "#ffffff",
  text: "#0f172a",
  muted: "#64748b",
  red700: "#b91c1c",
  red50: "#fef2f2",
};

export function ErrorToast({ message, onClose, duration = 5000 }) {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        background: T.red50,
        border: `2px solid ${T.red700}`,
        borderRadius: 12,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        maxWidth: 400,
        zIndex: 9999,
        boxShadow: "0 10px 30px rgba(185, 28, 28, 0.15)",
        animation: "slideInRight 0.3s ease",
      }}
    >
      <FiAlertCircle style={{ color: T.red700, width: 20, height: 20, flexShrink: 0 }} />
      <span style={{ color: T.red700, fontSize: 14, fontWeight: 500, flex: 1 }}>
        {message}
      </span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: T.red700,
            cursor: "pointer",
            padding: "4px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="hover:opacity-70 transition-opacity"
        >
          <FiX width={18} height={18} />
        </button>
      )}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
