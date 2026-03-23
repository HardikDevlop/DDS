import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FiHome, FiGrid, FiShoppingCart, FiClipboard, FiUser } from "react-icons/fi";

const NAV_ITEMS = [
  { key: "home", label: "Home", icon: FiHome, path: "/" },
  { key: "services", label: "Services", icon: FiGrid, path: "/products" },
  { key: "orders", label: "Orders", icon: FiClipboard, path: "/my-orders" },
  { key: "cart", label: "Cart", icon: FiShoppingCart, path: "/cart" },
  { key: "account", label: "Account", icon: FiUser, path: "/profile" },
];

const T = {
  bg: "#ffffff",
  border: "#dde5f4",
  blue: "#2563eb",
  bluePale: "#eff4ff",
  text: "#0f172a",
  muted: "#94a3b8",
};

const CSS = `
  .mob-nav {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    position: fixed; bottom: 0; left: 0; right: 0; z-index: 40;
    background: ${T.bg};
    border-top: 1px solid ${T.border};
    box-shadow: 0 -4px 20px rgba(15,23,42,0.07);
    padding: 6px 8px 10px;
  }
  @media(min-width:768px){ .mob-nav{ display:none; } }

  .mob-nav-inner {
    max-width: 520px; margin: 0 auto;
    display: flex; align-items: stretch; justify-content: space-between; gap: 4px;
  }

  .mob-nav-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 3px; padding: 6px 4px;
    background: none; border: none; cursor: pointer; font-family: inherit;
    border-radius: 10px; transition: background 0.15s; position: relative;
  }
  .mob-nav-btn:hover { background: ${T.bluePale}; }
  .mob-nav-btn.active { background: ${T.bluePale}; }

  .mob-nav-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    border: 1px solid transparent; transition: border-color 0.15s, background 0.15s;
    position: relative;
  }
  .mob-nav-btn.active .mob-nav-icon {
    border-color: ${T.blue};
    background: #dbeafe;
  }

  .mob-nav-label {
    font-size: 10px; font-weight: 500; line-height: 1;
    color: ${T.muted}; transition: color 0.15s;
  }
  .mob-nav-btn.active .mob-nav-label { color: ${T.blue}; font-weight: 700; }

  .mob-cart-badge {
    position: absolute; top: -4px; right: -4px;
    background: #ef4444; color: #fff;
    font-size: 9px; font-weight: 800;
    min-width: 16px; height: 16px; border-radius: 999px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 3px; border: 2px solid ${T.bg};
    line-height: 1;
  }

  /* active indicator dot */
  .mob-nav-btn.active::after {
    content: '';
    position: absolute; bottom: 2px;
    width: 4px; height: 4px; border-radius: 50%;
    background: ${T.blue};
  }
`;

const HIDDEN_ROUTES = ["/admin-login"];

export default function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  if (HIDDEN_ROUTES.includes(location.pathname)) return null;

  const activeKey = NAV_ITEMS.find(item =>
    item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path)
  )?.key;

  const cartCount = cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 0;

  return (
    <nav className="mob-nav">
      <style>{CSS}</style>
      <div className="mob-nav-inner">
        {NAV_ITEMS.map(({ key, label, icon: Icon, path }) => {
          const isActive = key === activeKey;
          const isCart = key === "cart";
          return (
            <button
              key={key}
              type="button"
              className={`mob-nav-btn${isActive ? " active" : ""}`}
              onClick={() => navigate(path)}
              aria-label={label}
            >
              <div className="mob-nav-icon">
                <Icon size={18} color={isActive ? T.blue : T.muted} />
                {isCart && cartCount > 0 && (
                  <span className="mob-cart-badge">{cartCount}</span>
                )}
              </div>
              <span className="mob-nav-label">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}