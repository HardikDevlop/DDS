import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { ErrorToast } from "../Components/ErrorToast";

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
  shadow: "rgba(37,99,235,0.10)",
  shadowSm: "rgba(0,0,0,0.05)",
  green: "#16a34a",
  greenPale: "#dcfce7",
  amber: "#f59e0b",
};

const CSS = `
  .sub-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh; color: ${T.text};
  }
  .sub-inner { max-width: 1200px; margin: 0 auto; padding: 36px 20px 80px; }

  @media (max-width: 768px) {
    .sub-inner { padding: 20px 16px 100px; }
    .sub-card { min-width: 160px; max-width: 170px; }
    .sub-card-img { height: 100px; }
  }

  /* cards row */
  .sub-scroll { display: flex; overflow-x: auto; gap: 14px; padding-bottom: 8px; scroll-behavior: smooth; }
  .sub-scroll::-webkit-scrollbar { height: 4px; }
  .sub-scroll::-webkit-scrollbar-track { background: transparent; }
  .sub-scroll::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }

  .sub-card {
    min-width: 200px; max-width: 210px; flex-shrink: 0;
    background: ${T.bgWhite}; border: 1.5px solid ${T.border};
    border-radius: 14px; overflow: hidden; cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    position: relative;
  }
  .sub-card:hover { transform: translateY(-3px); box-shadow: 0 10px 30px ${T.shadow}; }
  .sub-card.in-cart { border-color: ${T.blue}; box-shadow: 0 0 0 2px rgba(37,99,235,0.2); }

  .sub-card-img { height: 120px; overflow: hidden; position: relative; }
  .sub-card-img img { width:100%; height:100%; object-fit:cover; transition: transform 0.35s; }
  .sub-card:hover .sub-card-img img { transform: scale(1.05); }

  .remove-btn {
    position: absolute; top: 8px; right: 8px;
    background: #ef4444; color: #fff;
    border: none; border-radius: 50%;
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; cursor: pointer; z-index: 10;
    transition: background 0.15s;
  }
  .remove-btn:hover { background: #dc2626; }

  /* scroll arrows */
  .scroll-arrow {
    position: absolute; top: 50%; transform: translateY(-50%);
    width: 36px; height: 36px; border-radius: 50%;
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    box-shadow: 0 2px 10px ${T.shadowSm};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; z-index: 5; color: ${T.blue};
    transition: background 0.15s, box-shadow 0.15s;
  }
  .scroll-arrow:hover { background: ${T.bluePale}; box-shadow: 0 4px 16px ${T.shadow}; }

  /* toast */
  @keyframes toastIn { from{opacity:0;transform:translate(-50%,12px)} to{opacity:1;transform:translate(-50%,0)} }
  .toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    border-radius: 14px; padding: 14px 20px;
    display: flex; align-items: center; gap: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12); z-index: 60;
    animation: toastIn 0.28s ease both; white-space: nowrap;
  }

  /* floating cart */
  .float-cart {
    position: fixed; right: 24px; bottom: 60px; z-index: 50;
    width: 56px; height: 56px; border-radius: 50%;
    background: ${T.blue}; color: #fff; border: 3px solid #fff;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 24px rgba(37,99,235,0.4); cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .float-cart:hover { transform: scale(1.1); box-shadow: 0 10px 32px rgba(37,99,235,0.5); }
  .float-badge {
    position: absolute; top: -4px; right: -4px;
    background: #ef4444; color: #fff; font-size: 10px; font-weight: 700;
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid #fff;
  }

  /* section card */
  .section-card {
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    border-radius: 16px; padding: 24px;
    box-shadow: 0 2px 12px ${T.shadowSm}; margin-bottom: 24px;
  }
`;

