import { useEffect, useState } from "react";
import axios from "axios";
import StatsChart from "../Components/StatsChart";
import OrdersDoughnutChart from "../Components/OrdersDoughnutChart";
import {
  FiTool,
  FiUsers,
  FiPackage,
  FiCalendar,
  FiTrendingUp,
  FiRefreshCw,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ORDER_STATUSES = ["Pending", "Cancelled", "Completed"];

// Use API orderStatusCounts; fallback for old API (orderPlaced/orderCancelled or total only)
function getOrderStatusCounts(stats) {
  if (stats.orderStatusCounts && typeof stats.orderStatusCounts === "object") {
    const counts = { ...stats.orderStatusCounts };
    ORDER_STATUSES.forEach((s) => {
      if (counts[s] == null) counts[s] = 0;
    });
    return counts;
  }
  const total = stats.orders ?? 0;
  const placed = stats.orderPlaced ?? (total > 0 ? total : 0);
  const cancelled = stats.orderCancelled ?? 0;
  return {
    Pending: placed,
    Cancelled: cancelled,
    Completed: 0,
  };
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    orderStatusCounts: {},
  });
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState("annual");
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/dashboard/stats`);
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen dashboard-bg-pattern">
      <main className="lg:ml-64 pt-16 md:pt-8 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8 animate-slide-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
                <span className="flex w-10 h-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
                  <FiTrendingUp size={22} />
                </span>
                Admin Dashboard
              </h1>
              <p className="text-dashboard-muted mt-1 text-sm sm:text-base">
                Overview of your platform statistics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-slate-500 bg-white/80 backdrop-blur px-3 py-2 rounded-xl border border-slate-200/80">
                Updated {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
              <button
                onClick={fetchStats}
                className="p-2.5 rounded-xl bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-dashboard-card"
                aria-label="Refresh data"
              >
                <FiRefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </header>

          {/* Stats grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            <StatCard
              label="Services"
              value={stats.products}
              accent="indigo"
              icon={<FiTool size={22} />}
              loading={loading}
              delay={0}
            />
            <StatCard
              label="Users"
              value={stats.users}
              accent="emerald"
              icon={<FiUsers size={22} />}
              loading={loading}
              delay={1}
            />
            <StatCard
              label="Orders"
              value={stats.orders}
              accent="amber"
              icon={<FiPackage size={22} />}
              loading={loading}
              delay={2}
            />
          </section>

          {/* Charts: side by side (ek ke bagal mein dusra) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Platform Overview bar chart */}
            <section className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Platform Overview
                  </h2>
                  <div className="flex rounded-xl bg-slate-100/80 p-1 gap-0.5">
                    <button
                      onClick={() => setActiveChart("monthly")}
                      className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        activeChart === "monthly"
                          ? "bg-white text-teal-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <FiCalendar size={14} />
                      Monthly
                    </button>
                    <button
                      onClick={() => setActiveChart("annual")}
                      className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                        activeChart === "annual"
                          ? "bg-white text-teal-700 shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      <FiCalendar size={14} />
                      Annual
                    </button>
                  </div>
                </div>
                <div className="h-64 sm:h-72 min-h-[240px]">
                  <StatsChart data={stats} loading={loading} period={activeChart} />
                </div>
              </div>
            </section>

            {/* Order status circular chart */}
            <section className="bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card overflow-hidden animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                  Order Status
                </h2>
                <div className="h-64 sm:h-72 max-w-sm mx-auto lg:mx-0">
                  <OrdersDoughnutChart
                    orderStatusCounts={getOrderStatusCounts(stats)}
                    loading={loading}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, accent, icon, loading, delay }) {
  const styles = {
    indigo: {
      bar: "bg-indigo-500",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600",
      label: "text-indigo-700",
    },
    emerald: {
      bar: "bg-emerald-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600",
      label: "text-emerald-700",
    },
    amber: {
      bar: "bg-amber-500",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      label: "text-amber-700",
    },
  };

  const s = styles[accent] || styles.indigo;
  const progressWidth = Math.min(100, (value || 0) / 10);

  return (
    <div
      className="group bg-dashboard-card rounded-2xl border border-slate-200/80 shadow-dashboard-card hover:shadow-dashboard-card-hover transition-all duration-300 overflow-hidden animate-slide-up"
      style={{ animationDelay: `${delay * 80}ms` }}
    >
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start gap-3">
          <div className="min-w-0">
            <p className={`text-xs font-semibold uppercase tracking-wider ${s.label} opacity-90`}>
              {label}
            </p>
            {loading ? (
              <div className="h-8 w-24 bg-slate-200 rounded-lg mt-2 animate-pulse" />
            ) : (
              <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1 tabular-nums">
                {(value ?? 0).toLocaleString()}
              </p>
            )}
          </div>
          <span
            className={`flex shrink-0 w-11 h-11 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}
          >
            {icon}
          </span>
        </div>
        <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${s.bar} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${progressWidth}%` }}
          />
        </div>
      </div>
      {/* Left accent stripe */}
      <div className={`h-1 w-full ${s.bar} opacity-80`} />
    </div>
  );
}
