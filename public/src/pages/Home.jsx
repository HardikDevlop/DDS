import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiShield, FiCamera, FiLock, FiArrowRight,
  FiPhone, FiMail, FiWifi, FiMonitor, FiPhoneCall,
} from "react-icons/fi";
import {
  FaWhatsapp, FaFacebookF, FaInstagram,
  FaTwitter, FaYoutube, FaLinkedinIn,
} from "react-icons/fa";
import axios from "axios";import { ErrorToast } from "../Components/ErrorToast";import GlassCard from "../Components/GlassCard";
import QuoteForm from "../Components/QuoteForm";
import CTASection from "../Components/CTASection";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
const T = {
  bg: "#f0f4ff",
  bgWhite: "#ffffff",
  bgSoft: "#f8faff",
  blue: "#2563eb",
  blueDark: "#1d4ed8",
  blueDeep: "#1e3a8a",
  bluePale: "#eff4ff",
  cyan: "#06b6d4",
  amber: "#f59e0b",
  amberDark: "#d97706",
  green: "#16a34a",
  greenDark: "#15803d",
  text: "#0f172a",
  textMid: "#334155",
  muted: "#64748b",
  border: "#dde5f4",
  shadow: "rgba(37,99,235,0.10)",
  shadowSm: "rgba(0,0,0,0.06)",
  red50: "#fef2f2",
  red200: "#fecaca",
  red700: "#b91c1c",
  skeleton: "#e8edf6",
};

/* ─────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM Sans:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .home-root * { box-sizing: border-box; }
  .home-root { font-family: 'DM Sans', sans-serif; background: ${T.bg}; color: ${T.text}; }

  /* ── Hover helpers ── */
  .hv-lift  { transition: transform 0.22s ease, box-shadow 0.22s ease; }
  .hv-lift:hover { transform: translateY(-3px); box-shadow: 0 12px 36px ${T.shadow} !important; }
  .hv-amber:hover { background: ${T.amberDark} !important; }
  .hv-green:hover { background: ${T.greenDark} !important; }
  .hv-blue:hover  { background: ${T.blueDark}  !important; }
  .hv-outline:hover { background: rgba(255,255,255,0.18) !important; }
  .hv-dark:hover  { background: #1e293b !important; }

  /* ── Skeleton pulse ── */
  @keyframes skelPulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.45; }
  }
  .skeleton { animation: skelPulse 1.6s ease-in-out infinite; background: ${T.skeleton}; border-radius: 10px; }

  /* ── Fade-up entry ── */
  @keyframes fadeUp {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  .fade-up { animation: fadeUp 0.55s ease both; }

  /* ── Section label ── */
  .sec-label {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: ${T.blue}; margin-bottom: 4px;
  }
  .sec-title {
    font-family: 'DM Sans', sans-serif;
    font-size: clamp(1.3rem, 2.5vw, 1.75rem);
    font-weight: 800; letter-spacing: -0.02em; color: ${T.text}; margin: 0 0 4px;
  }
  .sec-sub { font-size: 0.88rem; color: ${T.muted}; margin: 0 0 22px; font-weight: 400; }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .hero-grid   { grid-template-columns: 1fr !important; }
    .hero-img-col{ display: none !important; }
    .main-grid   { grid-template-columns: 1fr !important; }
    .step-grid   { grid-template-columns: 1fr !important; }
    .prod-grid   { grid-template-columns: repeat(2,1fr) !important; }
  }
  @media (max-width: 540px) {
    .prod-grid { grid-template-columns: 1fr !important; }
    .hero-btns { flex-direction: column; }
  }
