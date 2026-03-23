import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const T = {
  bg: "#ffffff", border: "#dde5f4", blue: "#2563eb", blueDark: "#1d4ed8",
  bluePale: "#eff4ff", text: "#0f172a", textMid: "#334155", muted: "#64748b", bgSoft: "#f8faff",
};

const CSS = `
  .nav-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: ${T.bg}; border-bottom: 1px solid ${T.border};
    position: sticky; top: 0; z-index: 50;
    box-shadow: 0 1px 12px rgba(37,99,235,0.07);
  }
  .nav-inner {
    max-width: 1200px; margin: 0 auto; padding: 0 20px; height: 62px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .nav-left  { display: flex; align-items: center; gap: 28px; }
  .nav-right { display: flex; align-items: center; gap: 6px; }

  .nav-link {
    font-size: 14px; font-weight: 500; color: ${T.textMid};
    text-decoration: none; padding: 6px 10px; border-radius: 7px;
    transition: background 0.15s, color 0.15s;
  }
  .nav-link:hover { background: ${T.bluePale}; color: ${T.blue}; }
  .nav-links-desktop { display: flex; align-items: center; gap: 2px; }
  @media(max-width:768px){ .nav-links-desktop,.nav-location,.nav-sep,.auth-desktop,.user-desktop{ display:none!important; } }

  .nav-location {
    display: flex; align-items: center; gap: 5px; font-size: 13px; color: ${T.muted};
    cursor: pointer; padding: 5px 10px; border-radius: 7px;
    transition: background 0.15s, color 0.15s; border: 1px solid transparent;
  }
  .nav-location:hover { background: ${T.bluePale}; color: ${T.blue}; border-color: #bcd0fa; }

  .nav-cart {
    position: relative; padding: 7px; border-radius: 8px;
    color: ${T.textMid}; transition: background 0.15s, color 0.15s; text-decoration: none;
  }
  .nav-cart:hover { background: ${T.bluePale}; color: ${T.blue}; }
  .cart-badge {
    position: absolute; top: -2px; right: -2px;
    background: #ef4444; color: #fff; font-size: 9px; font-weight: 700;
    width: 17px; height: 17px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; border: 2px solid #fff;
  }

  .btn-login {
    font-size: 13px; font-weight: 600; color: #fff; background: ${T.blue};
    border: none; border-radius: 8px; padding: 7px 16px; cursor: pointer;
    text-decoration: none; transition: background 0.15s; font-family: inherit;
  }
  .btn-login:hover { background: ${T.blueDark}; }
  .btn-signup {
    font-size: 13px; font-weight: 600; color: ${T.textMid}; background: ${T.bg};
    border: 1px solid ${T.border}; border-radius: 8px; padding: 7px 16px; cursor: pointer;
    text-decoration: none; transition: border-color 0.15s, color 0.15s; font-family: inherit;
  }
  .btn-signup:hover { border-color: ${T.blue}; color: ${T.blue}; }

  .nav-greeting { font-size: 13px; color: ${T.muted}; padding: 0 4px; }
  .nav-orders {
    font-size: 13px; font-weight: 500; color: ${T.blue};
    text-decoration: none; padding: 5px 8px; border-radius: 7px; transition: background 0.15s;
  }
  .nav-orders:hover { background: ${T.bluePale}; }
  .btn-logout {
    font-size: 13px; font-weight: 500; color: ${T.muted}; background: none; border: none;
    cursor: pointer; padding: 5px 8px; border-radius: 7px;
    transition: background 0.15s, color 0.15s; font-family: inherit;
  }
  .btn-logout:hover { background: #fef2f2; color: #dc2626; }
  .nav-profile {
    width: 34px; height: 34px; border-radius: 50%;
    background: ${T.bluePale}; border: 1px solid #bcd0fa;
    display: flex; align-items: center; justify-content: center;
    text-decoration: none; transition: background 0.15s; color: ${T.blue};
  }
  .nav-profile:hover { background: #dbeafe; }

  .nav-sep { width: 1px; height: 20px; background: ${T.border}; margin: 0 4px; }

  /* Hamburger */
  .nav-hamburger {
    display: none; background: none; border: 1px solid ${T.border};
    border-radius: 8px; padding: 6px; cursor: pointer; color: ${T.textMid};
    align-items: center; justify-content: center;
    transition: background 0.15s, color 0.15s;
  }
  .nav-hamburger:hover { background: ${T.bluePale}; color: ${T.blue}; border-color: #bcd0fa; }
  @media(max-width:768px){ .nav-hamburger{ display:flex; } }

  /* Mobile drawer */
  @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
  .mobile-menu {
    display: none; border-top: 1px solid ${T.border};
    background: ${T.bg}; padding: 12px 20px 18px;
    animation: slideDown 0.18s ease both;
  }
  .mobile-menu.open { display: block; }

  .mobile-link {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 9px; font-size: 14px; font-weight: 500; color: ${T.textMid};
    text-decoration: none; transition: background 0.15s, color 0.15s;
  }
  .mobile-link:hover { background: ${T.bluePale}; color: ${T.blue}; }

  .mobile-location {
    display: flex; align-items: center; gap: 8px; padding: 10px 12px;
    border-radius: 9px; cursor: pointer; font-size: 13px; color: ${T.muted};
    background: ${T.bgSoft}; border: 1px solid ${T.border}; margin-bottom: 8px;
    transition: border-color 0.15s;
  }
  .mobile-location:hover { border-color: ${T.blue}; }

  .mobile-divider { height: 1px; background: ${T.border}; margin: 8px 0; }
  .mobile-auth-row { display: flex; gap: 8px; margin-top: 6px; }
  .mobile-auth-row a { flex: 1; text-align: center; }
`;

