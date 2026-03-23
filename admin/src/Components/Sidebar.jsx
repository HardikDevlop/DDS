import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FiBarChart2,
  FiPackage,
  FiShoppingCart,
  FiUsers,
  FiPlusCircle,
  FiLogOut,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-sidebar-active text-sidebar-accent shadow-sm"
        : "text-slate-400 hover:bg-sidebar-hover hover:text-slate-200"
    }`;

  const navItems = [
    { to: "/dashboard", icon: FiBarChart2, label: "Dashboard" },
    { to: "/products", icon: FiPackage, label: "Manage Products" },
    { to: "/orders", icon: FiShoppingCart, label: "Manage Orders" },
    { to: "/users", icon: FiUsers, label: "Manage Users" },
    { to: "/quotes", icon: FiShoppingCart, label: "Manage Quotes" },
    { to: "/add-service", icon: FiPlusCircle, label: "Add New Service" },
  ];

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-900/90 text-white shadow-lg shadow-black/40 border border-white/10 backdrop-blur"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
      </button>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-30 md:hidden animate-fade-in"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        className={`sidebar-sticky
          flex flex-col z-40
          bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
          border-r border-white/5 shadow-2xl shadow-black/50
          transition-all duration-300 ease-out
          ${isCollapsed ? "w-[76px]" : "w-64"}
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div
          className="flex h-20 shrink-0 items-center px-4 border-b border-white/5 cursor-pointer select-none group"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 via-cyan-400 to-emerald-400 flex items-center justify-center shadow-lg shadow-blue-500/40">
              <FiBarChart2 className="text-slate-950" size={22} />
            </div>
            <span
              className={`flex flex-col transition-all origin-left ${
                isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              }`}
            >
              <span className="font-semibold text-slate-50 text-sm tracking-wide group-hover:text-white">
                DDS Admin Panel
              </span>
              <span className="text-[11px] text-slate-400">
                Manage services & analytics
              </span>
            </span>
            <span className="ml-auto hidden md:flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900/60 text-slate-400 group-hover:text-slate-100 group-hover:border-slate-500/80 transition-colors w-7 h-7">
              {isCollapsed ? <FiChevronRight size={12} /> : <FiChevronLeft size={12} />}
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          {!isCollapsed && (
            <p className="px-1 text-[11px] font-semibold tracking-[0.18em] text-slate-500 uppercase">
              Navigation
            </p>
          )}

          <div className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={navLinkClass}
                onClick={() => isMobileMenuOpen && toggleMobileMenu()}
              >
                <Icon size={20} className="shrink-0" />
                {!isCollapsed && <span className="truncate">{label}</span>}
              </NavLink>
            ))}
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/90 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}
            >
              <FiLogOut size={20} className="shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>

        <div
          className={`shrink-0 px-4 py-3 border-t border-white/5 transition-all duration-200 ${
            isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
          }`}
        >
          <p className="text-xs text-slate-500">DDS Admin · v1.0.0</p>
        </div>
      </aside>
    </>
  );
}
