import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { PageLayout, PageSkeletonHeader, PageSkeletonTable } from "../Components/PageLayout";
import {
    FiFileText, FiRefreshCw, FiSearch, FiX, FiCheck,
    FiTrash2, FiAlertCircle, FiChevronDown, FiMail,
    FiPhone, FiUser, FiMessageSquare, FiEdit3,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STATUS_OPTIONS = ["New", "In Review", "Quoted", "Closed"];

const STATUS_STYLE = {
    "New": { bg: "#fef9c3", text: "#854d0e", border: "#fde68a" },
    "In Review": { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" },
    "Quoted": { bg: "#dcfce7", text: "#15803d", border: "#bbf7d0" },
    "Closed": { bg: "#f1f5f9", text: "#64748b", border: "#e2e8f0" },
};

// ─── Stats card ───────────────────────────────────────────────────────────────
function StatCard({ label, count, color }) {
    return (
        <div style={{
            background: color.bg, border: `1px solid ${color.border}`,
            borderRadius: 14, padding: "14px 16px",
            display: "flex", flexDirection: "column", gap: 4,
        }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: color.text, lineHeight: 1 }}>{count}</p>
            <p style={{ fontSize: 12, color: color.text, opacity: 0.75, fontWeight: 500 }}>{label}</p>
        </div>
    );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
    const s = STATUS_STYLE[status] || STATUS_STYLE["Closed"];
    return (
        <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 700,
            padding: "3px 10px", borderRadius: 999,
            background: s.bg, color: s.text, border: `1px solid ${s.border}`,
        }}>{status}</span>
    );
}

