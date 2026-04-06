import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
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
};

const CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .pd-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg};
    min-height: 100vh;
    color: ${T.text};
  }

  /* ── Mobile header ── */
  .pd-mobile-header {
    display: none;
    position: sticky;
    top: 0;
    z-index: 40;
    background: ${T.bgWhite};
    border-bottom: 1px solid ${T.border};
    padding: 12px 16px;
    align-items: center;
    justify-content: space-between;
  }

  /* ── Desktop / Mobile visibility ── */
  @media (max-width: 768px) {
    .pd-mobile-header { display: flex; }
    .pd-desktop { display: none !important; }
    .pd-mobile { display: block !important; }
  }
  @media (min-width: 769px) {
    .pd-mobile { display: none !important; }
    .pd-desktop { display: grid; }
  }

  /* ── Thumbnails ── */
  .thumb {
    height: 68px;
    width: 68px;
    border-radius: 9px;
    object-fit: cover;
    cursor: pointer;
    border: 2px solid ${T.border};
    flex-shrink: 0;
    transition: border-color 0.15s, transform 0.15s;
  }
  .thumb.active { border-color: ${T.blue}; transform: scale(1.05); }
  .thumb:hover { border-color: #93c5fd; }

  /* ── Sub-service chips (desktop) ── */
  .sub-chip {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: ${T.bgSoft};
    border: 1.5px solid ${T.border};
    border-radius: 12px;
    padding: 10px 8px;
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    position: relative;
  }
  .sub-chip:hover { border-color: #93c5fd; box-shadow: 0 4px 14px ${T.shadow}; }
  .sub-chip.selected {
    border-color: ${T.blue};
    box-shadow: 0 0 0 2px rgba(37,99,235,0.18);
    background: ${T.bluePale};
  }

  /* ── Add to Cart button ── */
  .add-btn {
    width: 100%;
    padding: 15px;
    border: none;
    border-radius: 14px;
    background: ${T.blue};
    color: #fff;
    font-size: 15px;
    font-weight: 700;
    font-family: inherit;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: background 0.15s, transform 0.12s;
    letter-spacing: 0.01em;
  }
  .add-btn:hover { background: ${T.blueDark}; transform: translateY(-1px); }
  .add-btn:active { transform: translateY(0); }

  /* ── Modal overlay ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    padding: 16px;
  }
  @keyframes scaleIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal-card {
    background: ${T.bgWhite};
    border-radius: 20px;
    padding: 32px 28px;
    width: 100%;
    max-width: 360px;
    text-align: center;
    animation: scaleIn 0.22s ease both;
  }

  /* ── Mobile sticky bottom bar ── */
  .mobile-sticky-bar {
    display: none;
  }
  @media (max-width: 768px) {
    /* Push content up so sticky bar never overlaps it */
    .pd-mobile { padding-bottom: 90px; }

    .mobile-sticky-bar {
      display: block;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 50;
      background: ${T.bgWhite};
      border-top: 1.5px solid ${T.border};
      padding: 12px 16px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom, 0px));
      box-shadow: 0 -4px 20px rgba(0,0,0,0.08);
    }

    .mobile-sticky-bar .add-btn {
      border-radius: 12px;
      font-size: 15px;
      padding: 14px 16px;
    }
  }

  /* ── Icon button ── */
  .icon-btn {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: none;
    border: none;
    cursor: pointer;
    color: ${T.textMid};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;
  }
  .icon-btn:hover { background: ${T.bluePale}; color: ${T.blue}; }

  /* ── Info card ── */
  .info-card {
    background: ${T.bgWhite};
    border: 1px solid ${T.border};
    border-radius: 14px;
    padding: 20px;
    box-shadow: 0 2px 12px ${T.shadowSm};
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddedCard, setShowAddedCard] = useState(false);
  const [showAlreadyInCart, setShowAlreadyInCart] = useState(false);
  const [mainImage, setMainImage] = useState(0);
  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        setTotalPrice(res.data.visitingPrice);
        setIsLoading(false);
      })
      .catch(() => {
        setError("Failed to load product details. Please try again.");
        setIsLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      const extra = selectedSubServices.reduce((sum, item) => sum + item.price, 0);
      setTotalPrice(product.visitingPrice + extra);
    }
  }, [selectedSubServices, product]);

  const [shareFeedback, setShareFeedback] = useState(""); // "copied" | "shared" | ""

  const handleShare = async () => {
    const shareData = {
      title: product?.name || "Check out this service",
      text: `${product?.name} — starting at ₹${product?.visitingPrice}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareFeedback("shared");
      } catch (err) {
        // User cancelled — no feedback needed
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareFeedback("copied");
      } catch {
        setShareFeedback("copied");
      }
    }

    setTimeout(() => setShareFeedback(""), 2000);
  };

  const toggleSub = (sub) => {
    if (selectedSubServices.find((s) => s.name === sub.name)) {
      setSelectedSubServices((prev) => prev.filter((s) => s.name !== sub.name));
    } else {
      setSelectedSubServices((prev) => [...prev, sub]);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (cartItems.some((item) => item.id === product._id)) {
      setShowAlreadyInCart(true);
      return;
    }
    addToCart({
      id: product._id,
      title: product.name,
      price: product.visitingPrice,
      imageUrl: Array.isArray(product.images) && product.images[0] ? product.images[0] : "",
      subServices: selectedSubServices,
    });
    setShowAddedCard(true);
  };

  /* ── Loading ── */
  if (isLoading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 44, height: 44, border: `3px solid ${T.border}`, borderTopColor: T.blue, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <p style={{ fontSize: 13, color: T.muted }}>Loading service details…</p>
      </div>
    </div>
  );

  /* ── Not found ── */
  if (!product) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: T.bg, padding: 16 }}>
      <div style={{ textAlign: "center", background: T.bgWhite, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px 28px", maxWidth: 340 }}>
        <div style={{ width: 56, height: 56, background: "#fef2f2", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: T.text, marginBottom: 6 }}>Service Not Found</h3>
        <p style={{ fontSize: 13, color: T.muted, marginBottom: 20 }}>The service you're looking for doesn't exist.</p>
        <button onClick={() => navigate(-1)} style={{ padding: "10px 24px", background: T.blue, color: "#fff", border: "none", borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Go Back</button>
      </div>
    </div>
  );

  const images = Array.isArray(product.images) ? product.images : [];
  const hasSubs = Array.isArray(product.subServices) && product.subServices.length > 0;

  /* ── Cart button shared content ── */
  const CartIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );

  return (
    <div className="pd-root">
      <style>{CSS}</style>

      {/* ── Mobile header ── */}
      <div className="pd-mobile-header">
        <button className="icon-btn" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        </button>
        <span style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Service Details</span>
        <button
          className="icon-btn"
          onClick={handleShare}
          title={shareFeedback === "copied" ? "Link copied!" : "Share this service"}
          style={{ position: "relative" }}
        >
          {shareFeedback === "copied" ? (
            /* Checkmark — link was copied to clipboard */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : shareFeedback === "shared" ? (
            /* Sent checkmark — native share succeeded */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          ) : (
            /* Default share icon */
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          )}
          {/* Tooltip feedback bubble */}
          {shareFeedback && (
            <span style={{
              position: "absolute", bottom: "calc(100% + 8px)", right: 0,
              background: T.text, color: "#fff",
              fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
              borderRadius: 6, padding: "4px 8px",
              pointerEvents: "none",
              animation: "scaleIn 0.15s ease both",
            }}>
              {shareFeedback === "copied" ? "Link copied!" : "Shared!"}
            </span>
          )}
        </button>
      </div>

      {/* ══ DESKTOP LAYOUT ══ */}
      <div
        className="pd-desktop"
        style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 20px 60px", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "start" }}
      >
        {/* Left — images */}
        <div>
          <div style={{ borderRadius: 16, overflow: "hidden", border: `1px solid ${T.border}`, marginBottom: 12, boxShadow: `0 4px 20px ${T.shadowSm}` }}>
            <img
              src={images[mainImage] ? `${BASE_URL}/uploads/${images[mainImage]}` : "https://via.placeholder.com/500x340?text=Service"}
              alt={product.name}
              style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }}
            />
          </div>
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {images.map((img, i) => (
                <img key={i} src={`${BASE_URL}/uploads/${img}`} alt="Thumbnail" className={`thumb${mainImage === i ? " active" : ""}`} onClick={() => setMainImage(i)} />
              ))}
            </div>
          )}
        </div>

        {/* Right — info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: T.blue, marginBottom: 6 }}>Service Details</p>
            <h1 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, letterSpacing: "-0.02em", color: T.text, marginBottom: 12 }}>{product.name}</h1>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: T.blue }}>₹{totalPrice}</span>
              <span style={{ fontSize: 13, color: T.muted }}>Visiting price: ₹{product.visitingPrice}</span>
            </div>
          </div>

          {/* Sub-services grid */}
          {hasSubs && (
            <div className="info-card">
              <h3 style={{ fontSize: 14, fontWeight: 800, color: T.text, marginBottom: 14 }}>Available Add-ons</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {product.subServices.map((sub, i) => {
                  const isSelected = selectedSubServices.some((s) => s.name === sub.name);
                  return (
                    <div key={i} className={`sub-chip${isSelected ? " selected" : ""}`} onClick={() => toggleSub(sub)}>
                      {sub.image && (
                        <img src={`${BASE_URL}/uploads/${sub.image}`} alt={sub.name} style={{ width: "100%", height: 52, objectFit: "cover", borderRadius: 8, marginBottom: 6 }} onError={(e) => { e.target.src = "https://via.placeholder.com/100x52?text=Service"; }} />
                      )}
                      <span style={{ fontSize: 11, fontWeight: 600, color: T.text, textAlign: "center", lineHeight: 1.3, marginBottom: 4 }}>{sub.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: T.green }}>₹{sub.price}</span>
                      {isSelected && (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleSub(sub); }}
                          style={{ position: "absolute", top: 6, right: 6, background: "#ef4444", color: "#fff", border: "none", borderRadius: "50%", width: 20, height: 20, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}
                        >×</button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button className="add-btn" onClick={handleAddToCart}>
            <CartIcon />
            Add to Cart — ₹{totalPrice}
          </button>
        </div>
      </div>

      {/* ══ MOBILE LAYOUT ══ */}
      <div className="pd-mobile">
        {/* Hero image */}
        <div style={{ position: "relative" }}>
          <img
            src={images[mainImage] ? `${BASE_URL}/uploads/${images[mainImage]}` : "https://via.placeholder.com/400x280?text=Service"}
            alt={product.name}
            style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }}
          />
          {images.length > 1 && (
            <div style={{ position: "absolute", bottom: 10, right: 12, background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: 11, fontWeight: 600, borderRadius: 999, padding: "3px 10px" }}>
              {mainImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div style={{ background: T.bgWhite, padding: "12px 16px", display: "flex", gap: 10, overflowX: "auto" }}>
            {images.map((img, i) => (
              <img key={i} src={`${BASE_URL}/uploads/${img}`} alt="Thumb" className={`thumb${mainImage === i ? " active" : ""}`} onClick={() => setMainImage(i)} />
            ))}
          </div>
        )}

        {/* Title + price */}
        <div style={{ background: T.bgWhite, padding: "20px 16px", borderBottom: `1px solid ${T.border}` }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: T.text, marginBottom: 8 }}>{product.name}</h1>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: 24, fontWeight: 800, color: T.blue }}>₹{totalPrice}</span>
            <span style={{ fontSize: 12, color: T.muted }}>Visiting: ₹{product.visitingPrice}</span>
          </div>
        </div>

        {/* Mobile sub-services */}
        {hasSubs && (
          <div style={{ background: T.bgWhite, padding: "20px 16px", borderBottom: `1px solid ${T.border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: T.text, marginBottom: 14 }}>Available Add-ons</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {product.subServices.map((sub, i) => {
                const isSelected = selectedSubServices.some((s) => s.name === sub.name);
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 14px",
                      border: `1.5px solid ${isSelected ? T.blue : T.border}`,
                      borderRadius: 12,
                      background: isSelected ? T.bluePale : T.bgSoft,
                      transition: "border-color 0.15s, background 0.15s",
                    }}
                  >
                    {sub.image && (
                      <img
                        src={`${BASE_URL}/uploads/${sub.image}`}
                        alt={sub.name}
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                        onError={(e) => { e.target.src = "https://via.placeholder.com/48x48?text=S"; }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: T.text, marginBottom: 2 }}>{sub.name}</p>
                      <p style={{ fontSize: 14, fontWeight: 800, color: T.green }}>₹{sub.price}</p>
                    </div>
                    <button
                      onClick={() => toggleSub(sub)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none",
                        fontWeight: 700, fontSize: 12, fontFamily: "inherit", cursor: "pointer",
                        background: isSelected ? "#fee2e2" : T.bluePale,
                        color: isSelected ? "#dc2626" : T.blue,
                        transition: "background 0.15s",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected ? "Remove" : "Add"}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Selected summary */}
            {selectedSubServices.length > 0 && (
              <div style={{ marginTop: 14, background: T.bluePale, border: `1px solid #bcd0fa`, borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: T.blue, marginBottom: 8 }}>Selected add-ons</p>
                {selectedSubServices.map((sub, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", fontSize: 13 }}>
                    <span style={{ color: T.textMid }}>{sub.name}</span>
                    <span style={{ fontWeight: 700, color: T.green }}>₹{sub.price}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid #bcd0fa`, marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Total</span>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T.blue }}>₹{totalPrice}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══ MOBILE STICKY BOTTOM BAR ══ */}
      <div className="mobile-sticky-bar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: T.muted, marginBottom: 1 }}>Total price</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: T.blue }}>₹{totalPrice}</p>
          </div>
          <button
            className="add-btn"
            onClick={handleAddToCart}
            style={{ flex: 2, padding: "14px 16px" }}
          >
            <CartIcon />
            Add to Cart
          </button>
        </div>
      </div>

      {/* ── Modal: Added to cart ── */}
      {showAddedCard && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ width: 56, height: 56, background: T.greenPale, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 6 }}>Added to Cart!</h3>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 22 }}>Your service has been added successfully.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowAddedCard(false)} style={{ flex: 1, padding: "11px", background: T.bgSoft, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: T.textMid }}>Continue</button>
              <button onClick={() => { setShowAddedCard(false); navigate("/cart"); }} style={{ flex: 1, padding: "11px", background: T.blue, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#fff" }}>View Cart</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Already in cart ── */}
      {showAlreadyInCart && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ width: 56, height: 56, background: "#fefce8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: T.text, marginBottom: 6 }}>Already in Cart</h3>
            <p style={{ fontSize: 13, color: T.muted, marginBottom: 22 }}>This service is already in your cart.</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowAlreadyInCart(false)} style={{ flex: 1, padding: "11px", background: T.bgSoft, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: T.textMid }}>OK</button>
              <button onClick={() => { setShowAlreadyInCart(false); navigate("/cart"); }} style={{ flex: 1, padding: "11px", background: T.blue, border: "none", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", color: "#fff" }}>View Cart</button>
            </div>
          </div>
        </div>
      )}
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </div>
  );
}