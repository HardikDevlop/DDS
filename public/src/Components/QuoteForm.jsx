import { useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const T = {
    blueDeep: "#1e3a8a",
    blueDark: "#1d4ed8",
    amber: "#f59e0b",
    amberDark: "#d97706",
};

const btn = {
    amber: {
        display: "inline-flex", alignItems: "center", gap: 6,
        background: T.amber, color: "#0f172a",
        border: "none", padding: "10px 20px", borderRadius: 8,
        fontSize: 14, fontWeight: 700, cursor: "pointer",
        transition: "background 0.2s",
    },
};

/**
 * Drop-in replacement for the static quote form in Home.jsx
 * Usage: <QuoteForm />
 */
export default function QuoteForm() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const { name, email, phone, message } = form;
        if (!name || !email || !phone || !message) {
            setError("Please fill in all fields.");
            return;
        }
        try {
            setLoading(true);
            await axios.post(`${BASE_URL}/api/quotes`, { name, email, phone, message });
            setSuccess(true);
            setForm({ name: "", email: "", phone: "", message: "" });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to submit. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: "100%",
        background: "rgba(255,255,255,0.1)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 8, padding: "10px 12px",
        fontSize: 13, color: "#fff", outline: "none",
        fontFamily: "'DM Sans',sans-serif",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
    };

    return (
        <div style={{
            background: `linear-gradient(160deg, ${T.blueDeep} 0%, ${T.blueDark} 100%)`,
            borderRadius: 16, padding: 24, color: "#fff",
            boxShadow: "0 8px 40px rgba(37,99,235,0.28)",
        }}>
            <p style={{ margin: "0 0 4px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                Free Estimate
            </p>
            <h3 style={{ fontFamily: "'DM Sans',sans-serif", margin: "0 0 18px", fontSize: "1.25rem", fontWeight: 800 }}>
                Get a Free Quote!
            </h3>

            {/* Success state */}
            {success ? (
                <div style={{
                    background: "rgba(22,163,74,0.18)", border: "1px solid rgba(74,222,128,0.35)",
                    borderRadius: 10, padding: "18px 16px", textAlign: "center",
                }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                    <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Quote Submitted!</p>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 14 }}>
                        We'll get back to you shortly.
                    </p>
                    <button
                        onClick={() => setSuccess(false)}
                        style={{ ...btn.amber, padding: "8px 20px", fontSize: 13 }}
                    >
                        Submit Another
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {/* Error banner */}
                    {error && (
                        <div style={{
                            background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.35)",
                            borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#fca5a5",
                        }}>
                            {error}
                        </div>
                    )}

                    <input
                        name="name" value={form.name} onChange={handleChange}
                        placeholder="Name" type="text" style={inputStyle} required
                        onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.55)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
                    />
                    <input
                        name="email" value={form.email} onChange={handleChange}
                        placeholder="Email" type="email" style={inputStyle} required
                        onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.55)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
                    />
                    <input
                        name="phone" value={form.phone} onChange={handleChange}
                        placeholder="Phone Number" type="tel" style={inputStyle} required
                        onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.55)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
                    />
                    <textarea
                        name="message" value={form.message} onChange={handleChange}
                        rows={4} placeholder="Message" style={{ ...inputStyle, resize: "none" }} required
                        onFocus={e => { e.target.style.borderColor = "rgba(255,255,255,0.55)"; }}
                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.18)"; }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="hv-amber"
                        style={{ ...btn.amber, justifyContent: "center", padding: "12px", borderRadius: 8, fontSize: 14, width: "100%", opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "Submitting…" : "Submit Request"}
                    </button>
                </form>
            )}
        </div>
    );
}