import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FiMail, FiCheckCircle, FiRefreshCw } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ve-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f0f4ff;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px 16px;
  }

  .ve-card {
    background: #fff;
    border: 1px solid #dde5f4;
    border-radius: 20px;
    overflow: hidden;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  }

  .ve-header {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    padding: 32px 24px;
    text-align: center;
  }

  .ve-icon-wrap {
    width: 52px; height: 52px;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 14px;
  }

  .ve-body { padding: 28px 24px; }

  .ve-label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #475569;
    margin-bottom: 8px;
    letter-spacing: 0.04em;
  }

  .ve-input {
    width: 100%;
    border: 2px solid #dde5f4;
    border-radius: 12px;
    padding: 14px 16px;
    font-size: 22px;
    font-weight: 800;
    font-family: monospace;
    color: #0f172a;
    background: #f8faff;
    outline: none;
    text-align: center;
    letter-spacing: 0.35em;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -moz-appearance: textfield;
  }
  .ve-input::-webkit-outer-spin-button,
  .ve-input::-webkit-inner-spin-button { -webkit-appearance: none; }
  .ve-input:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
    background: #fff;
  }
  .ve-input.has-value {
    border-color: #2563eb;
    background: #eff4ff;
  }
  .ve-input.input-error {
    border-color: #ef4444;
    background: #fef2f2;
    box-shadow: 0 0 0 4px rgba(239,68,68,0.08);
  }

  /* Timer bar */
  .ve-timer-bar {
    height: 3px;
    background: #e2e8f0;
    border-radius: 2px;
    margin-top: 10px;
    overflow: hidden;
  }
  .ve-timer-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 1s linear, background 0.5s;
  }

  /* Error box */
  .ve-error {
    display: flex; align-items: center; gap: 8px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: #b91c1c;
    margin-top: 12px;
  }

  /* Verify button */
  .ve-btn {
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
    margin-top: 18px;
    transition: background 0.15s, transform 0.1s, opacity 0.15s;
    box-shadow: 0 4px 14px rgba(37,99,235,0.25);
  }
  .ve-btn:hover:not(:disabled) { background: #1d4ed8; transform: translateY(-1px); }
  .ve-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

  /* Resend */
  .ve-footer {
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid #f1f5f9;
    text-align: center;
  }
  .resend-btn {
    background: none; border: none; cursor: pointer;
    font-family: inherit; font-size: 13px; font-weight: 700;
    color: #2563eb; padding: 0;
    display: inline-flex; align-items: center; gap: 5px;
  }
  .resend-btn:disabled { color: #94a3b8; cursor: default; }

  /* Success */
  .ve-success {
    text-align: center;
    padding: 8px 0 4px;
  }
  .ve-success-icon {
    width: 60px; height: 60px;
    background: #dcfce7;
    border: 2px solid #bbf7d0;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 16px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .ve-card { animation: fadeUp 0.3s ease both; }
`;

const OTP_LIFE = 15 * 60;

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [otpAge, setOtpAge] = useState(OTP_LIFE);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  // Resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => Math.max(0, c - 1)), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  // OTP expiry
  useEffect(() => {
    if (otpAge <= 0) return;
    const t = setInterval(() => setOtpAge(a => Math.max(0, a - 1)), 1000);
    return () => clearInterval(t);
  }, [otpAge]);

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(val);
    setError("");
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (code.length < 6) { setError("Please enter the complete 6-digit code."); return; }
    if (!email) { setError("Session lost. Please sign up again."); return; }
    if (otpAge <= 0) { setError("Code expired. Please request a new one."); return; }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/auth/verify-email`, {
        email,
        verificationCode: code,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login", { state: { verified: true } }), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid code. Please try again.");
      setCode("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0 || resending) return;
    try {
      setResending(true); setResendMsg(""); setError(""); setCode("");
      await axios.post(`${BASE_URL}/api/auth/resend-otp`, { email });
      setResendMsg("New code sent! Check your inbox.");
      setCooldown(60);
      setOtpAge(OTP_LIFE);
    } catch (err) {
      setResendMsg(err.response?.data?.message || "Failed to resend. Try again.");
    } finally {
      setResending(false);
    }
  };

  const mins = String(Math.floor(otpAge / 60)).padStart(2, "0");
  const secs = String(otpAge % 60).padStart(2, "0");
  const pct = Math.round((otpAge / OTP_LIFE) * 100);
  const barColor = otpAge < 120 ? "#ef4444" : "#2563eb";

  // No email in state
  if (!email) {
    return (
      <div className="ve-root">
        <style>{CSS}</style>
        <div className="ve-card" style={{ padding: 32, textAlign: "center" }}>
          <p style={{ color: "#b91c1c", marginBottom: 16, fontSize: 14 }}>
            Session expired. Please sign up again.
          </p>
          <a href="/signup" style={{ color: "#2563eb", fontWeight: 700, fontSize: 14 }}>
            Go to Sign Up →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="ve-root">
      <style>{CSS}</style>
      <div className="ve-card">

        {/* Header */}
        <div className="ve-header">
          <div className="ve-icon-wrap">
            <FiMail size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 21, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
            Check your inbox
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}>
            We sent a 6-digit code to<br />
            <strong style={{ color: "#fff" }}>{email}</strong>
          </p>
        </div>

        {/* Body */}
        <div className="ve-body">

          {success ? (
            /* ── Success state ── */
            <div className="ve-success">
              <div className="ve-success-icon">
                <FiCheckCircle size={26} color="#16a34a" />
              </div>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#15803d", marginBottom: 6 }}>
                Email Verified!
              </p>
              <p style={{ fontSize: 13, color: "#64748b" }}>
                Redirecting you to login…
              </p>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleVerify}>
              <label className="ve-label">Verification Code</label>

              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder="000000"
                value={code}
                onChange={handleChange}
                maxLength={6}
                autoFocus
                autoComplete="one-time-code"
                className={`ve-input${code.length > 0 ? " has-value" : ""}${error ? " input-error" : ""}`}
              />

              {/* Timer bar */}
              <div className="ve-timer-bar">
                <div className="ve-timer-fill" style={{ width: `${pct}%`, background: barColor }} />
              </div>
              <p style={{ fontSize: 11, color: otpAge < 120 ? "#ef4444" : "#94a3b8", textAlign: "center", marginTop: 5 }}>
                {otpAge > 0
                  ? `Code expires in ${mins}:${secs}`
                  : "Code expired — request a new one below"}
              </p>

              {/* Error */}
              {error && (
                <div className="ve-error">
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Verify button */}
              <button
                type="submit"
                className="ve-btn"
                disabled={loading || code.length < 6 || otpAge <= 0}
              >
                {loading
                  ? <>
                    <div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                    Verifying…
                  </>
                  : <><FiCheckCircle size={16} /> Verify Email</>
                }
              </button>
            </form>
          )}

          {/* Resend + footer links */}
          {!success && (
            <div className="ve-footer">
              {resendMsg && (
                <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: resendMsg.includes("sent") ? "#16a34a" : "#b91c1c" }}>
                  {resendMsg}
                </p>
              )}
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 8 }}>
                Didn't receive the code?{" "}
                <button
                  className="resend-btn"
                  onClick={handleResend}
                  disabled={cooldown > 0 || resending}
                >
                  {resending
                    ? "Sending…"
                    : cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : <><FiRefreshCw size={12} /> Resend code</>
                  }
                </button>
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8" }}>
                Wrong email?{" "}
                <a href="/signup" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
                  Sign up again
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}