// ─── Edit Modal ────────────────────────────────────────────────────────────────
function EditModal({ quote, onClose, onSaved }) {
    const [status, setStatus] = useState(quote.status);
    const [adminNote, setAdminNote] = useState(quote.adminNote || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        setError("");
        try {
            setLoading(true);
            const token = localStorage.getItem("adminToken");
            await axios.patch(
                `${BASE_URL}/api/quotes/${quote._id}`,
                { status, adminNote },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSaved("Quote updated successfully.");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update quote.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 60, padding: 16, backdropFilter: "blur(2px)",
        }}>
            <div style={{
                background: "#fff", borderRadius: 22, padding: "28px 26px",
                width: "100%", maxWidth: 480,
                boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
                animation: "modalIn 0.2s ease both",
            }}>
                <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}`}</style>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FiEdit3 size={16} color="#2563eb" />
                        </div>
                        <div>
                            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>Process Quote</h2>
                            <p style={{ fontSize: 12, color: "#64748b" }}>From: {quote.name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, background: "#f8faff", border: "1px solid #e2e8f5", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#64748b" }}>
                        <FiX size={16} />
                    </button>
                </div>

                {/* Customer summary */}
                <div style={{ background: "#f8faff", border: "1px solid #e2e8f5", borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155" }}>
                            <FiUser size={13} color="#2563eb" />{quote.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155" }}>
                            <FiMail size={13} color="#2563eb" />{quote.email}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155" }}>
                            <FiPhone size={13} color="#2563eb" />{quote.phone}
                        </div>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "#334155", paddingTop: 6, borderTop: "1px solid #e2e8f5", marginTop: 2 }}>
                            <FiMessageSquare size={13} color="#64748b" style={{ marginTop: 2, flexShrink: 0 }} />
                            <span style={{ lineHeight: 1.6 }}>{quote.message}</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#b91c1c", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "8px 12px", marginBottom: 14 }}>
                        <FiAlertCircle size={14} />{error}
                    </div>
                )}

                {/* Status selector */}
                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>Update Status</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8 }}>
                        {STATUS_OPTIONS.map(s => {
                            const st = STATUS_STYLE[s];
                            const active = status === s;
                            return (
                                <button key={s} onClick={() => setStatus(s)} style={{
                                    padding: "9px 12px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
                                    fontSize: 13, fontWeight: 600,
                                    background: active ? st.bg : "#f8faff",
                                    border: `1.5px solid ${active ? st.border : "#e2e8f5"}`,
                                    color: active ? st.text : "#64748b",
                                    transition: "all 0.15s",
                                    boxShadow: active ? `0 0 0 2px ${st.border}` : "none",
                                }}>{s}</button>
                            );
                        })}
                    </div>
                </div>

                {/* Admin note */}
                <div style={{ marginBottom: 22 }}>
                    <label style={{ fontSize: 12, fontWeight: 700, color: "#475569", display: "block", marginBottom: 6 }}>Admin Note (internal)</label>
                    <textarea
                        rows={3} value={adminNote} onChange={e => setAdminNote(e.target.value)}
                        placeholder="Add an internal note about this quote…"
                        style={{
                            width: "100%", border: "1px solid #e2e8f5", borderRadius: 10,
                            padding: "10px 13px", fontSize: 13, fontFamily: "inherit",
                            color: "#0f172a", background: "#f8faff", outline: "none",
                            resize: "none", boxSizing: "border-box",
                            transition: "border-color 0.2s",
                        }}
                        onFocus={e => { e.target.style.borderColor = "#2563eb"; }}
                        onBlur={e => { e.target.style.borderColor = "#e2e8f5"; }}
                    />
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 10 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: 11, background: "#f8faff", border: "1px solid #e2e8f5", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                        <FiX size={14} /> Cancel
                    </button>
                    <button onClick={handleSave} disabled={loading} style={{ flex: 1, padding: 11, background: "linear-gradient(135deg,#2563eb,#1e3a8a)", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: loading ? 0.7 : 1, boxShadow: "0 4px 14px rgba(37,99,235,0.28)" }}>
                        {loading ? "Saving…" : <><FiCheck size={14} /> Save Changes</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
    useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
    return (
        <div style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 70,
            display: "flex", alignItems: "center", gap: 10,
            background: "#0f172a", color: "#fff", borderRadius: 14,
            padding: "12px 18px", fontSize: 13, fontWeight: 500,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        }}>
            <FiCheck size={16} color="#4ade80" />{message}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ManageQuotes() {
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [editQuote, setEditQuote] = useState(null);
    const [toast, setToast] = useState("");
    const [deleting, setDeleting] = useState(null);

    const fetchQuotes = useCallback(async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) { setError("Admin token missing."); setIsLoading(false); return; }
        try {
            setIsLoading(true);
            const res = await axios.get(`${BASE_URL}/api/quotes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuotes(res.data);
        } catch (err) {
            setError(err.response?.status === 401 ? "Unauthorized. Please log in as admin." : "Failed to fetch quotes.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchQuotes(); }, [fetchQuotes]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this quote? This cannot be undone.")) return;
        try {
            setDeleting(id);
            const token = localStorage.getItem("adminToken");
            await axios.delete(`${BASE_URL}/api/quotes/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setToast("Quote deleted.");
            fetchQuotes();
        } catch {
            setToast("Failed to delete quote.");
        } finally {
            setDeleting(null);
        }
    };

    const handleModalSave = (msg) => {
        setEditQuote(null);
        setToast(msg);
        fetchQuotes();
    };

    // Stats
    const stats = {
        total: quotes.length,
        new_: quotes.filter(q => q.status === "New").length,
        inReview: quotes.filter(q => q.status === "In Review").length,
        quoted: quotes.filter(q => q.status === "Quoted").length,
        closed: quotes.filter(q => q.status === "Closed").length,
    };

    // Filtered
    const filtered = quotes.filter(q => {
        const q2 = searchTerm.toLowerCase();
        const matchSearch = !searchTerm ||
            q.name?.toLowerCase().includes(q2) ||
            q.email?.toLowerCase().includes(q2) ||
            q.phone?.includes(q2);
        const matchStatus = filterStatus === "All" || q.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <>
            {editQuote && <EditModal quote={editQuote} onClose={() => setEditQuote(null)} onSaved={handleModalSave} />}
            {toast && <Toast message={toast} onDone={() => setToast("")} />}

            <PageLayout
                icon={FiFileText}
                title="Quote Requests"
                subtitle="Manage free estimate requests from the website"
                maxWidth="max-w-5xl"
                action={
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <div style={{ position: "relative" }}>
                            <FiSearch style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={15} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search name, email, phone…"
                                style={{ paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, fontSize: 13, border: "1px solid #e2e8f5", borderRadius: 10, outline: "none", width: 220, fontFamily: "inherit" }}
                            />
                        </div>
                        {/* Status filter */}
                        <div style={{ position: "relative" }}>
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value)}
                                style={{ appearance: "none", padding: "8px 32px 8px 12px", fontSize: 13, border: "1px solid #e2e8f5", borderRadius: 10, background: "#fff", fontFamily: "inherit", cursor: "pointer", outline: "none" }}
                            >
                                <option value="All">All Statuses</option>
                                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                            <FiChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b" }} />
                        </div>
                        <button
                            onClick={fetchQuotes} disabled={isLoading}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "#2563eb", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", opacity: isLoading ? 0.7 : 1 }}
                        >
                            <FiRefreshCw size={14} style={{ animation: isLoading ? "spin 0.8s linear infinite" : "none" }} />
                            Refresh
                        </button>
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                    </div>
                }
            >
                {/* ── Stats ── */}
                {!isLoading && !error && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
                        <StatCard label="Total" count={stats.total} color={{ bg: "#f8faff", border: "#e2e8f5", text: "#334155" }} />
                        <StatCard label="New" count={stats.new_} color={{ bg: "#fef9c3", border: "#fde68a", text: "#854d0e" }} />
                        <StatCard label="In Review" count={stats.inReview} color={{ bg: "#dbeafe", border: "#bfdbfe", text: "#1e40af" }} />
                        <StatCard label="Quoted" count={stats.quoted} color={{ bg: "#dcfce7", border: "#bbf7d0", text: "#15803d" }} />
                        <StatCard label="Closed" count={stats.closed} color={{ bg: "#f1f5f9", border: "#e2e8f0", text: "#64748b" }} />
                    </div>
                )}

                {/* ── Body ── */}
                {isLoading ? (
                    <>
                        <PageSkeletonHeader />
                        <PageSkeletonTable rows={4} />
                    </>
                ) : error ? (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", borderRadius: 14, padding: "14px 18px", fontSize: 13 }}>
                        {error}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ background: "#fff", border: "1px solid #e2e8f5", borderRadius: 18, padding: "48px 24px", textAlign: "center" }}>
                        <FiFileText size={40} color="#cbd5e1" style={{ margin: "0 auto 14px", display: "block" }} />
                        <p style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>No quote requests found</p>
                        <p style={{ fontSize: 13, color: "#64748b" }}>Requests from the website will appear here.</p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {filtered.map(q => (
                            <div key={q._id} style={{
                                background: "#fff", border: "1px solid #e2e8f5",
                                borderRadius: 16, overflow: "hidden",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
                                transition: "box-shadow 0.2s",
                            }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(37,99,235,0.08)"; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,0,0,0.04)"; }}
                            >
                                {/* Card header */}
                                <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", background: "#fafbff", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        {/* Avatar */}
                                        <div style={{ width: 38, height: 38, borderRadius: 10, background: "#eff4ff", border: "1px solid #dbeafe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontWeight: 800, fontSize: 14, color: "#2563eb" }}>
                                            {q.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 1 }}>{q.name}</p>
                                            <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#64748b", flexWrap: "wrap" }}>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FiMail size={11} />{q.email}</span>
                                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><FiPhone size={11} />{q.phone}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <StatusBadge status={q.status} />
                                        <span style={{ fontSize: 11, color: "#94a3b8" }}>
                                            {new Date(q.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                        </span>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div style={{ padding: "14px 18px" }}>
                                    {/* Message */}
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: q.adminNote ? 10 : 0 }}>
                                        <FiMessageSquare size={13} color="#94a3b8" style={{ marginTop: 2, flexShrink: 0 }} />
                                        <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6 }}>{q.message}</p>
                                    </div>

                                    {/* Admin note */}
                                    {q.adminNote && (
                                        <div style={{ display: "flex", alignItems: "flex-start", gap: 8, background: "#fef9c3", border: "1px solid #fde68a", borderRadius: 8, padding: "8px 12px" }}>
                                            <FiEdit3 size={12} color="#92400e" style={{ marginTop: 2, flexShrink: 0 }} />
                                            <p style={{ fontSize: 12, color: "#78350f", lineHeight: 1.55, fontStyle: "italic" }}>{q.adminNote}</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div style={{ display: "flex", gap: 8, marginTop: 14, justifyContent: "flex-end" }}>
                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            disabled={deleting === q._id}
                                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                                        >
                                            <FiTrash2 size={12} />{deleting === q._id ? "Deleting…" : "Delete"}
                                        </button>
                                        <button
                                            onClick={() => setEditQuote(q)}
                                            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 2px 8px rgba(37,99,235,0.25)" }}
                                        >
                                            <FiEdit3 size={12} /> Process Quote
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </PageLayout>
        </>
    );
}