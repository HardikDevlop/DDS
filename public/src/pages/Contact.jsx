import { useState } from "react";
import axios from "axios";
import { FiPhone, FiMail, FiHelpCircle, FiSend, FiCheck } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const T = {
  bg: "#f0f4ff",
  bgWhite: "#ffffff",
  bgSoft: "#f8faff",
  blue: "#2563eb",
  blueDark: "#1d4ed8",
  bluePale: "#eff4ff",
  text: "#0f172a",
  textMid: "#334155",
  muted: "#64748b",
  border: "#dde5f4",
  shadow: "rgba(37,99,235,0.08)",
  shadowSm: "rgba(0,0,0,0.05)",
  green: "#16a34a",
  greenPale: "#dcfce7",
  red: "#ef4444",
  redPale: "#fef2f2",
};

const CSS = `
  .contact-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh; color: ${T.text};
  }
  .contact-inner { margin: 0 auto; padding: 48px 20px 64px; }

  .info-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 24px; }
  @media(max-width:600px){ .info-grid{ grid-template-columns:1fr; } }

  .info-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    border-radius: 14px; padding: 18px 16px;
    box-shadow: 0 2px 12px ${T.shadowSm};
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .info-card:hover { box-shadow: 0 8px 28px ${T.shadow}; transform: translateY(-2px); }
  .info-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: ${T.bluePale}; border: 1px solid #bcd0fa;
    display: flex; align-items: center; justify-content: center;
    color: ${T.blue}; margin-bottom: 12px;
  }

  .form-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    border-radius: 16px; padding: 32px;
    box-shadow: 0 2px 16px ${T.shadowSm};
  }
  @media(max-width:480px){ .form-card{ padding: 20px 16px; } }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media(max-width:540px){ .form-row{ grid-template-columns:1fr; } }

  .form-label { display: block; font-size: 12px; font-weight: 600; color: ${T.textMid}; margin-bottom: 6px; }
  .form-input {
    width: 100%; border: 1px solid ${T.border}; border-radius: 9px;
    padding: 10px 13px; font-size: 14px; font-family: inherit;
    color: ${T.text}; background: ${T.bgSoft}; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
  }
  .form-input:focus { border-color: ${T.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); background: ${T.bgWhite}; }
  .form-input::placeholder { color: #94a3b8; }
  .form-input.err { border-color: ${T.red}; }

  .submit-btn {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${T.blue}; color: #fff; border: none;
    padding: 11px 28px; border-radius: 9px;
    font-size: 14px; font-weight: 600; font-family: inherit;
    cursor: pointer; transition: background 0.15s, transform 0.15s;
  }
  .submit-btn:hover:not(:disabled) { background: ${T.blueDark}; transform: translateY(-1px); }
  .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
`;

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, phone, message } = form;
    if (!name.trim() || !email.trim() || !phone.trim() || !message.trim()) {
      setError("Please fill in all fields including phone number.");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/quotes`, { name, email, phone, message });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const infoCards = [
    {
      icon: <FiPhone size={17} />,
      title: "Call us",
      sub: "24/7 phone support",
      content: <a href="tel:+919098268872" style={{ fontSize: 13, fontWeight: 700, color: T.blue, textDecoration: "none" }}>+91-9098268872</a>,
    },
    {
      icon: <FiMail size={17} />,
      title: "Email",
      sub: "We reply within a few hours",
      content: <a href="mailto:admin@ddsonline.in" style={{ fontSize: 13, fontWeight: 700, color: T.blue, textDecoration: "none" }}>admin@ddsonline.in</a>,
    },
    {
      icon: <FiHelpCircle size={17} />,
      title: "Help Center",
      sub: "Find answers to common questions",
      content: <a href="/help" style={{ fontSize: 13, fontWeight: 700, color: T.blue, textDecoration: "none" }}>Visit help center →</a>,
    },
  ];

  return (
    <div className="contact-root">
      <style>{CSS}</style>
      <div className="contact-inner">

        {/* Info cards */}
        <div className="info-grid">
          {infoCards.map(({ icon, title, sub, content }) => (
            <div className="info-card" key={title}>
              <div className="info-icon">{icon}</div>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3 }}>{title}</p>
              <p style={{ fontSize: 11, color: T.muted, marginBottom: 8 }}>{sub}</p>
              {content}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="form-card">
          <h2 style={{ fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 4 }}>Send a Message</h2>
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 24 }}>
            Fill in the form and we'll get back to you shortly.
          </p>

          {/* Success state */}
          {success ? (
            <div style={{
              background: T.greenPale, border: "1px solid #bbf7d0",
              borderRadius: 12, padding: "24px 20px", textAlign: "center",
            }}>
              <div style={{ width: 48, height: 48, background: "#fff", border: "1px solid #bbf7d0", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                <FiCheck size={22} color={T.green} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: T.green, marginBottom: 4 }}>Message Sent!</p>
              <p style={{ fontSize: 13, color: "#15803d", marginBottom: 18 }}>
                We've received your message and will get back to you soon.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="submit-btn"
                style={{ margin: "0 auto" }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* Error banner */}
              {error && (
                <div style={{
                  background: T.redPale, border: "1px solid #fecaca",
                  borderRadius: 8, padding: "10px 14px",
                  fontSize: 13, color: T.red, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span>⚠</span> {error}
                </div>
              )}

              {/* Name + Email */}
              <div className="form-row">
                <div>
                  <label className="form-label">Full name *</label>
                  <input
                    type="text" placeholder="Your name"
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Email address *</label>
                  <input
                    type="email" placeholder="your@email.com"
                    className="form-input"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="form-label">Phone number *</label>
                <input
                  type="tel" placeholder="+91 XXXXX XXXXX"
                  className="form-input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label className="form-label">Your message *</label>
                <textarea
                  placeholder="Tell us how we can help..."
                  className="form-input"
                  style={{ minHeight: 120, resize: "vertical" }}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                />
              </div>

              <div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading
                    ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} /> Sending…</>
                    : <><FiSend size={14} /> Send Message</>
                  }
                </button>
              </div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}