import { Link } from "react-router-dom";
import {
  FaFacebookF, FaTwitter, FaInstagram,
  FaWrench, FaHeadset, FaRegCopyright,
} from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";

const T = {
  bg: "#ffffff",
  bgSoft: "#f0f4ff",
  blue: "#2563eb",
  bluePale: "#eff4ff",
  text: "#0f172a",
  textMid: "#334155",
  muted: "#64748b",
  border: "#dde5f4",
};

const CSS = `
  .footer-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg};
    border-top: 1px solid ${T.border};
    color: ${T.textMid};
  }
  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 52px 20px 28px;
  }
  .footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 48px;
    margin-bottom: 40px;
  }
  @media (max-width: 768px) {
    .footer-grid { grid-template-columns: 1fr 1fr; gap: 28px; }
    .footer-brand { grid-column: 1 / -1; }
  }
  @media (max-width: 480px) {
    .footer-grid { grid-template-columns: 1fr; }
    .footer-brand { grid-column: auto; }
  }

  .footer-col-title {
    font-size: 11px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: ${T.text};
    margin: 0 0 16px; display: flex; align-items: center; gap: 7px;
  }
  .footer-col-title svg { color: ${T.blue}; }

  .footer-link {
    display: block; font-size: 14px; color: ${T.muted};
    text-decoration: none; padding: 4px 0;
    transition: color 0.15s;
  }
  .footer-link:hover { color: ${T.blue}; }

  .social-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: ${T.bgSoft}; border: 1px solid ${T.border};
    display: inline-flex; align-items: center; justify-content: center;
    color: ${T.muted}; text-decoration: none;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .social-btn:hover { background: ${T.bluePale}; color: ${T.blue}; border-color: #bcd0fa; }

  .footer-bar {
    border-top: 1px solid ${T.border};
    padding-top: 24px;
    display: flex; flex-wrap: wrap; align-items: center;
    justify-content: space-between; gap: 12px;
  }
  .footer-bar-link {
    font-size: 12px; color: ${T.muted}; text-decoration: none;
    transition: color 0.15s;
  }
  .footer-bar-link:hover { color: ${T.blue}; }
  .footer-copy { font-size: 12px; color: ${T.muted}; display: flex; align-items: center; gap: 5px; }
`;

export default function Footer() {
  return (
    <footer className="footer-root">
      <style>{CSS}</style>
      <div className="footer-inner">

        <div className="footer-grid">

          {/* ── Brand ── */}
          <div className="footer-brand">
            <h3 style={{ fontSize: 20, fontWeight: 800, color: T.text, margin: "0 0 10px", letterSpacing: "-0.01em" }}>
              DDS <span style={{ color: T.blue }}>Online</span>
            </h3>
            <p style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, marginBottom: 20, maxWidth: 280 }}>
              Premium home services at your doorstep. Quality professionals for all your needs.
            </p>

            {/* Social icons */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[
                { icon: <FaFacebookF size={13} />, label: "Facebook" },
                { icon: <FaTwitter  size={13} />, label: "youtube" },
                { icon: <FaInstagram size={13} />, label: "Instagram" },
              ].map(({ icon, label }) => (
                <Link to="https://www.instagram.com/ddsonline.in?utm_source=qr&igsh=MTN1cWJvcGtpZW4wbA==" key={label} className="social-btn" aria-label={label}>
                  {icon}
                </Link>
              ))}
            </div>

          
           
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h4 className="footer-col-title">
              <FaWrench size={11} /> Quick Links
            </h4>
            <nav style={{ display: "flex", flexDirection: "column" }}>
              <Link to="/products" className="footer-link">Our Services</Link>
              <Link to="/pricing" className="footer-link">Pricing</Link>
              <Link to="/blog" className="footer-link">Blog</Link>
            </nav>
          </div>

          {/* ── Support ── */}
          <div>
            <h4 className="footer-col-title">
              <FaHeadset size={12} /> Support
            </h4>
            <nav style={{ display: "flex", flexDirection: "column" }}>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
              <Link to="/privacypolicy" className="footer-link">Privacy Policy</Link>
            </nav>
            {/* Contact line */}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <a href="tel:+919999999999" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: T.muted, textDecoration: "none" }}>
                <FiPhone size={13} style={{ color: T.blue }} /> +91-919098268872
              </a>
              <a href="mailto:info@example.com" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: T.muted, textDecoration: "none" }}>
                <FiMail size={13} style={{ color: T.blue }} /> admin@ddsonline.in
              </a>
            </div>
          </div>

        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bar">
          <p className="footer-copy">
            <FaRegCopyright size={11} />
            {new Date().getFullYear()} DDS Online. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            <Link to="#" className="footer-bar-link">Privacy</Link>
            <Link to="#" className="footer-bar-link">Terms</Link>
            <Link to="#" className="footer-bar-link">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}