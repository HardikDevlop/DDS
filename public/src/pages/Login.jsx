// ─── Login.jsx ────────────────────────────────────────────────────────────────
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const T = {
  bg: "#f0f4ff", bgWhite: "#ffffff", bgSoft: "#f8faff",
  blue: "#2563eb", blueDark: "#1d4ed8", bluePale: "#eff4ff",
  text: "#0f172a", textMid: "#334155", muted: "#64748b",
  border: "#dde5f4", shadowSm: "rgba(0,0,0,0.06)",
};
const CSS_LOGIN = `
  .login-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh;
    display: flex; align-items: center; justify-content: center; padding: 24px 16px;
  }
  .login-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border}; border-radius: 18px;
    overflow: hidden; width: 100%; max-width: 420px;
    box-shadow: 0 4px 24px ${T.shadowSm};
  }
  .login-header {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    padding: 32px 28px; text-align: center;
  }
  .login-body { padding: 28px; }
  .form-label { display: block; font-size: 12px; font-weight: 700; color: ${T.textMid}; margin-bottom: 6px; }
  .form-input {
    width: 100%; border: 1px solid ${T.border}; border-radius: 9px;
    padding: 11px 42px 11px 13px; font-size: 14px; font-family: inherit;
    color: ${T.text}; background: ${T.bgSoft}; outline: none; box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus { border-color: ${T.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); background: ${T.bgWhite}; }
  .submit-btn {
    width: 100%; padding: 13px; border: none; border-radius: 10px;
    background: ${T.blue}; color: #fff;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer;
    transition: background 0.15s; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .submit-btn:hover:not(:disabled) { background: ${T.blueDark}; }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  @keyframes spin { to{ transform:rotate(360deg); } }
`;

export function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/login`, form);
      const { token, user } = res.data;
      localStorage.setItem("token", token); localStorage.setItem("user", JSON.stringify(user));
      setIsAuthenticated(true); setUser(user); navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-root">
      <style>{CSS_LOGIN}</style>
      <div className="login-card">
        <div className="login-header">
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Welcome Back</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)" }}>Sign in to your account</p>
        </div>
        <div className="login-body">
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="#ef4444" style={{ flexShrink: 0, marginTop: 1 }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label className="form-label">Email Address</label>
              <div style={{ position: "relative" }}>
                <input type="email" placeholder="Enter your email" className="form-input" required onChange={e => setForm({ ...form, email: e.target.value })} />
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>
            <div>
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} placeholder="Enter your password" className="form-input" required onChange={e => setForm({ ...form, password: e.target.value })} />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(p => !p)} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0 }}>
                  {showPassword
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  }
                </button>
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Signing in…</> : "Sign In"}
            </button>
          </form>
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.border}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
            <Link to="/forgot-password" style={{ fontSize: 13, color: T.blue, textDecoration: "none", fontWeight: 600 }}>Forgot password?</Link>
            <span style={{ fontSize: 13, color: T.muted }}>
              No account? <Link to="/signup" style={{ color: T.blue, fontWeight: 700, textDecoration: "none" }}>Sign Up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;