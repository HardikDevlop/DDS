import { useState, useEffect } from "react";
import axios from "axios";
import { FiShield, FiCheck } from "react-icons/fi";

const POLICY_CSS = `
  .policy-overlay {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center; z-index: 60; padding: 16px;
  }
  .policy-card {
    background: #ffffff; border: 1px solid #dde5f4; border-radius: 18px;
    padding: 32px 28px; width: 100%; max-width: 440px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  }
  .policy-check-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 14px; border: 1px solid #dde5f4; border-radius: 10px;
    background: #f8faff; cursor: pointer; transition: border-color 0.15s, background 0.15s;
  }
  .policy-check-row:hover { border-color: #2563eb; background: #eff4ff; }
  .policy-check-row.checked { border-color: #2563eb; background: #eff4ff; }
  .policy-accept-btn {
    width: 100%; padding: 13px; border: none; border-radius: 10px;
    background: #2563eb; color: #fff;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.15s; margin-top: 20px;
  }
  .policy-accept-btn:hover:not(:disabled) { background: #1d4ed8; }
  .policy-accept-btn:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
`;

export function PolicyModal({ user, refreshUser }) {
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user.privacyAccepted && user.termsAccepted) {
      localStorage.setItem("policiesAccepted", "true");
    }
  }, [user.privacyAccepted, user.termsAccepted]);

  const handleAccept = async () => {
    setSubmitting(true);
    await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/users/accept-policies`,
      { privacyAccepted: true, termsAccepted: true },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    await refreshUser();
    setSubmitting(false);
  };

  if (user.privacyAccepted && user.termsAccepted) return null;

  return (
    <div className="policy-overlay">
      <style>{POLICY_CSS}</style>
      <div className="policy-card">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, background: "#eff4ff", border: "1px solid #bcd0fa", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <FiShield size={22} color="#2563eb" />
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>Please Accept Our Policies</h2>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
            Before continuing, please review and accept our policies.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label className={`policy-check-row${privacyChecked ? " checked" : ""}`}>
            <input type="checkbox" checked={privacyChecked} onChange={e => setPrivacyChecked(e.target.checked)} style={{ width: 16, height: 16, marginTop: 1, flexShrink: 0, accentColor: "#2563eb" }} />
            <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
              I have read and accept the{" "}
              <a href="/privacy" target="_blank" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>
            </span>
          </label>

          <label className={`policy-check-row${termsChecked ? " checked" : ""}`}>
            <input type="checkbox" checked={termsChecked} onChange={e => setTermsChecked(e.target.checked)} style={{ width: 16, height: 16, marginTop: 1, flexShrink: 0, accentColor: "#2563eb" }} />
            <span style={{ fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
              I have read and accept the{" "}
              <a href="/terms" target="_blank" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Terms &amp; Conditions</a>
            </span>
          </label>
        </div>

        <button
          className="policy-accept-btn"
          disabled={!privacyChecked || !termsChecked || submitting}
          onClick={handleAccept}
        >
          <FiCheck size={14} />
          {submitting ? "Saving…" : "Accept and Continue"}
        </button>
      </div>
    </div>
  );
}
