import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .su-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f0f4ff;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
  }

  .su-card {
    background: #fff;
    border: 1px solid #dde5f4;
    border-radius: 20px;
    overflow: hidden;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    animation: fadeUp 0.3s ease both;
  }

  .su-header {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    padding: 32px 24px;
    text-align: center;
  }

  .su-icon-wrap {
    width: 52px; height: 52px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }

  .su-body { padding: 28px 24px; }

  .su-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    margin-bottom: 7px;
    letter-spacing: 0.03em;
  }

  .su-input {
    width: 100%;
    border: 2px solid #dde5f4;
    border-radius: 11px;
    padding: 12px 14px;
    font-size: 14px;
    font-family: inherit;
    color: #0f172a;
    background: #f8faff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .su-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
    background: #fff;
  }
  .su-input.with-icon { padding-right: 44px; }
  .su-input::placeholder { color: #94a3b8; }

  .su-input-wrap { position: relative; }
  .su-eye-btn {
    position: absolute; right: 13px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none; cursor: pointer;
    color: #94a3b8; padding: 0;
    display: flex; align-items: center;
    transition: color 0.15s;
  }
  .su-eye-btn:hover { color: #64748b; }

  /* Password strength bar */
  .pw-bar-wrap {
    display: flex; gap: 4px; margin-top: 8px;
  }
  .pw-bar {
    flex: 1; height: 3px; border-radius: 2px;
    background: #e2e8f0;
    transition: background 0.3s;
  }

  .pw-hint {
    font-size: 11px; margin-top: 6px;
    line-height: 1.5;
  }

  /* Error */
  .su-error {
    display: flex; align-items: flex-start; gap: 8px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: #b91c1c;
    margin-bottom: 18px;
  }

  /* Submit button */
  .su-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;
    background: #2563eb;
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 6px;
    transition: background 0.15s, transform 0.1s, opacity 0.15s;
    box-shadow: 0 4px 14px rgba(37,99,235,0.25);
  }
  .su-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
  .su-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; box-shadow: none; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// Password strength checker
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^\w\s]/.test(pw)) score++;
  return score; // 0–5
}

const STRENGTH_COLORS = ["#e2e8f0", "#ef4444", "#f59e0b", "#f59e0b", "#22c55e", "#16a34a"];
const STRENGTH_LABELS = ["", "Too weak", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_TEXT_COLORS = ["#94a3b8", "#ef4444", "#d97706", "#d97706", "#16a34a", "#15803d"];

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const navigate = useNavigate();

  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
  const strength = form.password ? getStrength(form.password) : 0;
  const isStrong = strongRegex.test(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isStrong) {
      setError("Password must be 8+ characters with uppercase, lowercase, number, and symbol.");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${BASE_URL}/api/auth/signup`, form);
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message;
      setError(msg || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="su-root">
      <style>{CSS}</style>
      <div className="su-card">

        {/* Header */}
        <div className="su-header">
          <div className="su-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h1 style={{ fontSize: 21, fontWeight: 800, color: "#fff", marginBottom: 5 }}>
            Create your account
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
            Join thousands of happy customers
          </p>
        </div>

        {/* Body */}
        <div className="su-body">

          {/* Error */}
          {error && (
            <div className="su-error">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="#ef4444" style={{ flexShrink: 0, marginTop: 1 }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Full Name */}
            <div>
              <label className="su-label">Full Name</label>
              <input
                type="text" name="name" autoComplete="name" required
                placeholder="John Doe"
                className="su-input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>

            {/* Email */}
            <div>
              <label className="su-label">Email Address</label>
              <input
                type="email" name="email" autoComplete="email" required
                placeholder="your@email.com"
                className="su-input"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="su-label">Create Password</label>
              <div className="su-input-wrap">
                <input
                  type={showPw ? "text" : "password"}
                  name="password" autoComplete="new-password" required
                  placeholder="••••••••"
                  className={`su-input with-icon`}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button" tabIndex={-1}
                  className="su-eye-btn"
                  onClick={() => setShowPw(p => !p)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <>
                  <div className="pw-bar-wrap">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className="pw-bar"
                        style={{ background: i <= strength ? STRENGTH_COLORS[strength] : "#e2e8f0" }}
                      />
                    ))}
                  </div>
                  <p className="pw-hint" style={{ color: STRENGTH_TEXT_COLORS[strength] }}>
                    {STRENGTH_LABELS[strength]}
                    {strength < 5 && " — add uppercase, number & symbol for a stronger password"}
                  </p>
                </>
              )}
            </div>

            {/* Submit */}
            <button type="submit" className="su-btn" disabled={isLoading}>
              {isLoading
                ? <>
                  <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                  Creating account…
                </>
                : "Sign Up"
              }
            </button>
          </form>

          {/* Login link */}
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid #f1f5f9", textAlign: "center", fontSize: 13, color: "#64748b" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}