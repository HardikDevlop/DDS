import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiMail, FiSend, FiArrowLeft } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const T = {
  bg: "#f0f4ff", bgWhite: "#ffffff", bgSoft: "#f8faff",
  blue: "#2563eb", blueDark: "#1d4ed8", bluePale: "#eff4ff",
  text: "#0f172a", textMid: "#334155", muted: "#64748b",
  border: "#dde5f4", shadowSm: "rgba(0,0,0,0.06)",
  green: "#16a34a", greenPale: "#dcfce7",
};

const AUTH_CSS = `
  .auth-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh;
    display: flex; align-items: center; justify-content: center; padding: 24px 16px;
  }
  .auth-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    border-radius: 18px; overflow: hidden; width: 100%; max-width: 400px;
    box-shadow: 0 4px 24px ${T.shadowSm};
  }
  .auth-header {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    padding: 28px 24px; text-align: center;
  }
  .auth-body { padding: 28px; }
  .auth-label { display: block; font-size: 12px; font-weight: 700; color: ${T.textMid}; margin-bottom: 6px; }
  .auth-input {
    width: 100%; border: 1px solid ${T.border}; border-radius: 9px;
    padding: 11px 13px; font-size: 14px; font-family: inherit;
    color: ${T.text}; background: ${T.bgSoft}; outline: none; box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .auth-input:focus { border-color: ${T.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); background: ${T.bgWhite}; }
  .auth-btn {
    width: 100%; padding: 13px; border: none; border-radius: 10px;
    background: ${T.blue}; color: #fff;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.15s; margin-top: 4px;
  }
  .auth-btn:hover { background: ${T.blueDark}; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError(""); setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
      setMessage(res.data.message || "Reset link sent to your email.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-root">
      <style>{AUTH_CSS}</style>
      <div className="auth-card">
        <div className="auth-header">
          <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <FiMail size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Forgot Password?</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>Enter your email and we'll send a reset link.</p>
        </div>

        <div className="auth-body">
          {message && (
            <div style={{ background: T.greenPale, border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.green, marginBottom: 18 }}>
              ✓ {message}
            </div>
          )}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 18 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="auth-label">Email Address</label>
              <input type="email" placeholder="Enter your email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading
                ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Sending…</>
                : <><FiSend size={13} /> Send Reset Link</>
              }
            </button>
          </form>

          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${T.border}`, textAlign: "center" }}>
            <Link to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: T.blue, fontWeight: 600, textDecoration: "none" }}>
              <FiArrowLeft size={13} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
