import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import API from "../utils/axiosInstance";

// Dynamically load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
};
import { FiCheck, FiMapPin, FiClock, FiUser, FiMail, FiShield, FiChevronRight } from "react-icons/fi";

const PAYMENT_METHODS = [
  { key: "razorpay", label: "Razorpay", sub: "Cards, UPI, Netbanking", icon: "/img/razorpay-icon.png", accent: "#2563eb" },
  // UPI selection is disabled for both web and mobile views.
  // { key: "UPI", label: "UPI", sub: "UPI instant transfer", icon: "/img/gpay-icon.png", accent: "#34a853" },
  { key: "post", label: "Post Service Payment", sub: "Pay after service done", icon: "/img/cash-icon.png", accent: "#f59e0b" },
];

const T = {
  bg: "#f0f4ff",
  bgWhite: "#ffffff",
  bgSoft: "#f8faff",
  blue: "#2563eb",
  blueDark: "#1d4ed8",
  blueDeep: "#1e3a8a",
  bluePale: "#eff4ff",
  text: "#0f172a",
  textMid: "#334155",
  muted: "#64748b",
  border: "#dde5f4",
  shadow: "rgba(37,99,235,0.10)",
  shadowSm: "rgba(0,0,0,0.06)",
  green: "#16a34a",
  greenPale: "#dcfce7",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .pay-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${T.bg};
    min-height: 100vh;
    padding: 32px 16px 64px;
  }

  /* ── Fade-up entry ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-col { animation: fadeUp 0.45s ease both; }
  .fade-col:nth-child(2) { animation-delay: 0.1s; }

  /* ── Two-column wrapper ── */
  .pay-wrap {
    max-width: 960px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 24px;
    align-items: start;
  }

  /* ── Shared card shell ── */
  .pay-panel {
    background: ${T.bgWhite};
    border: 1px solid ${T.border};
    border-radius: 20px;
    box-shadow: 0 4px 28px ${T.shadowSm};
    overflow: hidden;
  }

  /* ── Panel header band ── */
  .panel-head {
    padding: 18px 24px;
    border-bottom: 1px solid ${T.border};
    background: ${T.bgSoft};
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .panel-head-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: ${T.bluePale};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .panel-head-title {
    font-size: 13px; font-weight: 700;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: ${T.blue};
  }

  /* ── Panel body ── */
  .panel-body { padding: 24px; }

  /* ── Item row ── */
  .item-row {
    display: flex; align-items: flex-start;
    justify-content: space-between; gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid ${T.border};
  }
  .item-row:last-child { border-bottom: none; }

  /* ── Sub service chip ── */
  .sub-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: ${T.bgSoft}; border: 1px solid ${T.border};
    border-radius: 6px; padding: 3px 9px;
    font-size: 11px; color: ${T.textMid}; font-weight: 500; margin-top: 4px; margin-right: 4px;
  }

  /* ── Info row ── */
  .info-row {
    display: flex; align-items: flex-start; gap: 9px;
    font-size: 13px; color: ${T.textMid}; padding: 6px 0;
  }

  /* ── Divider ── */
  .divider { border: none; border-top: 1px solid ${T.border}; margin: 12px 0; }

  /* ── Total band ── */
  .total-band {
    background: linear-gradient(135deg, ${T.blueDeep}, ${T.blueDark});
    border-radius: 14px; padding: 18px 20px;
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 18px;
  }

  /* ── Payment method button ── */
  .method-btn {
    width: 100%;
    display: flex; align-items: center; gap: 12px;
    padding: 13px 16px; border-radius: 12px;
    border: 1.5px solid ${T.border};
    background: ${T.bgSoft}; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
    text-align: left;
    position: relative;
  }
  .method-btn.active {
    border-color: ${T.blue};
    background: ${T.bluePale};
    box-shadow: 0 0 0 3px rgba(37,99,235,0.10);
  }
  .method-btn:hover:not(.active) { border-color: #93c5fd; background: ${T.bgWhite}; }

  .method-icon-wrap {
    width: 40px; height: 40px; border-radius: 10px;
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .method-check {
    margin-left: auto; width: 20px; height: 20px; border-radius: 50%;
    background: ${T.blue}; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .method-empty-check {
    margin-left: auto; width: 20px; height: 20px; border-radius: 50%;
    border: 1.5px solid ${T.border}; flex-shrink: 0;
  }

  /* ── Pay button ── */
  .pay-btn {
    width: 100%; padding: 15px;
    border: none; border-radius: 12px;
    background: linear-gradient(135deg, ${T.blue}, ${T.blueDark});
    color: #fff; font-size: 15px; font-weight: 700;
    font-family: 'Plus Jakarta Sans', sans-serif;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 4px 18px rgba(37,99,235,0.30);
    margin-top: 20px;
  }
  .pay-btn:hover { opacity: 0.93; transform: translateY(-1px); }
  .pay-btn:active { transform: translateY(0); }

  /* ── Trust badges ── */
  .trust-row {
    display: flex; align-items: center; justify-content: center; gap: 18px;
    padding-top: 16px; flex-wrap: wrap;
  }
  .trust-badge {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: ${T.muted}; font-weight: 500;
  }

  /* ── Page title ── */
  .page-title-wrap {
    text-align: center; margin-bottom: 28px;
  }
  .page-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: ${T.greenPale}; color: ${T.green};
    border-radius: 999px; padding: 5px 14px;
    font-size: 12px; font-weight: 700; margin-bottom: 10px;
  }
  .page-title {
    font-size: clamp(1.4rem, 3vw, 1.9rem);
    font-weight: 800; color: ${T.text};
    letter-spacing: -0.02em; margin-bottom: 4px;
  }
  .page-sub { font-size: 13px; color: ${T.muted}; }

  /* ── RESPONSIVE ── */
  @media (max-width: 780px) {
    .pay-root { padding: 20px 12px 80px; }
    .pay-wrap {
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .panel-body { padding: 18px 16px; }
    .panel-head { padding: 14px 16px; }

    /* Mobile: methods panel goes first visually on mobile */
    .col-right { order: -1; }

    /* Mobile sticky pay button */
    .pay-btn-mobile-wrap {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: ${T.bgWhite}; border-top: 1px solid ${T.border};
      padding: 12px 16px; z-index: 50;
      box-shadow: 0 -4px 20px ${T.shadowSm};
    }
    .pay-btn { margin-top: 0; }
    .pay-btn-desktop { display: none !important; }
  }
  @media (min-width: 781px) {
    .pay-btn-mobile-wrap { display: none !important; }
    .col-right { order: unset; }
  }
`;

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);
  const orderDetails = location.state?.orderDetails;
  const [selectedMethod, setSelectedMethod] = useState("post");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { if (!orderDetails) navigate("/cart"); }, [orderDetails, navigate]);
  if (!orderDetails) return null;

  const handlePayment = async () => {
    if (!isAuthenticated || !localStorage.getItem("token")) {
      alert("Please login first to place your order.");
      navigate("/login");
      return;
    }

    try {
      setIsSubmitting(true);

      if (selectedMethod === "razorpay" || selectedMethod === "pre") {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert("Failed to load payment gateway. Please try again.");
          return;
        }

        const { data: rzpOrder } = await API.post("/payment/create-order", {
          amount: Math.round(Number(orderDetails.total || 0) * 100),
        });

        const options = {
          key: rzpOrder.key,
          amount: rzpOrder.amount,
          currency: "INR",
          name: "DDS Services",
          description: "Service Payment",
          order_id: rzpOrder.id,
          handler: async (response) => {
            await API.post("/orders/place", {
              ...orderDetails,
              paymentId: response.razorpay_payment_id,
            });
            clearCart();
            navigate("/my-orders");
          },
          prefill: {
            name: orderDetails.userName,
            email: orderDetails.userEmail,
            contact: orderDetails.userPhone,
          },
          theme: { color: T.blue },
        };
        new window.Razorpay(options).open();
      // UPI payment methods are disabled in both web and mobile views.
      // } else if (selectedMethod === "gpay" || selectedMethod === "phonepe") {
      //   alert("Show UPI QR or intent for " + selectedMethod);
      // }
      } else if (selectedMethod === "post") {
        await API.post("/orders/place", {
          items: orderDetails.items,
          totalAmount: orderDetails.total,
          address: orderDetails.address,
          paymentType: "post",
        });
        clearCart();
        navigate("/my-orders");
      }
    } catch (err) {
      console.error("Order placement failed:", err);
      alert(err.response?.data?.message || err.response?.data?.error || "Order place nahi ho paya. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const btnLabel = {
    razorpay: "Pay with Razorpay",
    // UPI labels are kept commented out because UPI methods are disabled.
    // gpay: "Pay with Google Pay",
    // phonepe: "Pay with PhonePe",
    post: "Confirm — Pay After Service",
    pre: "Pay with PayPal",
  };

  const currentMethod = PAYMENT_METHODS.find(m => m.key === selectedMethod);

  return (
    <div className="pay-root">
      <style>{CSS}</style>

      {/* ── Page title ─────────────────────────────────────────── */}
       <div className="page-title-wrap">
        <div className="page-badge">
          <FiCheck size={12} /> Order Confirmed
        </div>
        <h1 className="page-title">Complete Your Payment</h1>
        <p className="page-sub">Review your order details and choose how to pay</p>
      </div>

      {/* ── Two-column grid ──────────────────────────────────────── */}
      <div className="pay-wrap">

        {/* ══════ LEFT — Order Summary ══════ */}
        <div className="pay-panel fade-col col-left">

          {/* Header */}
          <div className="panel-head">
            <div className="panel-head-icon">
              <FiCheck size={15} color={T.blue} />
            </div>
            <span className="panel-head-title">Order Summary</span>
          </div>

          <div className="panel-body">

            {/* Customer info */}
            {(orderDetails?.userName || orderDetails?.userEmail) && (
              <>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>Customer</p>
                <div style={{ background: T.bgSoft, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 18 }}>
                  {orderDetails.userName && (
                    <div className="info-row" style={{ paddingBottom: 4 }}>
                      <FiUser size={13} style={{ color: T.blue, flexShrink: 0, marginTop: 2 }} />
                      <span style={{ fontWeight: 600, color: T.text }}>{orderDetails.userName}</span>
                    </div>
                  )}
                  {orderDetails.userEmail && (
                    <div className="info-row" style={{ paddingTop: 4 }}>
                      <FiMail size={13} style={{ color: T.blue, flexShrink: 0, marginTop: 2 }} />
                      <span>{orderDetails.userEmail}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Services */}
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 10 }}>Services Booked</p>
            <div style={{ marginBottom: 18 }}>
              {orderDetails?.items?.map((item, i) => (
                <div key={i} className="item-row">
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 4 }}>{item.title}</p>
                    {Array.isArray(item.subServices) && item.subServices.length > 0 && (
                      <div>
                        {item.subServices.map((sub, si) => (
                          <span key={si} className="sub-chip">
                            {sub.name || sub.title}
                            <span style={{ color: T.green, fontWeight: 700 }}>₹{sub.price}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 800, color: T.blue, flexShrink: 0 }}>
                    ₹{item.price ?? "—"}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery info */}
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.muted, marginBottom: 8 }}>Delivery Info</p>
            <div style={{ background: T.bgSoft, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px 14px", marginBottom: 0 }}>
              <div className="info-row">
                <FiMapPin size={13} style={{ color: T.blue, flexShrink: 0, marginTop: 2 }} />
                <span>{orderDetails?.address?.fullAddress}</span>
              </div>
              <hr className="divider" style={{ margin: "6px 0" }} />
              <div className="info-row">
                <FiClock size={13} style={{ color: T.blue, flexShrink: 0, marginTop: 2 }} />
                <span>{orderDetails?.address?.timeSlot}</span>
              </div>
            </div>

            {/* Total */}
            <div className="total-band">
              <div>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 600, marginBottom: 2 }}>Total Payable</p>
                <p style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                  ₹{orderDetails?.total ? Number(orderDetails.total).toFixed(2) : "0.00"}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 4 }}>Secured by</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "flex-end" }}>
                  <FiShield size={13} color="rgba(255,255,255,0.7)" />
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>256-bit SSL</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ══════ RIGHT — Payment Methods ══════ */}
        <div className="pay-panel fade-col col-right">

          {/* Header */}
          <div className="panel-head">
            <div className="panel-head-icon">
              <FiShield size={15} color={T.blue} />
            </div>
            <span className="panel-head-title">Payment Method</span>
          </div>

          <div className="panel-body">
           
            {/* Method list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PAYMENT_METHODS.map(m => {
                const active = selectedMethod === m.key;
                return (
                  <button
                    key={m.key}
                    className={`method-btn${active ? " active" : ""}`}
                    onClick={() => setSelectedMethod(m.key)}
                  >
                    {/* Icon */}
                    <div className="method-icon-wrap">
                      <img
                        src={m.icon} alt={m.label}
                        style={{ width: 24, height: 24, objectFit: "contain" }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    </div>

                    {/* Labels */}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: active ? T.text : T.textMid, marginBottom: 1 }}>{m.label}</p>
                      <p style={{ fontSize: 11, color: T.muted }}>{m.sub}</p>
                    </div>

                    {/* Check */}
                    {active
                      ? <div className="method-check"><FiCheck size={11} color="#fff" /></div>
                      : <div className="method-empty-check" />
                    }
                  </button>
                );
              })}
            </div>

            {/* Desktop pay button */}
            <button className="pay-btn pay-btn-desktop" onClick={handlePayment} disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : (btnLabel[selectedMethod] || "Pay Now")}
              <FiChevronRight size={16} />
            </button>

            {/* Trust badges */}
            <div className="trust-row">
              <span className="trust-badge">
                <FiShield size={12} style={{ color: T.green }} />
                Secure Payment
              </span>
              <span className="trust-badge">
                <FiCheck size={12} style={{ color: T.blue }} />
                Encrypted
              </span>
              <span className="trust-badge">
                <FiShield size={12} style={{ color: T.muted }} />
                PCI DSS Safe
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ══ Mobile sticky pay button ══ */}
      <div className="pay-btn-mobile-wrap">
        <button className="pay-btn" onClick={handlePayment} disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : (btnLabel[selectedMethod] || "Pay Now")}
          <FiChevronRight size={16} />
        </button>
      </div>

    </div>
  );
}