`;

/* ─────────────────────────────────────────
   BUTTON PRESETS
───────────────────────────────────────── */
const btn = {
  amber: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: T.amber, color: T.text,
    border: "none", padding: "10px 20px", borderRadius: 8,
    fontSize: 14, fontWeight: 700, cursor: "pointer", textDecoration: "none",
    transition: "background 0.2s",
  },
  green: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: T.green, color: "#fff",
    border: "none", padding: "10px 20px", borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none",
    transition: "background 0.2s",
  },
  outline: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "rgba(255,255,255,0.12)", color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    padding: "10px 20px", borderRadius: 8,
    fontSize: 14, fontWeight: 600, cursor: "pointer", textDecoration: "none",
    transition: "background 0.2s",
  },
  dark: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: T.text, color: "#fff",
    border: "none", padding: "8px 14px", borderRadius: 6,
    fontSize: 12, fontWeight: 700, cursor: "pointer",
    transition: "background 0.2s",
  },
  blue: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: T.blue, color: "#fff",
    border: "none", padding: "10px 20px", borderRadius: 8,
    fontSize: 14, fontWeight: 700, cursor: "pointer",
    transition: "background 0.2s",
  },
  whiteBlue: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "#fff", color: T.blue,
    border: "none", padding: "10px 22px", borderRadius: 999,
    fontSize: 14, fontWeight: 700, cursor: "pointer",
    boxShadow: "0 4px 16px rgba(0,0,0,0.12)", transition: "box-shadow 0.2s, transform 0.2s",
  },
};

/* ─────────────────────────────────────────
   CARD SHELL
───────────────────────────────────────── */
const card = {
  background: T.bgWhite,
  borderRadius: 16,
  border: `1px solid ${T.border}`,
  boxShadow: `0 2px 16px ${T.shadowSm}`,
  padding: 24,
};

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const phoneNumber = "+91-9098268872";
  const emailAddress = "admin@ddsonline.in";

  useEffect(() => {
    const fetchProducts = () => {
      axios
        .get(`${BASE_URL}/api/products`)
        .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
        .catch((err) => {
          console.error("Error fetching products:", err);
          setError("Failed to load services. Please refresh the page.");
        })
        .finally(() => setIsLoading(false));
    };

    // Fetch immediately on mount
    fetchProducts();

    // Refetch every 60 seconds to catch new products
    const interval = setInterval(fetchProducts, 60000);
    return () => clearInterval(interval);
  }, []);

  const topServices = products.slice(0, 6);

  return (
    <GlassCard style={{ background: T.bg, minHeight: "100vh", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{GLOBAL_CSS}</style>
      <div className="home-root">

        {/* ══════════════════════════════
            HERO BANNER
        ══════════════════════════════ */}
        <section style={{
          background: `linear-gradient(135deg, ${T.blueDeep} 0%, ${T.blueDark} 55%, #1e40af 100%)`,
          padding: "52px 20px 44px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* subtle dot-grid overlay */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }} />
          {/* bottom fade into page bg */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
            background: `linear-gradient(to bottom, transparent, ${T.bg})`,
            pointerEvents: "none",
          }} />

          <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, alignItems: "center" }}
              className="hero-grid"
            >
              {/* LEFT */}
              <div className="fade-up">
                <span style={{
                  display: "inline-block",
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 999, padding: "4px 14px",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.9)",
                  marginBottom: 16,
                }}>
                  DDS Service Provider
                </span>

                <h1 style={{
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: "clamp(1.8rem,4vw,2.9rem)",
                  fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.025em",
                  color: "#fff", margin: "0 0 14px",
                }}>
                  Your Trusted<br />
                  <span style={{
                    background: "linear-gradient(90deg,#93c5fd,#67e8f9)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                  }}>DDS Online</span>
                </h1>

                <p style={{ fontSize: 15, color: "rgba(255,255,255,0.78)", marginBottom: 28, lineHeight: 1.7, fontWeight: 300 }}>
                  Expert Networking Solutions &amp; IT Equipment Installation Services —
                  secure, seamless, and reliable.
                </p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} className="hero-btns">
                  <a href={`tel:${phoneNumber}`} style={btn.outline} className="hv-outline">
                    <FiPhone size={14} /> Call Now
                  </a>
                  <a
                    href="https://wa.me/918962062263?text=Hello%20"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={btn.green}
                    className="hv-green"
                  >
                    <FaWhatsapp size={15} /> WhatsApp
                  </a>
                </div>

                <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 18, fontSize: 13, color: "rgba(255,255,255,0.65)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <FiPhone size={13} /> {phoneNumber}
                  </span>
                  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <FiMail size={13} /> {emailAddress}
                  </span>
                </div>
              </div>

              {/* RIGHT IMAGE */}
              <div className="hero-img-col" style={{ position: "relative", borderRadius: 20, overflow: "hidden" }}>
                <img
                  src={`${BASE_URL}/uploads/cctv4.jpg`}
                  alt="IT Service Professional"
                  style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }}
                  loading="lazy"
                />
                {/* left-edge fade */}
                <div style={{
                  position: "absolute", top: 0, left: 0, width: "38%", height: "100%",
                  background: "linear-gradient(to right, #1e3a8a, transparent)",
                }} />
                {/* bottom badge */}
                <div style={{
                  position: "absolute", bottom: 16, left: 16, right: 16,
                  background: "rgba(255,255,255,0.1)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 12, padding: "10px 14px",
                  display: "flex", alignItems: "center", gap: 10,
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: T.amber, display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <FiShield size={18} color={T.text} />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#fff" }}>Certified Professionals</p>
                    <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.65)" }}>Background-verified technicians</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            MAIN CONTENT
        ══════════════════════════════ */}
        <div style={{ padding: "36px 20px ", margin: "0 auto" }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}
            className="main-grid"
          >

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* WHAT WE DO */}
              <div style={card}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                  <div>
                    <p className="sec-label">Services</p>
                    <h2 className="sec-title">What We Do</h2>
                    <p className="sec-sub" style={{ marginBottom: 0 }}>Explore popular services customers book the most.</p>
                    
                  </div>
                  <button onClick={() => navigate("/products")} style={btn.dark} className="hv-dark">
                    View All <FiArrowRight size={12} />
                  </button>
                </div>

                {error && (
                  <div style={{
                    background: T.red50, border: `1px solid ${T.red200}`,
                    borderRadius: 8, padding: "10px 14px",
                    fontSize: 13, color: T.red700, marginBottom: 14,
                  }}>{error}</div>
                )}

                <ProductGrid
                  isLoading={isLoading}
                  services={topServices.slice(0, 3)}
                  navigate={navigate}
                  BASE_URL={BASE_URL}
                />
              </div>

              {/* WHY CHOOSE DDS */}
              <div style={card}>
                <p className="sec-label">Our Edge</p>
                <h2 className="sec-title">Why Choose DDS?</h2>
                <p className="sec-sub">Trusted solutions for all your IT infrastructure needs.</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 14 }}>
                  {[
                    { img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=70", title: "Networking Solutions", sub: "Installation & support" },
                    { img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&q=70", title: "CCTV Installation", sub: "Installation & support" },
                    { img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=70", title: "Wi-Fi Setup", sub: "Fast & reliable" },
                  ].map((item) => (
                    <WhyCard key={item.title} {...item} />
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* QUOTE FORM */}
              {/* <div style={{
                background: `linear-gradient(160deg, ${T.blueDeep} 0%, ${T.blueDark} 100%)`,
                borderRadius: 16, padding: 24, color: "#fff",
                boxShadow: `0 8px 40px rgba(37,99,235,0.28)`,
              }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>Free Estimate</p>
                <h3 style={{ fontFamily: "'DM Sans',sans-serif", margin: "0 0 18px", fontSize: "1.25rem", fontWeight: 800 }}>
                  Get a Free Quote!
                </h3>
                <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Name", "Email", "Phone Number"].map((ph, i) => (
                    <input
                      key={ph}
                      placeholder={ph}
                      type={i === 1 ? "email" : i === 2 ? "tel" : "text"}
                      style={{
                        width: "100%", background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.18)",
                        borderRadius: 8, padding: "10px 12px",
                        fontSize: 13, color: "#fff", outline: "none",
                        fontFamily: "'DM Sans',sans-serif",
                      }}
                    />
                  ))}
                  <textarea
                    rows={4} placeholder="Message"
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.1)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: 8, padding: "10px 12px",
                      fontSize: 13, color: "#fff", outline: "none",
                      resize: "none", fontFamily: "'DM Sans',sans-serif",
                    }}
                  />
                  <button type="submit" style={{ ...btn.amber, justifyContent: "center", padding: "12px", borderRadius: 8, fontSize: 14, width: "100%" }} className="hv-amber">
                    Submit Request
                  </button>
                </form>
              </div> */}
              <QuoteForm />


              {/* PROVIDER BOX */}
              <div style={{ ...card, padding: 20 }}>
                <p className="sec-label">Support</p>
                <h3 style={{ fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px", fontSize: "1rem", fontWeight: 800, color: T.text }}>
                  Our Tailored Provider
                </h3>
                <p style={{ margin: "0 0 14px", fontSize: 12, color: T.muted }}>Reach us anytime</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { accent: T.amber, phone: "+91-9098268872", email: "admin@ddsonline.in" },
                    { accent: T.blue, phone: "+91-8962062263", email: "support@ddsonline.in" },
                  ].map((item, i) => (
                    <div key={i} style={{ background: T.bgSoft, borderRadius: 10, border: `1px solid ${T.border}`, padding: "12px 14px" }}>
                      <a href={`tel:${item.phone}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textMid, textDecoration: "none", marginBottom: 7 }}>
                        <FiPhone size={14} style={{ color: item.accent, flexShrink: 0 }} /> {item.phone}
                      </a>
                      <a href={`mailto:${item.email}`} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: T.textMid, textDecoration: "none" }}>
                        <FiMail size={14} style={{ color: item.accent, flexShrink: 0 }} /> {item.email}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            OTHER CLIENTS / SERVICES
        ══════════════════════════════ */}
        <div style={{ padding: "28px 20px", margin: "0 auto" }}>
          <div style={card}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
              <div>
                <p className="sec-label">Portfolio</p>
                <h2 className="sec-title">Our Other Clients</h2>
                <p className="sec-sub" style={{ marginBottom: 0 }}>Explore popular services customers book the most.</p>
              </div>
              <button onClick={() => navigate("/products")} style={btn.dark} className="hv-dark">
                View All <FiArrowRight size={12} />
              </button>
            </div>

            {error && (
              <div style={{
                background: T.red50, border: `1px solid ${T.red200}`,
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: T.red700, marginBottom: 14,
              }}>{error}</div>
            )}

            <ProductGrid
              isLoading={isLoading}
              services={topServices.slice(0, 3)}
              navigate={navigate}
              BASE_URL={BASE_URL}
            />
          </div>
        </div>

        {/* ══════════════════════════════
            HOW IT WORKS
        ══════════════════════════════ */}
        <div style={{ background: T.bgWhite, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: "52px 20px" }}>
          <div style={{ margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <p className="sec-label" style={{ textAlign: "center" }}>The Process</p>
              <h2 className="sec-title" style={{ textAlign: "center" }}>How It Works</h2>
              <p style={{ fontSize: 14, color: T.muted, margin: 0 }}>Book a service in 3 simple steps</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }} className="step-grid">
              <StepCard step="1" title="Choose Service" text="Select from a wide range of IT services tailored to your needs." />
              <StepCard step="2" title="Book Appointment" text="Pick your preferred date and time — we'll confirm instantly." />
              <StepCard step="3" title="Get It Done" text="Our professional arrives on time and completes the job to your satisfaction." />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            BOTTOM CTA STRIP
        ══════════════════════════════ */}
        {/* <div style={{ padding: "40px 20px 52px", margin: "0 auto" }}>
          <div style={{
            background: `linear-gradient(135deg, ${T.blue} 0%, ${T.cyan} 100%)`,
            borderRadius: 20, padding: "44px 36px",
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "space-between", gap: 24,
            boxShadow: `0 20px 60px rgba(37,99,235,0.3)`,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
              backgroundSize: "24px 24px", pointerEvents: "none",
            }} />
            <div style={{ position: "relative" }}>
              <p style={{ margin: "0 0 6px", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)" }}>Get Started Today</p>
              <h2 style={{ fontFamily: "'DM Sans',sans-serif", margin: "0 0 8px", fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#fff" }}>
                Ready for expert IT support?
              </h2>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.78)", fontWeight: 300 }}>
                Contact us now and get a free assessment of your needs.
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", position: "relative" }}>
              <a href={`tel:${phoneNumber}`} style={btn.whiteBlue}>
                <FiPhone size={14} /> Call Now
              </a>
              <a
                href={`https://wa.me/${phoneNumber.replace("+", "")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ ...btn.whiteBlue, background: "rgba(255,255,255,0.15)", color: "#fff", boxShadow: "none", border: "1px solid rgba(255,255,255,0.35)" }}
                className="hv-outline"
              >
                <FaWhatsapp size={15} /> WhatsApp
              </a>
            </div>
          </div>
        </div> */}

      </div>
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
     </GlassCard>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS (all logic preserved)
───────────────────────────────────────── */

/** Reusable product grid — handles loading / empty / data states */
function ProductGrid({ isLoading, services, navigate, BASE_URL }) {
  if (isLoading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="prod-grid">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ height: 180 }} className="skeleton" />
        ))}
      </div>
    );
  }
  if (!services.length) {
    return (
      <p style={{ textAlign: "center", color: T.muted, fontSize: 13, padding: "24px 0" }}>
        No services available at the moment.
      </p>
    );
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }} className="prod-grid">
      {services.map((service) => (
        <ServiceCard key={service._id} service={service} navigate={navigate} BASE_URL={BASE_URL} />
      ))}
    </div>
  );
}

