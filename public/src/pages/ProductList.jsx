import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ── Categories ── */
const CATEGORIES = [
  { key: "all", label: "All" },
  { key: "cleaning", label: "Cleaning" },
  { key: "repair", label: "Repair" },
  { key: "plumbing", label: "Plumbing" },
  { key: "electrical", label: "Electrical" },
  
];

function inferCategory(name = "") {
  const n = name.toLowerCase();
  if (n.includes("clean")) return "cleaning";
  if (n.includes("plumb") || n.includes("pipe")) return "plumbing";
  if (n.includes("electric") || n.includes("ac") || n.includes("appliance")) return "electrical";
  if (n.includes("repair")) return "repair";
  return "all";
}

/* ── Design tokens ── */
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
  red50: "#fef2f2",
  red200: "#fecaca",
  red700: "#b91c1c",
  skeleton: "#e8edf6",
};

/* ── Global CSS ── */
const CSS = `
  .pl-root * { box-sizing: border-box; margin: 0; padding: 0; }
  .pl-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg};
    min-height: 100vh;
    color: ${T.text};
  }

  /* skeleton */
  @keyframes skelPulse { 0%,100%{opacity:1} 50%{opacity:.45} }
  .skel { animation: skelPulse 1.6s ease-in-out infinite; background: ${T.skeleton}; border-radius: 12px; }

  /* card hover */
  .srv-card {
    background: ${T.bgWhite};
    border: 1px solid ${T.border};
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 12px ${T.shadowSm};
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .srv-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 32px ${T.shadow};
  }

  /* image zoom */
  .srv-img { transition: transform 0.45s ease; }
  .srv-card:hover .srv-img { transform: scale(1.05); }

  /* category pill */
  .cat-pill {
    border: 1px solid ${T.border};
    border-radius: 999px;
    padding: 5px 14px;
    font-size: 13px;
    font-weight: 500;
    background: ${T.bgWhite};
    color: ${T.textMid};
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .cat-pill:hover { border-color: ${T.blue}; color: ${T.blue}; }
  .cat-pill.active { background: ${T.blue}; color: #fff; border-color: ${T.blue}; }

  /* search input */
  .search-input {
    width: 100%;
    border: 1px solid ${T.border};
    border-radius: 10px;
    padding: 9px 40px 9px 14px;
    font-size: 14px;
    font-family: inherit;
    background: ${T.bgWhite};
    color: ${T.text};
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 4px ${T.shadowSm};
  }
  .search-input:focus { border-color: ${T.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
  .search-input::placeholder { color: #94a3b8; }

  /* view btn */
  .view-btn {
    display: inline-flex; align-items: center; gap: 4px;
    background: ${T.blue}; color: #fff;
    border: none; border-radius: 7px;
    padding: 7px 13px; font-size: 12px; font-weight: 600;
    cursor: pointer; transition: background 0.15s;
    font-family: inherit;
  }
  .view-btn:hover { background: ${T.blueDark}; }

  /* grid */
  .prod-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
  @media (max-width: 900px) { .prod-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 540px) { .prod-grid { grid-template-columns: 1fr; } }
  @media (max-width: 600px) { .cat-row { flex-wrap: wrap; } }
`;

/* ══════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════ */
export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data.map((p) => ({ ...p, _category: inferCategory(p.name) })));
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setError("Failed to load services. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = category === "all" || p._category === category;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        !term ||
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  return (
    <div className="pl-root">
      <style>{CSS}</style>

      <div style={{ margin: "0 auto", padding: "40px 20px 60px" }}>

        {/* ── Search + Filters ── */}
        <div style={{
          background: T.bgWhite,
          border: `1px solid ${T.border}`,
          borderRadius: 14,
          padding: "16px 18px",
          marginBottom: 24,
          boxShadow: `0 2px 12px ${T.shadowSm}`,
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {/* Search row */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search services..."
                className="search-input"
              />
              <svg
                width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <path d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              border: `1px solid ${T.border}`, borderRadius: 8,
              background: T.bgWhite, color: T.textMid,
              padding: "8px 14px", fontSize: 13, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: `0 1px 4px ${T.shadowSm}`,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              Filters
            </button>
          </div>

          {/* Category pills */}
          <div className="cat-row" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`cat-pill${category === c.key ? " active" : ""}`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: T.red50, border: `1px solid ${T.red200}`,
            borderRadius: 10, padding: "10px 16px",
            fontSize: 13, color: T.red700, marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        {/* ── Results count ── */}
        {!isLoading && !error && (
          <p style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>
            Showing <strong style={{ color: T.text }}>{filtered.length}</strong> service{filtered.length !== 1 ? "s" : ""}
            {category !== "all" && ` in ${CATEGORIES.find(c => c.key === category)?.label}`}
            {search && ` matching "${search}"`}
          </p>
        )}

        {/* ── Grid ── */}
        {isLoading ? (
          <div className="prod-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{ height: 260 }} className="skel" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: T.bgWhite, borderRadius: 14,
            border: `1px solid ${T.border}`,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: T.text, marginBottom: 6 }}>No services found</p>
            <p style={{ fontSize: 13, color: T.muted }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="prod-grid">
            {filtered.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* ── Service Card ── */
function ServiceCard({ service }) {
  const navigate = useNavigate();
  const image =
    Array.isArray(service.images) && service.images[0]
      ? `${BASE_URL}/uploads/${service.images[0]}`
      : "/default-service.jpg";
  const subCount = Array.isArray(service.subServices) ? service.subServices.length : 0;

  return (
    <article className="srv-card">
      {/* Image */}
      <div style={{ position: "relative", height: 140, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={image}
          alt={service.name}
          className="srv-img"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        {/* overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.28), transparent)" }} />
        {/* badge */}
        <span style={{
          position: "absolute", top: 10, left: 10,
          background: T.greenPale, color: T.green,
          fontSize: 10, fontWeight: 700, borderRadius: 999,
          padding: "3px 9px", letterSpacing: "0.04em",
        }}>
          24×7 Available
        </span>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        <div>
          <h3 style={{
            fontSize: 14, fontWeight: 700, color: T.text, lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            marginBottom: 4,
          }}>
            {service.name}
          </h3>
          <p style={{
            fontSize: 12, color: T.muted, lineHeight: 1.55,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {service.description || "Professional service for your home"}
          </p>
        </div>

        {/* Meta */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, color: T.muted,
          paddingTop: 4, borderTop: `1px solid ${T.border}`,
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {subCount > 0 ? `${subCount} services available` : "Single service"}
        </div>

        {/* Price + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 4 }}>
          <div>
            <span style={{ display: "block", fontSize: 10, color: T.muted, fontWeight: 500, marginBottom: 1 }}>Starting from</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: T.blue }}>
              ₹{service.visitingPrice ?? service.price ?? "—"}
            </span>
          </div>
          <button
            onClick={() => navigate(`/product/${service._id}`)}
            className="view-btn"
          >
            View Details
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}