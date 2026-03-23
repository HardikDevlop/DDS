import React from "react";
import { FiCheck, FiZap } from "react-icons/fi";

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
};

const CSS = `
  .pricing-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; min-height: 100vh; color: ${T.text};
  }
  .pricing-inner { max-width: 1000px; margin: 0 auto; padding: 52px 20px 72px; }

  .plan-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-items: stretch;
  }
  @media(max-width:768px){ .plan-grid{ grid-template-columns:1fr; max-width:400px; margin:0 auto; } }

  .plan-card {
    background: ${T.bgWhite};
    border: 1.5px solid ${T.border};
    border-radius: 18px; padding: 28px 24px;
    display: flex; flex-direction: column;
    box-shadow: 0 2px 16px ${T.shadowSm};
    position: relative; overflow: hidden;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .plan-card:hover { box-shadow: 0 12px 40px ${T.shadow}; transform: translateY(-3px); }
  .plan-card.featured {
    border-color: ${T.blue};
    box-shadow: 0 8px 40px rgba(37,99,235,0.18);
  }
  .plan-card.featured:hover { transform: translateY(-5px); box-shadow: 0 16px 48px rgba(37,99,235,0.24); }

  .plan-btn {
    width: 100%; padding: 12px;
    border-radius: 10px; border: none;
    font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s, transform 0.15s;
    margin-top: auto;
  }
  .plan-btn:disabled { background: #e2e8f0; color: #94a3b8; cursor: not-allowed; }
  .plan-btn.primary { background: ${T.blue}; color: #fff; }
  .plan-btn.primary:hover:not(:disabled) { background: ${T.blueDark}; transform: translateY(-1px); }
  .plan-btn.outline { background: ${T.bgSoft}; color: ${T.textMid}; border: 1.5px solid ${T.border}; }
  .plan-btn.outline:hover { border-color: ${T.blue}; color: ${T.blue}; background: ${T.bluePale}; }

  .feature-row {
    display: flex; align-items: flex-start; gap: 10px;
    font-size: 13.5px; color: ${T.textMid}; padding: 5px 0;
  }
  .check-icon {
    width: 18px; height: 18px; border-radius: 5px;
    background: ${T.bluePale}; color: ${T.blue};
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-top: 1px;
  }
`;

const plans = [
  {
    title: "Basic",
    price: "₹999",
    duration: "month",
    description: "Enjoy essential services for one month",
    features: [
      "Access to standard repair services",
      "Covers top 5 products repairing",
      "Email & phone support",
    ],
    buttonText: "Your current plan",
    disabled: true,
    featured: false,
  },
  {
    title: "Plus",
    price: "₹1999",
    duration: "month",
    description: "Upgrade for more services and convenience",
    features: [
      "Everything in Basic",
      "Priority booking",
      "Discount on additional services",
      "Access to premium service partners",
    ],
    buttonText: "Get Plus",
    disabled: false,
    featured: true,
  },
  {
    title: "Premium",
    price: "₹4999",
    duration: "month",
    description: "Unlock all services with full benefits",
    features: [
      "Everything in Plus",
      "Unlimited product repairs",
      "Home care and maintenance",
      "24/7 support",
    ],
    buttonText: "Get Premium",
    disabled: false,
    featured: false,
  },
];

export default function Pricing() {
  return (
    <div className="pricing-root">
      <style>{CSS}</style>
      <div className="pricing-inner">

        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: T.bluePale, border: `1px solid #bcd0fa`,
            borderRadius: 999, padding: "5px 14px", fontSize: 11, fontWeight: 700,
            letterSpacing: "0.12em", textTransform: "uppercase", color: T.blue, marginBottom: 14,
          }}>
            <FiZap size={11} /> Membership Plans
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem,4vw,2.6rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.text, marginBottom: 10, lineHeight: 1.2 }}>
            Upgrade Your Plan —{" "}
            <span style={{ color: T.blue }}>Providers Membership</span>
          </h1>
          <p style={{ fontSize: 15, color: T.muted, maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Choose the perfect plan that fits your needs and get access to premium repair services.
          </p>
        </header>

        {/* Plans */}
        <div className="plan-grid">
          {plans.map((plan, i) => (
            <div key={i} className={`plan-card${plan.featured ? " featured" : ""}`}>

              {/* Popular badge */}
              {plan.featured && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  background: T.blue, color: "#fff",
                  fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "5px", textAlign: "center",
                }}>
                  Most Popular
                </div>
              )}

              <div style={{ paddingTop: plan.featured ? 18 : 0 }}>
                {/* Title */}
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: plan.featured ? T.blue : T.muted, marginBottom: 8 }}>
                  {plan.title}
                </p>

                {/* Price */}
                <div style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", color: T.text }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: T.muted }}>/{plan.duration}</span>
                </div>

                <p style={{ fontSize: 13, color: T.muted, marginBottom: 20, lineHeight: 1.55 }}>{plan.description}</p>

                {/* Divider */}
                <div style={{ height: 1, background: T.border, marginBottom: 18 }} />

                {/* Features */}
                <div style={{ display: "flex", flexDirection: "column", marginBottom: 24 }}>
                  {plan.features.map((f, j) => (
                    <div className="feature-row" key={j}>
                      <div className="check-icon"><FiCheck size={11} /></div>
                      {f}
                    </div>
                  ))}
                </div>

                <button
                  className={`plan-btn${plan.disabled ? "" : plan.featured ? " primary" : " outline"}`}
                  disabled={plan.disabled}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", fontSize: 13, color: T.muted, marginTop: 36 }}>
          Need help choosing?{" "}
          <a href="/contact" style={{ color: T.blue, textDecoration: "none", fontWeight: 600 }}>
            Contact our team →
          </a>
        </p>

      </div>
    </div>
  );
}