export default function Navbar() {
  const { cartItems } = useContext(CartContext);
  const { isAuthenticated, logout, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [location, setLocation] = useState(user?.location || "Detecting...");
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !user?.location) {
      setIsLocationLoading(true);
      navigator.geolocation?.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const address = data?.display_name?.split(",")[0] || "Your Location";
            setLocation(address);
            await axios.put(`${BASE_URL}/api/users/location`, { location: address }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
            setUser((prev) => ({ ...prev, location: address }));
          } catch { setLocation("Location unavailable"); }
          finally { setIsLocationLoading(false); }
        },
        () => { setLocation("Allow location access"); setIsLocationLoading(false); }
      );
    } else if (user?.location) { setLocation(user.location); }
  }, [isAuthenticated, user?.location]);

  const handleManualLocationChange = async () => {
    const newLocation = prompt("Enter your location:", location);
    if (newLocation && newLocation !== location) {
      try {
        setLocation(newLocation);
        await axios.put(`${BASE_URL}/api/users/location`, { location: newLocation }, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
        setUser((prev) => ({ ...prev, location: newLocation }));
      } catch (error) { console.error("Failed to update location:", error); setLocation(location); }
    }
  };

  const close = () => setMobileOpen(false);

  return (
    <nav className="nav-root">
      <style>{CSS}</style>

      {/* ── Main bar ── */}
      <div className="nav-inner">
        <div className="nav-left">
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }} onClick={close}>
            <img src={`${BASE_URL}/uploads/logo1.png`} alt="DDS Logo" style={{ height: 38, width: "auto", objectFit: "contain", display: "block" }} />
          </Link>
          <div className="nav-links-desktop">
            <Link to="/products" className="nav-link">Services</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
            <Link to="/blog" className="nav-link">Blogs</Link>

          </div>
        </div>

        <div className="nav-right">
          {isAuthenticated && (
            <>
              <div className="nav-location" onClick={handleManualLocationChange} title="Change location">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: T.blue, flexShrink: 0 }}>
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                <span style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {isLocationLoading ? "Detecting…" : location}
                </span>
              </div>
              <div className="nav-sep" />
            </>
          )}

          <Link to="/cart" className="nav-cart" onClick={close}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </Link>

          <div className="nav-sep" />

          {!isAuthenticated ? (
            <div className="auth-desktop" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Link to="/login" className="btn-login">Log in</Link>
              <Link to="/signup" className="btn-signup">Sign up</Link>
            </div>
          ) : (
            <div className="user-desktop" style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span className="nav-greeting">Hi, {user?.name}</span>
              <Link to="/my-orders" className="nav-orders">My Orders</Link>
              <button onClick={logout} className="btn-logout">Logout</button>
              <Link to="/profile" className="nav-profile"><FiUser size={16} /></Link>
            </div>
          )}

          <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <div className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {isAuthenticated && (
          <div className="mobile-location" onClick={() => { handleManualLocationChange(); close(); }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ color: T.blue, flexShrink: 0 }}>
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {isLocationLoading ? "Detecting…" : location}
            </span>
            <span style={{ fontSize: 11, color: T.muted, flexShrink: 0 }}>Tap to change</span>
          </div>
        )}

        <Link to="/products" className="mobile-link" onClick={close}>Services</Link>
        <Link to="/about" className="mobile-link" onClick={close}>About Us</Link>
        <Link to="/contact" className="mobile-link" onClick={close}>Contact Us</Link>

        <div className="mobile-divider" />

        {!isAuthenticated ? (
          <div className="mobile-auth-row">
            <Link to="/login" className="btn-login" onClick={close}>Log in</Link>
            <Link to="/signup" className="btn-signup" onClick={close}>Sign up</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ padding: "6px 12px", fontSize: 13, color: T.muted }}>Hi, {user?.name}</div>
            <Link to="/my-orders" className="mobile-link" onClick={close}>My Orders</Link>
            <Link to="/profile" className="mobile-link" onClick={close}><FiUser size={13} /> Profile</Link>
            <button onClick={() => { logout(); close(); }} style={{ marginTop: 4, padding: "10px 12px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#dc2626", cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%" }}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}