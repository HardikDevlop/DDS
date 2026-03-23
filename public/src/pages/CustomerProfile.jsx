import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { FiLogOut, FiHelpCircle, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiShield } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const T = {
  bg: "#f0f4ff", bgWhite: "#ffffff", bgSoft: "#f8faff",
  blue: "#2563eb", blueDark: "#1d4ed8", bluePale: "#eff4ff",
  text: "#0f172a", textMid: "#334155", muted: "#64748b",
  border: "#dde5f4", shadowSm: "rgba(0,0,0,0.05)", shadow: "rgba(37,99,235,0.08)",
  green: "#16a34a", greenPale: "#dcfce7",
};

const CSS = `
  .profile-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh; color: ${T.text};
  }
  .profile-inner { max-width: 860px; margin: 0 auto; padding: 40px 20px 60px; }

  .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }
  @media(max-width:640px){ .profile-grid{ grid-template-columns:1fr; } }

  .info-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    border-radius: 14px; padding: 22px;
    box-shadow: 0 2px 12px ${T.shadowSm};
  }
  .info-row {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 0; border-bottom: 1px solid ${T.border};
  }
  .info-row:last-child { border-bottom: none; }
  .info-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: ${T.bluePale}; border: 1px solid #bcd0fa;
    display: flex; align-items: center; justify-content: center;
    color: ${T.blue}; flex-shrink: 0; margin-top: 1px;
  }

  .help-btn {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600; color: ${T.blue};
    background: ${T.bluePale}; border: 1px solid #bcd0fa;
    border-radius: 8px; padding: 7px 14px; cursor: pointer;
    text-decoration: none; transition: background 0.15s;
    font-family: inherit;
  }
  .help-btn:hover { background: #dbeafe; }
`;

export default function CustomerProfile() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`${BASE_URL}/api/users/me`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
        .then(res => setUser(res.data))
        .catch(err => console.error("Failed to load profile:", err));
    } else {
      setShowLoginPopup(true);
    }
  }, [isAuthenticated]);

  /* ── Not authenticated ── */
  if (!user) return (
    <>
      {showLoginPopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 60, padding: 16, fontFamily: "system-ui,sans-serif" }}>
          <div style={{ background: T.bgWhite, border: `1px solid ${T.border}`, borderRadius: 16, padding: "32px 28px", maxWidth: 340, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 52, height: 52, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FiShield size={22} color="#ef4444" />
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 6 }}>Session Expired</h3>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 22, lineHeight: 1.6 }}>Your access token is expired. Please log in again to view your profile.</p>
            <button onClick={() => window.location.href = "/login"} style={{ padding: "11px 28px", background: T.blue, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Go to Login
            </button>
          </div>
        </div>
      )}
    </>
  );

  const personalFields = [
    { icon: <FiUser size={14} />, label: "Full Name", value: user.name },
    { icon: <FiMail size={14} />, label: "Email Address", value: user.email },
    { icon: <FiPhone size={14} />, label: "Phone Number", value: user.phone || "Not Provided" },
  ];
  const accountFields = [
    { icon: <FiMapPin size={14} />, label: "Location", value: user.location || "Not Set" },
    { icon: <FiCalendar size={14} />, label: "Member Since", value: new Date(user.createdAt).toLocaleDateString() },
    { icon: <FiShield size={14} />, label: "Account Status", value: "Active", green: true },
  ];

  return (
    <div className="profile-root">
      <style>{CSS}</style>
      <div className="profile-inner">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: T.bluePale, border: `2px solid #bcd0fa`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {user.profilePicUrl
                ? <img src={user.profilePicUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <FiUser size={26} color={T.blue} />
              }
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.blue, marginBottom: 3 }}>Account</p>
              <h2 style={{ fontSize: "clamp(1.2rem,3vw,1.6rem)", fontWeight: 800, letterSpacing: "-0.02em", color: T.text, marginBottom: 2 }}>My Profile</h2>
              <p style={{ fontSize: 13, color: T.muted }}>Manage your account information</p>
            </div>
          </div>
          <button className="help-btn" onClick={() => navigate("/help")}>
            <FiHelpCircle size={14} /> Help
          </button>
        </div>

        {/* Info grids */}
        <div className="profile-grid">
          <div className="info-card">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.blue, marginBottom: 12 }}>Personal</p>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 2, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>Personal Information</h3>
            {personalFields.map(({ icon, label, value }) => (
              <div className="info-row" key={label}>
                <div className="info-icon">{icon}</div>
                <div>
                  <p style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="info-card">
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.blue, marginBottom: 12 }}>Account</p>
            <h3 style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 2, paddingBottom: 12, borderBottom: `1px solid ${T.border}` }}>Account Details</h3>
            {accountFields.map(({ icon, label, value, green }) => (
              <div className="info-row" key={label}>
                <div className="info-icon">{icon}</div>
                <div>
                  <p style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: green ? T.green : T.text }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}