function ServiceCard({ service, navigate, BASE_URL }) {
  return (
    <article
      style={{
        background: T.bgSoft, borderRadius: 14,
        border: `1px solid ${T.border}`, overflow: "hidden",
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
      }}
      className="hv-lift"
    >
      <div style={{ position: "relative", height: 112 }}>
        <img
          src={
            Array.isArray(service.images) && service.images[0]
              ? (service.images[0].startsWith('http') ? service.images[0] : `${BASE_URL}/uploads/${service.images[0]}`)
              : "/default-service.jpg"
          }
          alt={service.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          loading="lazy"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.35), transparent)" }} />
        <span style={{
          position: "absolute", bottom: 7, left: 8,
          background: T.amber, color: T.text,
          fontSize: 9, fontWeight: 800, borderRadius: 4, padding: "2px 7px", letterSpacing: "0.05em",
        }}>
          Popular
        </span>
      </div>
      <div style={{ padding: "12px 14px", display: "flex", justifyContent: "space-between" }}>
        <div>
          <h3 style={{
          margin: "0 0 4px", fontSize: 13, fontWeight: 700, color: T.text,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {service.name}
        </h3>
        <p style={{
          margin: "0 0 10px", fontSize: 11, color: T.muted, lineHeight: 1.55,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {service.description || "Professional service for your needs"}
        </p>
        </div>
        <div style={{ justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate(`/product/${service._id}`)}
            style={{ ...btn.dark, padding: "5px 10px", fontSize: 11, borderRadius: 6 }}
            className="hv-dark"
          >
            View <FiArrowRight size={11} />
          </button>
        </div>
      </div>
    </article>
  );
}

function WhyCard({ img, title, sub }) {
  return (
    <div style={{
      borderRadius: 12, overflow: "hidden",
      border: `1px solid ${T.border}`,
      background: T.bgWhite,
      boxShadow: `0 2px 10px ${T.shadowSm}`,
      transition: "transform 0.22s, box-shadow 0.22s",
    }} className="hv-lift">
      <img src={img} alt={title} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} loading="lazy" />
      <div style={{ padding: "10px 12px" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.text }}>{title}</p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: T.muted }}>{sub}</p>
      </div>
    </div>
  );
}

function StepCard({ step, title, text }) {
  return (
    <div style={{
      background: T.bgWhite, borderRadius: 14,
      border: `1px solid ${T.border}`,
      boxShadow: `0 2px 10px ${T.shadowSm}`,
      padding: "22px 20px",
      display: "flex", flexDirection: "column", gap: 12,
      transition: "transform 0.22s, box-shadow 0.22s",
    }} className="hv-lift">
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: T.bluePale,
        border: `1px solid #bcd0fa`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans',sans-serif",
        fontWeight: 800, fontSize: 15, color: T.blue,
      }}>
        {step}
      </div>
      <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text, fontFamily: "'DM Sans',sans-serif" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 13, color: T.muted, lineHeight: 1.65 }}>{text}</p>
    </div>
  );
}

