import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const T = {
  bg: "#f0f4ff", bgWhite: "#ffffff", bgSoft: "#f8faff",
  blue: "#2563eb", blueDark: "#1d4ed8", bluePale: "#eff4ff",
  text: "#0f172a", textMid: "#334155", muted: "#64748b",
  border: "#dde5f4", shadowSm: "rgba(0,0,0,0.06)",
};

const CSS = `
  .signup-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh;
    display: flex; align-items: center; justify-content: center; padding: 24px 16px;
  }
  .signup-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    border-radius: 18px; overflow: hidden; width: 100%; max-width: 420px;
    box-shadow: 0 4px 24px ${T.shadowSm};
  }
  .signup-header {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    padding: 32px 28px; text-align: center;
  }
  .signup-body { padding: 28px; }

  .form-label { display: block; font-size: 12px; font-weight: 700; color: ${T.textMid}; margin-bottom: 6px; }
  .form-input {
    width: 100%; border: 1px solid ${T.border}; border-radius: 9px;
    padding: 11px 13px; font-size: 14px; font-family: inherit;
    color: ${T.text}; background: ${T.bgSoft}; outline: none; box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus { border-color: ${T.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); background: ${T.bgWhite}; }
  .form-input.with-icon { padding-right: 42px; }

  .pw-strength {
    font-size: 11px; color: #dc2626; margin-top: 5px;
    background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px;
    padding: 5px 10px; line-height: 1.5;
  }

  .submit-btn {
    width: 100%; padding: 13px; border: none; border-radius: 10px;
    background: ${T.blue}; color: #fff;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.15s;
  }
  .submit-btn:hover:not(:disabled) { background: ${T.blueDark}; }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!strongPasswordRegex.test(form.password)) {
      setError("Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 symbol.");
      setIsLoading(false);
      return;
    }
    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, form);
      navigate("/verify-email", { state: { email: form.email } });
    } catch (err) {
      setError(err.response?.status === 400 ? "User already exists. Please login." : "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const pwWeak = form.password && !strongPasswordRegex.test(form.password);

  return (
    <div className="signup-root">
      <style>{CSS}</style>
      <div className="signup-card">
        {/* Header */}
        <div className="signup-header">
          <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Create your account</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>Join thousands of happy customers</p>
        </div>

        {/* Body */}
        <div className="signup-body">
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 8 }}>
              <svg width="15" height="15" viewBox="0 0 20 20" fill="#ef4444" style={{ flexShrink: 0, marginTop: 1 }}><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label className="form-label">Full Name</label>
              <input id="name" name="name" type="text" autoComplete="name" required
                className="form-input" placeholder="John Doe"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input id="email" name="email" type="email" autoComplete="email" required
                className="form-input" placeholder="your@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required
                  className="form-input with-icon" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(p => !p)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", padding: 0, display: "flex", alignItems: "center" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              {pwWeak && (
                <p className="pw-strength">
                  Password must have 8+ characters, 1 uppercase, 1 lowercase, 1 number, and 1 symbol.
                </p>
              )}
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading} style={{ marginTop: 4 }}>
              {isLoading
                ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Processing…</>
                : "Sign Up"
              }
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${T.border}`, textAlign: "center", fontSize: 13, color: T.muted }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: T.blue, fontWeight: 700, textDecoration: "none" }}>Log in</Link>
          </div>
        </div>
      </div>

      {/* Terms footer */}
      <p style={{ position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", fontSize: 11, color: T.muted }}>
        By signing up, you agree to our{" "}
        <Link to="/terms" style={{ color: T.blue, textDecoration: "none" }}>Terms of Service</Link>
        {" "}and{" "}
        <Link to="/privacy" style={{ color: T.blue, textDecoration: "none" }}>Privacy Policy</Link>
      </p>
    </div>
  );
}