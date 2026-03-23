import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSend, FiHelpCircle, FiCheckCircle, FiClock, FiList } from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const T = {
  bg: "#f0f4ff", bgWhite: "#ffffff", bgSoft: "#f8faff",
  blue: "#2563eb", blueDark: "#1d4ed8", bluePale: "#eff4ff",
  text: "#0f172a", textMid: "#334155", muted: "#64748b",
  border: "#dde5f4", shadow: "rgba(37,99,235,0.08)", shadowSm: "rgba(0,0,0,0.05)",
  green: "#16a34a", greenPale: "#dcfce7",
  amber: "#f59e0b", amberPale: "#fefce8",
};

const CSS = `
  .help-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh; color: ${T.text};
  }
  .help-inner { max-width: 760px; margin: 0 auto; padding: 44px 20px 64px; }

  .help-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    border-radius: 16px; padding: 28px;
    box-shadow: 0 2px 14px ${T.shadowSm}; margin-bottom: 24px;
  }

  .form-label { display: block; font-size: 12px; font-weight: 700; color: ${T.textMid}; margin-bottom: 6px; }
  .form-input {
    width: 100%; border: 1px solid ${T.border}; border-radius: 9px;
    padding: 10px 13px; font-size: 14px; font-family: inherit;
    color: ${T.text}; background: ${T.bgSoft}; outline: none; box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus { border-color: ${T.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); background: ${T.bgWhite}; }
  .form-input::placeholder { color: #94a3b8; }

  .submit-btn {
    width: 100%; padding: 13px; border: none; border-radius: 10px;
    background: ${T.blue}; color: #fff;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.15s;
  }
  .submit-btn:hover:not(:disabled) { background: ${T.blueDark}; }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  .ticket-card {
    border: 1px solid ${T.border}; border-radius: 12px; padding: 16px;
    background: ${T.bgSoft}; transition: box-shadow 0.2s;
  }
  .ticket-card:hover { box-shadow: 0 4px 16px ${T.shadow}; }

  .badge-solved  { background: ${T.greenPale}; color: ${T.green};  font-size:11px; font-weight:700; border-radius:999px; padding:3px 10px; }
  .badge-pending { background: ${T.amberPale}; color: #92400e; font-size:11px; font-weight:700; border-radius:999px; padding:3px 10px; }
`;

export default function HelpCenter() {
  const [orders, setOrders] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", subject: "", message: "", issueType: "", orderId: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    axios.get(`${BASE_URL}/api/users/profile`, { headers })
      .then(res => setForm(p => ({ ...p, name: res.data.name || "", phone: res.data.phone || "" })))
      .catch(() => { });

    axios.get(`${BASE_URL}/api/orders/my-orders`, { headers })
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]));

    axios.get(`${BASE_URL}/api/tickets`, { headers })
      .then(res => setTickets(res.data))
      .catch(() => setTickets([]));
  }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${BASE_URL}/api/tickets`, { ...form, orderId: form.orderId || null }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess("Query submitted successfully!");
      setForm(p => ({ ...p, subject: "", message: "", issueType: "", orderId: "" }));
      const res = await axios.get(`${BASE_URL}/api/tickets`, { headers: { Authorization: `Bearer ${token}` } });
      setTickets(res.data);
    } catch { setError("Failed to submit query. Please try again."); }
    setLoading(false);
  };

  return (
    <div className="help-root">
      <style>{CSS}</style>
      <div className="help-inner">

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: T.bluePale, border: `1px solid #bcd0fa`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <FiHelpCircle size={22} color={T.blue} />
          </div>
          <h1 style={{ fontSize: "clamp(1.5rem,3.5vw,2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: T.text, marginBottom: 6 }}>Help Center</h1>
          <p style={{ fontSize: 14, color: T.muted }}>Submit a query and we'll get back to you shortly.</p>
        </header>

        {/* ── Submit Form ── */}
        <div className="help-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, background: T.bluePale, border: `1px solid #bcd0fa`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiSend size={15} color={T.blue} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.blue }}>Support</p>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Submit a Query</h2>
            </div>
          </div>

          {success && (
            <div style={{ background: T.greenPale, border: "1px solid #bbf7d0", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: T.green, marginBottom: 18, display: "flex", alignItems: "center", gap: 8 }}>
              <FiCheckCircle size={14} /> {success}
            </div>
          )}
          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 18 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="form-label">Name</label>
                <input name="name" value={form.name} onChange={handleChange} className="form-input" required placeholder="Your name" />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange} className="form-input" required placeholder="+91 XXXXX XXXXX" type="tel" />
              </div>
            </div>

            <div>
              <label className="form-label">Order <span style={{ fontWeight: 400, color: T.muted }}>(optional)</span></label>
              <select name="orderId" value={form.orderId} onChange={handleChange} className="form-input">
                <option value="">Select an order (if related)</option>
                {orders.map(o => (
                  <option key={o._id} value={o._id}>
                    {o._id} — {o.status} — {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ""}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="form-label">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="form-input" required placeholder="Brief subject" />
              </div>
              <div>
                <label className="form-label">Issue Type</label>
                <select name="issueType" value={form.issueType} onChange={handleChange} className="form-input" required>
                  <option value="">Select issue type</option>
                  <option value="Booking">Booking Issue</option>
                  <option value="Payment">Payment Issue</option>
                  <option value="Service">Service Quality</option>
                  <option value="Technical">Technical Problem</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} className="form-input" rows={4} required placeholder="Describe your issue in detail…" style={{ resize: "vertical" }} />
            </div>

            <button type="submit" className="submit-btn" disabled={loading} style={{ marginTop: 4 }}>
              <FiSend size={14} /> {loading ? "Submitting…" : "Submit Query"}
            </button>
          </form>
        </div>

        {/* ── Previous Tickets ── */}
        <div className="help-card">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, background: T.bluePale, border: `1px solid #bcd0fa`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FiList size={15} color={T.blue} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.blue }}>History</p>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: T.text }}>Your Previous Queries</h2>
            </div>
          </div>

          {tickets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "28px 0", color: T.muted, fontSize: 14 }}>
              No queries submitted yet.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {tickets.map(ticket => (
                <div className="ticket-card" key={ticket._id}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8, gap: 10 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 2 }}>{ticket.subject}</p>
                      {ticket.orderId && (
                        <p style={{ fontSize: 11, color: T.muted }}>Order: {ticket.orderId._id || ticket.orderId}</p>
                      )}
                    </div>
                    <span className={ticket.status === "solved" ? "badge-solved" : "badge-pending"}>
                      {ticket.status === "solved" ? "Solved" : "Pending"}
                    </span>
                  </div>

                  <p style={{ fontSize: 13, color: T.textMid, lineHeight: 1.6, marginBottom: ticket.solution ? 10 : 6 }}>{ticket.message}</p>

                  {ticket.solution && (
                    <div style={{ background: T.bluePale, border: "1px solid #bcd0fa", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: T.textMid, marginBottom: 6 }}>
                      <span style={{ fontWeight: 700, color: T.blue }}>Solution: </span>{ticket.solution}
                    </div>
                  )}

                  <p style={{ fontSize: 11, color: T.muted }}>
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : ""}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}