/* Legacy sub-components kept for compatibility */
function ServicePill({ icon, title, subtitle }) {
  return (
    <div style={{
      background: T.bgWhite, borderRadius: 10,
      border: `1px solid ${T.border}`,
      boxShadow: `0 1px 4px ${T.shadowSm}`,
      padding: 14, display: "flex", alignItems: "flex-start", gap: 12,
      transition: "border-color 0.2s",
    }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: T.bluePale, color: T.blue, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{title}</p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: T.muted }}>{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, chip, color }) {
  const bg = { blue: "#eff4ff", emerald: "#ecfdf5", amber: "#fffbeb", rose: "#fff1f2" };
  const tc = { blue: T.blue, emerald: "#065f46", amber: "#92400e", rose: "#9f1239" };
  return (
    <div style={{ background: bg[color] || T.bgSoft, borderRadius: 12, border: `1px solid ${T.border}`, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={{ margin: 0, fontSize: 12, color: T.muted }}>{label}</p>
      <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: T.text }}>{value}</p>
      <span style={{ display: "inline-block", background: bg[color], color: tc[color], borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600, alignSelf: "flex-start" }}>
        {chip}
      </span>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div style={{ background: T.bgWhite, borderRadius: 12, border: `1px solid ${T.border}`, boxShadow: `0 2px 8px ${T.shadowSm}`, padding: 18, display: "flex", flexDirection: "column", gap: 10 }} className="hv-lift">
      <div style={{ width: 40, height: 40, borderRadius: 8, background: T.bluePale, color: T.blue, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {icon}
      </div>
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 12, color: T.muted }}>{text}</p>
    </div>
  );
}