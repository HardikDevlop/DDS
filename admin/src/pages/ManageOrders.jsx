import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { PageLayout, PageSkeletonHeader, PageSkeletonTable } from "../Components/PageLayout";
import {
  FiShoppingCart, FiRefreshCw, FiSearch, FiUserPlus, FiCheckCircle,
  FiX, FiPhone, FiMail, FiUser, FiFileText, FiKey, FiAlertCircle,
  FiAlertTriangle, FiClock, FiLoader, FiList,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ─── Web Audio: play a pleasant 3-note chime ─────────────────────────────────
function playNewOrderTune() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + i * 0.18 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.5);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.55);
    });
  } catch (_) {
    // silently ignore if audio blocked
  }
}

// ─── Stats card ───────────────────────────────────────────────────────────────
function StatCard({ label, count, color, icon: Icon, pulse }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${color.bg} ${color.border} shadow-sm relative overflow-hidden`}
    >
      {pulse && (
        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
        </span>
      )}
      <div className={`p-2 rounded-xl ${color.iconBg}`}>
        <Icon size={16} className={color.iconText} />
      </div>
      <div>
        <p className={`text-2xl font-bold leading-none ${color.text}`}>{count}</p>
        <p className={`text-xs mt-0.5 ${color.label}`}>{label}</p>
      </div>
    </div>
  );
}

// ─── Assign Provider Modal ────────────────────────────────────────────────────
function AssignProviderModal({ order, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: order.assignedProviderDetails?.name || "",
    mobile: order.assignedProviderDetails?.mobile || "",
    email: order.assignedProviderDetails?.email || "",
    note: order.assignedProviderDetails?.note || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim() || !form.mobile.trim()) {
      setError("Provider name and mobile number are required.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${BASE_URL}/api/orders/${order._id}/assign-provider`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess("Provider assigned! Order is now In Processing.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to assign provider.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      title={order.assignedProviderDetails ? "Reassign Provider" : "Assign Service Provider"}
      subtitle={`Order #${order._id?.slice(-8)} · ${order.user?.name || "Guest"}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner msg={error} />}
        <Field icon={FiUser} label="Provider Name *">
          <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Ramesh Kumar" className={inputCls} required />
        </Field>
        <Field icon={FiPhone} label="Mobile Number *">
          <input name="mobile" value={form.mobile} onChange={handleChange} placeholder="e.g. 9876543210" className={inputCls} required />
        </Field>
        <Field icon={FiMail} label="Email (optional — used for cancellation alerts)">
          <input name="email" value={form.email} onChange={handleChange} placeholder="e.g. provider@email.com" className={inputCls} type="email" />
        </Field>
        <Field icon={FiFileText} label="Note (optional)">
          <textarea name="note" value={form.note} onChange={handleChange} placeholder="Any note for this assignment..." className={`${inputCls} resize-none`} rows={2} />
        </Field>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className={cancelBtnCls}>Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 disabled:opacity-60 transition-colors shadow-sm">
            {loading ? "Assigning…" : order.assignedProviderDetails ? "Reassign Provider" : "Assign Provider"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Complete By Code Modal ───────────────────────────────────────────────────
function CompleteByCodeModal({ order, onClose, onSuccess }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) { setError("Please enter the happy code."); return; }
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      await axios.post(
        `${BASE_URL}/api/orders/${order._id}/complete-by-code`,
        { code: code.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess("Order marked as Completed! 🎉");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      title="Complete Order"
      subtitle={`Order #${order._id?.slice(-8)} · Provider: ${order.assignedProviderDetails?.name || "—"}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-500">
          Ask the service provider for the <strong className="text-slate-700">Happy Code</strong> they
          collected from the customer. Enter it below to mark this order as completed.
        </p>
        {error && <ErrorBanner msg={error} />}
        <Field icon={FiKey} label="Happy Code *">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="e.g. 4821"
            className={`${inputCls} tracking-[0.3em] text-xl font-bold text-center`}
            maxLength={4}
            required
          />
        </Field>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className={cancelBtnCls}>Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors shadow-sm">
            {loading ? "Verifying…" : "Complete Order"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Shared primitives ────────────────────────────────────────────────────────
const inputCls = "w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all";
const cancelBtnCls = "flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors";

function ErrorBanner({ msg }) {
  return (
    <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
      <FiAlertCircle size={16} className="shrink-0" /> {msg}
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
        <Icon size={13} /> {label}
      </label>
      {children}
    </div>
  );
}

function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up">
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-800">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-mono">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors mt-0.5"><FiX size={20} /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Completed: "bg-emerald-100 text-emerald-800",
    Cancelled: "bg-red-100 text-red-800",
    processing: "bg-blue-100 text-blue-800",
    Confirmed: "bg-amber-100 text-amber-800",
    Pending: "bg-amber-100 text-amber-800",
    Declined: "bg-red-100 text-red-800",
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status === "processing" ? "In Processing" : status}
    </span>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-2xl text-sm font-medium max-w-xs animate-slide-up">
      <FiCheckCircle size={18} className="text-emerald-400 shrink-0" />
      {message}
    </div>
  );
}

// ─── New Order Banner ─────────────────────────────────────────────────────────
function NewOrderBanner({ count, onDismiss }) {
  return (
    <div className="fixed top-4 right-4 z-[60] flex items-center gap-3 px-4 py-3 bg-amber-500 text-white rounded-2xl shadow-2xl text-sm font-semibold max-w-xs animate-slide-up">
      <span className="text-xl">🔔</span>
      {count} new order{count > 1 ? "s" : ""} received!
      <button onClick={onDismiss} className="ml-1 text-white/80 hover:text-white"><FiX size={16} /></button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [assignModal, setAssignModal] = useState(null);
  const [completeModal, setCompleteModal] = useState(null);
  const [toast, setToast] = useState("");
  const [newOrderBanner, setNewOrderBanner] = useState(0); // count of new orders since last check

  // Track previous order count for new-order detection
  const prevOrderCountRef = useRef(null);
  const isFirstLoad = useRef(true);

  // ── fetch ──────────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async ({ silent = false } = {}) => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setError("Admin token missing. Please log in again.");
      setIsLoading(false);
      return;
    }
    try {
      if (!silent) setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/api/orders/AllOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sort newest first (defensive, in case server order varies)
      const fetched = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // ── new order detection ────────────────────────────────────────────────
      if (!isFirstLoad.current && prevOrderCountRef.current !== null) {
        const diff = fetched.length - prevOrderCountRef.current;
        if (diff > 0) {
          playNewOrderTune();
          setNewOrderBanner(diff);
        }
      }
      prevOrderCountRef.current = fetched.length;
      isFirstLoad.current = false;

      setOrders(fetched);
    } catch (err) {
      if (!silent) {
        if (err.response?.status === 401) setError("Unauthorized. Please log in as an admin.");
        else setError("Something went wrong while fetching orders.");
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    // Poll every 30 seconds silently
    const interval = setInterval(() => fetchOrders({ silent: true }), 30_000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleModalSuccess = (msg) => {
    setAssignModal(null);
    setCompleteModal(null);
    setToast(msg);
    fetchOrders({ silent: true });
  };

  // ── computed stats ─────────────────────────────────────────────────────────
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "Pending" || o.status === "Confirmed").length,
    processing: orders.filter((o) => o.status === "processing").length,
    completed: orders.filter((o) => o.status === "Completed").length,
    cancelled: orders.filter((o) => o.status === "Cancelled").length,
  };

  // ── search filter (by customer name or order id) ───────────────────────────
  const filtered = orders.filter((o) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (o.user?.name || "Guest").toLowerCase().includes(q) ||
      o._id?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Modals */}
      {assignModal && (
        <AssignProviderModal order={assignModal} onClose={() => setAssignModal(null)} onSuccess={handleModalSuccess} />
      )}
      {completeModal && (
        <CompleteByCodeModal order={completeModal} onClose={() => setCompleteModal(null)} onSuccess={handleModalSuccess} />
      )}
      {toast && <Toast message={toast} onDone={() => setToast("")} />}
      {newOrderBanner > 0 && (
        <NewOrderBanner count={newOrderBanner} onDismiss={() => setNewOrderBanner(0)} />
      )}

      <PageLayout
        icon={FiShoppingCart}
        title="Manage Orders"
        subtitle="View, assign providers, and complete customer orders"
        maxWidth="max-w-6xl"
        action={
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or order ID…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
              />
            </div>
            <button
              onClick={() => fetchOrders()}
              disabled={isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-sm font-medium hover:bg-teal-700 disabled:opacity-60 transition-colors shadow-dashboard-card"
            >
              <FiRefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>
        }
      >
        {/* ── Stats bar ─────────────────────────────────────────────────────── */}
        {!isLoading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            <StatCard
              label="Total Orders"
              count={stats.total}
              icon={FiList}
              color={{ bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-800", label: "text-slate-500", iconBg: "bg-slate-200", iconText: "text-slate-600" }}
            />
            <StatCard
              label="Pending"
              count={stats.pending}
              icon={FiClock}
              pulse={stats.pending > 0}
              color={{ bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", label: "text-amber-500", iconBg: "bg-amber-100", iconText: "text-amber-600" }}
            />
            <StatCard
              label="In Processing"
              count={stats.processing}
              icon={FiLoader}
              color={{ bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", label: "text-blue-500", iconBg: "bg-blue-100", iconText: "text-blue-600" }}
            />
            <StatCard
              label="Completed"
              count={stats.completed}
              icon={FiCheckCircle}
              color={{ bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", label: "text-emerald-500", iconBg: "bg-emerald-100", iconText: "text-emerald-600" }}
            />
            <StatCard
              label="Cancelled"
              count={stats.cancelled}
              icon={FiX}
              color={{ bg: "bg-red-50", border: "border-red-200", text: "text-red-700", label: "text-red-500", iconBg: "bg-red-100", iconText: "text-red-600" }}
            />
          </div>
        )}

        {/* ── Body ──────────────────────────────────────────────────────────── */}
        {isLoading ? (
          <>
            <PageSkeletonHeader />
            <PageSkeletonTable rows={4} />
          </>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-4 rounded-2xl text-sm">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card p-8 sm:p-12 text-center">
            <FiShoppingCart className="mx-auto text-slate-300" size={48} />
            <h3 className="mt-4 text-lg font-semibold text-slate-800">No orders found</h3>
            <p className="mt-1 text-sm text-slate-500">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {filtered.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onAssign={() => setAssignModal(order)}
                onComplete={() => setCompleteModal(order)}
              />
            ))}
          </div>
        )}
      </PageLayout>
    </>
  );
}

// ─── Order Card ───────────────────────────────────────────────────────────────
function OrderCard({ order, onAssign, onComplete }) {
  const isCancelled = order.status === "Cancelled";
  const hasProvider = !!order.assignedProviderDetails;

  return (
    <div className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden transition-shadow hover:shadow-dashboard-card-hover">

      {/* ── Cancelled alert banner ──────────────────────────────────────────── */}
      {isCancelled && hasProvider && (
        <div className="flex items-start gap-3 px-4 sm:px-6 py-3 bg-red-50 border-b border-red-200">
          <FiAlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
          <div className="text-sm text-red-700">
            <p className="font-semibold">Order cancelled by customer — Please inform the provider!</p>
            <p className="text-xs mt-0.5 text-red-500">
              Provider: <span className="font-medium">{order.assignedProviderDetails.name}</span>
              {" · "}{order.assignedProviderDetails.mobile}
              {order.assignedProviderDetails.email && (
                <>{" · "}<span className="italic">{order.assignedProviderDetails.email}</span>
                  {" "}
                  <span className="text-red-400">(cancellation email auto-sent if configured)</span>
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400">#{order._id?.slice(-8)}</span>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{order.user?.name || "Guest"}</span>
          <span>·</span>
          <span>
            {new Date(order.createdAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div className="p-4 sm:p-6 space-y-4">

        <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4">
          {/* Address */}
          <div className="text-xs sm:text-sm text-slate-700 space-y-1">
            <p><strong className="text-slate-600">House No:</strong> {order.address?.houseNumber}</p>
            <p><strong className="text-slate-600">Street/Colony:</strong> {order.address?.street}</p>
            {order.address?.landmark && (
              <p><strong className="text-slate-600">Landmark:</strong> {order.address.landmark}</p>
            )}
            <p><strong className="text-slate-600">Address Type:</strong> {order.address?.addressType}</p>
            <p className="break-words"><strong className="text-slate-600">Full Address:</strong> {order.address?.fullAddress}</p>
            <p><strong className="text-slate-600">Time Slot:</strong> {order.address?.timeSlot}</p>
          </div>

          {/* Assigned Provider Card */}
          {hasProvider && (
            <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm space-y-1">
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1.5">
                Assigned Service Provider
              </p>
              <p className="text-slate-800"><span className="text-blue-600 font-medium">Name:</span> {order.assignedProviderDetails.name}</p>
              <p className="text-slate-800"><span className="text-blue-600 font-medium">Mobile:</span> {order.assignedProviderDetails.mobile}</p>
              {order.assignedProviderDetails.email && (
                <p className="text-slate-800"><span className="text-blue-600 font-medium">Email:</span> {order.assignedProviderDetails.email}</p>
              )}
              {order.assignedProviderDetails.note && (
                <p className="text-slate-800"><span className="text-blue-600 font-medium">Note:</span> {order.assignedProviderDetails.note}</p>
              )}
              <p className="text-xs text-slate-400 pt-1">
                Assigned {new Date(order.assignedProviderDetails.assignedAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {order.items?.map((item, idx) => (
            <div key={idx} className="flex gap-3 items-center border border-slate-100 rounded-xl p-2.5 bg-slate-50/50">
              <img
                src={`${BASE_URL}/uploads/${item.imageUrl}`}
                alt={item.title}
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg shrink-0"
                onError={(e) => { e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iMjQiIHk9IjI0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPj88L3RleHQ+PC9zdmc+"; }}
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-600">
                  ₹{parseFloat(item.price).toFixed(2)} × {item.quantity || 1} = ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer: total + action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <span className="text-sm font-bold text-slate-800">Total: ₹{parseFloat(order.totalAmount).toFixed(2)}</span>

          <div className="flex gap-2 flex-wrap">
            {!isCancelled && order.status !== "Completed" && (
              <button
                onClick={onAssign}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors shadow-sm"
              >
                <FiUserPlus size={13} />
                {hasProvider ? "Reassign" : "Assign Provider"}
              </button>
            )}
            {order.status === "processing" && hasProvider && (
              <button
                onClick={onComplete}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
              >
                <FiCheckCircle size={13} />
                Complete by Code
              </button>
            )}
          </div>
        </div>
      
      </div>
    </div>
  );
}