export default function Subservices() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, removeFromCart, cartItems } = useContext(CartContext);
  const [suggestions, setSuggestions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const suggestionsRef = useRef(null);
  const mainScrollRef = useRef(null);

  const scrollSuggestions = (direction) => {
    const c = suggestionsRef.current;
    if (!c) return;
    c.scrollBy({ left: direction === "right" ? 224 : -224, behavior: "smooth" });
  };

  useEffect(() => {
    axios.get(`${BASE_URL}/api/products/${id}`)
      .then((res) => { setProduct(res.data); setIsLoading(false); })
      .catch(() => { setError("Failed to load subservices."); setIsLoading(false); });

    const fetchSuggestions = () => {
      axios.get(`${BASE_URL}/api/products`).then(res => {
        const allSubs = res.data
          .filter(p => p._id !== id)
          .flatMap(p => (p.subServices || []).map(sub => ({
            ...sub, parentProductId: p._id, parentProductName: p.name,
          })));
        setSuggestions(allSubs);
      });
    };

    // Fetch immediately
    fetchSuggestions();

    // Refetch suggestions every 60 seconds
    const interval = setInterval(fetchSuggestions, 60000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    if (showToast) {
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [showToast]);

  const isInCart = (sub, parentProductId) =>
    cartItems.some(item => item.title === sub.name && item.parentProductId === parentProductId && item.subService === true);

  /* ── States ── */
  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 44, height: 44, border: `3px solid ${T.border}`, borderTopColor: T.blue,
          borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px",
        }} />
        <p style={{ fontSize: 13, color: T.muted }}>Loading services…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );

  if (error || !product) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg }}>
      <div style={{ textAlign: "center", background: T.bgWhite, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px 28px", maxWidth: 380 }}>
        <div style={{ width: 56, height: 56, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
        </div>
        <p style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>{error || "Product not found"}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: 16, padding: "9px 22px", background: T.blue, color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
          Go Back
        </button>
      </div>
    </div>
  );

  return (
    <div className="sub-root">
      <style>{CSS}</style>
      <div className="sub-inner">

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.blue, marginBottom: 4 }}>Services</p>
            <h1 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: T.text }}>{product.name}</h1>
          </div>
          <button
            onClick={() => navigate(-1)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 18px", background: T.bgWhite, color: T.textMid, border: `1px solid ${T.border}`, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", boxShadow: `0 1px 4px ${T.shadowSm}`, transition: "border-color 0.15s" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Main subservices */}
        <div className="section-card">
          <p style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginBottom: 16 }}>
            {product.subServices?.length || 0} services available — click to add to cart
          </p>
          <div className="sub-scroll" ref={mainScrollRef}>
            {product.subServices.map((sub, idx) => {
              const inCart = isInCart(sub, product._id);
              return (
                <div
                  key={idx}
                  className={`sub-card${inCart ? " in-cart" : ""}`}
                  onClick={() => {
                    if (!inCart) {
                      addToCart({
                        id: product._id + "-" + (sub.name || idx),
                        title: sub.name, price: sub.price,
                        imageUrl: sub.image,
                        parentProductId: product._id, subService: true,
                      });
                      setToastMsg(`${sub.name} added to cart!`);
                      setShowToast(true);
                    }
                  }}
                >
                  <div className="sub-card-img">
                    <img
                      src={sub.image ? (sub.image.startsWith("http") ? sub.image : `${BASE_URL}/uploads/${sub.image}`) : "/img/default-service.png"}
                      alt={sub.name}
                      onError={e => { e.target.src = "/img/default-service.png"; }}
                    />
                    {inCart && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(37,99,235,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ background: T.blue, color: "#fff", borderRadius: 6, padding: "3px 10px", fontSize: 10, fontWeight: 700 }}>In Cart ✓</div>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: "11px 12px" }}>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub.name}</h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: T.blue }}>₹{sub.price}</span>
                      {sub.originalPrice && <span style={{ fontSize: 11, color: T.muted, textDecoration: "line-through" }}>₹{sub.originalPrice}</span>}
                    </div>
                    {sub.rating && (
                      <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 4, background: T.bluePale, borderRadius: 6, padding: "2px 7px", fontSize: 11 }}>
                        <span style={{ color: "#f59e0b" }}>★</span>
                        <span style={{ fontWeight: 600, color: T.text }}>{sub.rating}</span>
                        <span style={{ color: T.muted }}>({sub.reviewCount})</span>
                      </div>
                    )}
                  </div>
                  {inCart && (
                    <button
                      className="remove-btn"
                      onClick={e => { e.stopPropagation(); removeFromCart(product._id + "-" + (sub.name || idx)); }}
                      title="Remove from cart"
                    >×</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="section-card" style={{ position: "relative" }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: T.text, marginBottom: 4 }}>You may also like</h2>
            <p style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>Services from other categories</p>
            <div style={{ position: "relative" }}>
              <button className="scroll-arrow" style={{ left: -16 }} onClick={() => scrollSuggestions("left")} aria-label="Scroll left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <div className="sub-scroll" ref={suggestionsRef}>
                {suggestions.slice(0, 10).map((sub, idx) => {
                  const inCart = isInCart(sub, sub.parentProductId);
                  return (
                    <div
                      key={idx}
                      className={`sub-card${inCart ? " in-cart" : ""}`}
                      onClick={() => navigate(`/product/${sub.parentProductId}`)}
                    >
                      <div className="sub-card-img">
                        <img
                          src={sub.image ? (sub.image.startsWith("http") ? sub.image : `${BASE_URL}/uploads/${sub.image}`) : "/img/default-service.png"}
                          alt={sub.name}
                          onError={e => { e.target.src = "/img/default-service.png"; }}
                        />
                      </div>
                      <div style={{ padding: "11px 12px" }}>
                        <h3 style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub.name}</h3>
                        <p style={{ fontSize: 11, color: T.muted, marginBottom: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>from {sub.parentProductName}</p>
                        <span style={{ fontSize: 14, fontWeight: 800, color: T.blue }}>₹{sub.price}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="scroll-arrow" style={{ right: -16 }} onClick={() => scrollSuggestions("right")} aria-label="Scroll right">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Floating cart button */}
      <button className="float-cart" onClick={() => navigate("/cart")} title="Go to Cart" style={{ position: "fixed" }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {cartItems.length > 0 && <span className="float-badge">{cartItems.length}</span>}
      </button>

      {/* Toast */}
      {showToast && (
        <div className="toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{toastMsg}</span>
          <button onClick={() => navigate("/cart")} style={{ padding: "7px 14px", background: T.blue, color: "#fff", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
            View Cart
          </button>
          <button onClick={() => setShowToast(false)} style={{ background: "none", border: "none", color: T.muted, fontSize: 18, cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>×</button>
        </div>
      )}
    </div>
  );
}