import { useContext, useState, useEffect, useRef } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ErrorToast } from "../Components/ErrorToast";
import {
  FiTrash2, FiX, FiCheck, FiClock, FiMapPin,
  FiHome, FiCalendar, FiChevronLeft, FiChevronRight,
  FiShoppingBag, FiPlus, FiMinus, FiTag, FiZap,
} from "react-icons/fi";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const T = {
  bg:        "#f0f4ff",
  bgWhite:   "#ffffff",
  bgSoft:    "#f8faff",
  blue:      "#2563eb",
  blueDark:  "#1d4ed8",
  blueDeep:  "#1e3a8a",
  bluePale:  "#eff4ff",
  blueLight: "#dbeafe",
  text:      "#0f172a",
  textMid:   "#334155",
  muted:     "#64748b",
  border:    "#e2e8f5",
  borderMid: "#cbd5e8",
  shadow:    "rgba(37,99,235,0.08)",
  shadowSm:  "rgba(0,0,0,0.05)",
  shadowMd:  "rgba(0,0,0,0.09)",
  green:     "#16a34a",
  greenPale: "#dcfce7",
  greenDark: "#15803d",
  red:       "#ef4444",
  redPale:   "#fef2f2",
  amber:     "#f59e0b",
  amberPale: "#fffbeb",
  indigo:    "#6366f1",
};

/* ─── Global CSS ─────────────────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .cart-root {
    font-family: 'Plus Jakarta Sans', sans-serif;
    background: ${T.bg};
    min-height: 100vh;
    color: ${T.text};
  }

  /* ── page wrapper ── */
  .cart-page {
    max-width: 1160px;
    margin: 0 auto;
    padding: 32px 20px 80px;
  }

  /* ── page header ── */
  .cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .cart-header-left { display: flex; align-items: center; gap: 14px; }
  .cart-header-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, ${T.blue}, ${T.blueDeep});
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 14px rgba(37,99,235,0.28);
    flex-shrink: 0;
  }
  .cart-title { font-size: 22px; font-weight: 800; color: ${T.text}; letter-spacing: -0.02em; }
  .cart-count {
    font-size: 12px; font-weight: 700;
    background: ${T.bluePale}; color: ${T.blue};
    border: 1px solid ${T.blueLight};
    padding: 3px 10px; border-radius: 999px;
  }

  /* ── two-col grid ── */
  .cart-grid {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 960px) {
    .cart-grid { grid-template-columns: 1fr; }
    .summary-sticky { position: static !important; }
  }

  /* ── section card ── */
  .section-card {
    background: ${T.bgWhite};
    border: 1px solid ${T.border};
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 16px ${T.shadowSm};
  }
  .section-head {
    padding: 16px 20px;
    border-bottom: 1px solid ${T.border};
    background: ${T.bgSoft};
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-head-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${T.blue}; flex-shrink: 0;
  }
  .section-head-title {
    font-size: 12px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: ${T.muted};
  }

  /* ── item card ── */
  .item-wrap {
    padding: 20px;
    border-bottom: 1px solid ${T.border};
    transition: background 0.15s;
  }
  .item-wrap:last-child { border-bottom: none; }
  .item-wrap:hover { background: #fafbff; }

  .item-inner { display: flex; gap: 16px; align-items: flex-start; }

  .item-img {
    width: 88px; height: 76px; object-fit: cover;
    border-radius: 12px; flex-shrink: 0;
    border: 1px solid ${T.border};
  }

  .item-body { flex: 1; min-width: 0; }
  .item-title { font-size: 15px; font-weight: 700; color: ${T.text}; margin-bottom: 3px; }
  .item-base-price { font-size: 12px; color: ${T.muted}; margin-bottom: 10px; }

  .item-footer {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-top: 10px;
  }
  .item-total { font-size: 18px; font-weight: 800; color: ${T.blue}; }
  .item-del {
    display: flex; align-items: center; gap: 5px;
    padding: 6px 12px; border-radius: 8px;
    border: 1px solid #fecaca; background: ${T.redPale};
    color: ${T.red}; font-size: 12px; font-weight: 600;
    cursor: pointer; font-family: inherit;
    transition: background 0.15s;
  }
  .item-del:hover { background: #fee2e2; }

  /* ── subservice chip ── */
  .sub-chip {
    display: flex; align-items: center; gap: 8px;
    border: 1px solid ${T.border}; border-radius: 10px;
    padding: 7px 10px; background: ${T.bgSoft};
    position: relative;
    transition: border-color 0.15s;
  }
  .sub-chip:hover { border-color: ${T.borderMid}; }
  .sub-chip-img {
    width: 34px; height: 34px; object-fit: cover;
    border-radius: 7px; flex-shrink: 0;
  }
  .sub-chip-remove {
    position: absolute; top: 4px; right: 4px;
    width: 18px; height: 18px; border-radius: 50%;
    background: ${T.red}; border: none;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #fff;
  }

  /* ── add-ons slider ── */
  .addons-card {
    background: ${T.bgWhite};
    border: 1px solid ${T.border};
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 16px ${T.shadowSm};
  }
  .addons-head {
    padding: 16px 20px 14px;
    display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid ${T.border};
    background: ${T.bgSoft};
  }
  .addons-body { padding: 16px 20px 20px; position: relative; }

  .scroll-row {
    display: flex; gap: 12px;
    overflow-x: auto; padding: 4px 2px 8px;
    scroll-behavior: smooth;
    scrollbar-width: thin;
    scrollbar-color: ${T.border} transparent;
  }
  .scroll-row::-webkit-scrollbar { height: 3px; }
  .scroll-row::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }

  .s-arrow {
    position: absolute; top: 50%; transform: translateY(-50%); z-index: 5;
    width: 30px; height: 30px; border-radius: 50%;
    background: ${T.bgWhite}; border: 1px solid ${T.border};
    box-shadow: 0 2px 8px ${T.shadowMd};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: ${T.blue};
    transition: background 0.15s, box-shadow 0.15s;
  }
  .s-arrow:hover { background: ${T.bluePale}; box-shadow: 0 4px 14px ${T.shadow}; }
  .s-arrow-left  { left: 4px; }
  .s-arrow-right { right: 4px; }

  .addon-card {
    min-width: 160px; max-width: 165px; flex-shrink: 0;
    background: ${T.bgWhite}; border: 1.5px solid ${T.border};
    border-radius: 14px; overflow: hidden; cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s, border-color 0.18s;
    position: relative;
  }
  .addon-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px ${T.shadow}; }
  .addon-card.selected {
    border-color: ${T.blue};
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
  }
  .addon-card-img { width: 100%; height: 86px; object-fit: cover; display: block; }
  .addon-card-body { padding: 10px 10px 12px; }
  .addon-card-title {
    font-size: 12px; font-weight: 700; color: ${T.text};
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-bottom: 3px;
  }
  .addon-card-price { font-size: 13px; font-weight: 800; color: ${T.blue}; }
  .addon-badge {
    position: absolute; top: 7px; left: 7px;
    background: ${T.blue}; color: #fff;
    font-size: 10px; font-weight: 700;
    border-radius: 5px; padding: 2px 7px;
  }
  .addon-remove-btn {
    position: absolute; top: 6px; right: 6px;
    background: ${T.red}; color: #fff; border: none;
    border-radius: 50%; width: 22px; height: 22px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 14px;
  }

  /* ── summary card ── */
  .summary-card {
    background: ${T.bgWhite};
    border: 1px solid ${T.border};
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 16px ${T.shadowSm};
    position: sticky;
    top: 24px;
  }
  .summary-hero {
    background: linear-gradient(140deg, ${T.blueDeep} 0%, ${T.blue} 100%);
    padding: 22px 22px 18px;
  }
  .summary-hero-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.55); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 4px; }
  .summary-hero-total { font-size: 32px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
  .summary-hero-sub { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 2px; }
  .summary-body { padding: 20px 22px; }

  .promo-banner {
    display: flex; align-items: center; gap: 8px;
    background: ${T.greenPale}; border: 1px solid #bbf7d0;
    border-radius: 10px; padding: 10px 12px;
    margin-bottom: 18px;
  }

  .line-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0; font-size: 13px;
  }
  .line-label { color: ${T.muted}; }
  .line-val   { font-weight: 600; color: ${T.textMid}; }
  .line-green { color: ${T.green}; }
  .line-divider { border: none; border-top: 1px dashed ${T.border}; margin: 8px 0; }
  .line-total-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 0 0; font-size: 15px;
  }
  .line-total-label { font-weight: 700; color: ${T.text}; }
  .line-total-val   { font-size: 20px; font-weight: 800; color: ${T.blue}; }

  /* ── tip ── */
  .tip-section { margin: 18px 0; padding-top: 18px; border-top: 1px solid ${T.border}; }
  .tip-label { font-size: 12px; font-weight: 700; color: ${T.textMid}; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
  .tip-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; }
  .tip-btn {
    padding: 8px 4px; border-radius: 9px;
    border: 1px solid ${T.border};
    background: ${T.bgSoft}; color: ${T.textMid};
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: inherit;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .tip-btn.active { background: ${T.bluePale}; border-color: ${T.blue}; color: ${T.blue}; }
  .tip-btn:hover:not(.active) { border-color: ${T.borderMid}; }

  /* ── checkout btn ── */
  .checkout-btn {
    width: 100%; padding: 14px; border: none; border-radius: 12px;
    background: linear-gradient(135deg, ${T.blue}, ${T.blueDeep});
    color: #fff; font-size: 15px; font-weight: 700;
    font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 4px 18px rgba(37,99,235,0.30);
    margin-top: 18px;
  }
  .checkout-btn:hover { opacity: 0.92; transform: translateY(-1px); }
  .clear-btn {
    width: 100%; padding: 10px; border: 1px solid #fecaca; border-radius: 10px;
    background: transparent; color: ${T.red};
    font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s; margin-top: 8px;
  }
  .clear-btn:hover { background: ${T.redPale}; }

  /* ── trust badges ── */
  .trust-row {
    display: flex; justify-content: center; gap: 14px;
    padding-top: 14px; flex-wrap: wrap;
  }
  .trust-badge {
    display: flex; align-items: center; gap: 4px;
    font-size: 11px; color: ${T.muted}; font-weight: 500;
  }

  /* ── modal ── */
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 60; padding: 16px;
    backdrop-filter: blur(2px);
  }
  .modal-box {
    background: ${T.bgWhite}; border-radius: 22px;
    padding: 28px 26px; width: 100%; max-width: 500px;
    max-height: 92vh; overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,0.22);
    animation: modalIn 0.22s ease both;
  }
  @keyframes modalIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .modal-head {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 22px;
  }
  .modal-head-left { display: flex; align-items: center; gap: 10px; }
  .modal-head-icon {
    width: 36px; height: 36px; border-radius: 10px;
    background: ${T.greenPale};
    display: flex; align-items: center; justify-content: center;
  }
  .modal-close-btn {
    width: 32px; height: 32px; border-radius: 8px;
    background: ${T.bgSoft}; border: 1px solid ${T.border};
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: ${T.muted};
    transition: background 0.15s;
  }
  .modal-close-btn:hover { background: ${T.redPale}; color: ${T.red}; }

  /* ── form inputs ── */
  .form-label {
    font-size: 12px; font-weight: 700; color: ${T.textMid};
    display: flex; align-items: center; gap: 5px;
    margin-bottom: 6px;
  }
  .form-input {
    width: 100%; border: 1px solid ${T.border}; border-radius: 10px;
    padding: 10px 13px; font-size: 14px; font-family: inherit;
    color: ${T.text}; background: ${T.bgSoft}; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus { border-color: ${T.blue}; box-shadow: 0 0 0 3px rgba(37,99,235,0.10); background: ${T.bgWhite}; }
  .form-input.err { border-color: ${T.red}; }
  .err-msg { font-size: 11px; color: ${T.red}; margin-top: 3px; }

  /* ── address buttons ── */
  .addr-btn {
    width: 100%; border: 1px solid ${T.border}; border-radius: 10px;
    padding: 11px 14px; text-align: left; font-size: 13px; font-weight: 500;
    background: ${T.bgSoft}; color: ${T.textMid}; cursor: pointer;
    transition: border-color 0.15s, background 0.15s; font-family: inherit;
  }
  .addr-btn.active {
    border-color: ${T.blue}; background: ${T.bluePale};
    color: ${T.text}; box-shadow: 0 0 0 2px rgba(37,99,235,0.12);
  }
  .addr-btn:hover:not(.active) { border-color: #93c5fd; }

  /* ── date/time pickers ── */
  .date-btn {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
    padding: 10px 6px; border-radius: 10px; border: 1px solid ${T.border};
    background: ${T.bgSoft}; color: ${T.textMid};
    font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit;
    transition: all 0.15s;
  }
  .date-btn .day-num { font-size: 18px; font-weight: 800; }
  .date-btn.active { background: ${T.blue}; color: #fff; border-color: ${T.blue}; box-shadow: 0 4px 14px rgba(37,99,235,0.25); }
  .date-btn:hover:not(.active) { border-color: ${T.blue}; color: ${T.blue}; }

  .time-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
  .time-btn {
    padding: 8px 4px; border-radius: 8px; border: 1px solid ${T.border};
    background: ${T.bgSoft}; color: ${T.textMid};
    font-size: 11px; font-weight: 600; cursor: pointer; font-family: inherit;
    display: flex; flex-direction: column; align-items: center; gap: 1px;
    transition: all 0.15s;
  }
  .time-btn.active { background: ${T.blue}; color: #fff; border-color: ${T.blue}; }
  .time-btn:hover:not(.active) { background: ${T.bluePale}; border-color: ${T.blue}; }

  /* ── modal actions ── */
  .modal-actions { display: flex; gap: 10px; margin-top: 22px; }
  .modal-cancel {
    flex: 1; padding: 11px; background: ${T.bgSoft};
    border: 1px solid ${T.border}; border-radius: 10px;
    font-size: 13px; font-weight: 600; cursor: pointer;
    font-family: inherit; color: ${T.textMid};
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
  }
  .modal-cancel:hover { background: ${T.redPale}; border-color: #fecaca; color: ${T.red}; }
  .modal-confirm {
    flex: 1; padding: 11px; background: ${T.green};
    border: none; border-radius: 10px;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: inherit; color: #fff;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    transition: background 0.15s;
    box-shadow: 0 4px 14px rgba(22,163,74,0.25);
  }
  .modal-confirm:hover { background: ${T.greenDark}; }

  /* ── section divider ── */
  .modal-section-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: ${T.muted};
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 10px;
  }

  /* ── empty state ── */
  .empty-wrap {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; min-height: 60vh;
    padding: 24px; text-align: center;
  }
  .empty-icon {
    width: 80px; height: 80px; border-radius: 50%;
    background: ${T.bluePale}; border: 1px solid ${T.blueLight};
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 20px;
  }

  /* ── toast ── */
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(12px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
  .toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: ${T.bgWhite}; border: 1px solid ${T.greenPale};
    border-radius: 14px; padding: 14px 20px;
    display: flex; align-items: center; gap: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12); z-index: 70;
    animation: toastIn 0.25s ease both;
  }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    animation: spin 0.8s linear infinite;
  }

  /* ── mobile sticky checkout ── */
  .mobile-checkout-bar {
    display: none;
    position: fixed; bottom: 0; left: 0; right: 0;
    background: ${T.bgWhite}; border-top: 1px solid ${T.border};
    padding: 12px 16px;
    box-shadow: 0 -4px 20px ${T.shadowSm};
    z-index: 40;
  }
  @media (max-width: 960px) {
    .mobile-checkout-bar { display: block; }
    .desktop-checkout { display: none !important; }
    .cart-page { padding-bottom: 100px; }
  }
`;

/* ─── helpers ────────────────────────────────────────────────────────────────── */
const safeText = (v) => (typeof v === "string" || typeof v === "number" ? v : "");
const formatDateYMD  = (d) => d?.toISOString().split("T")[0] ?? "";
const formatTimeHM   = (d) => d?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) ?? "";
const getDisplayAddress = (a) => {
  const lm = a.landmark?.trim().toLowerCase();
  const hasLm = lm && lm !== "" && lm !== "resolved";
  return `${a.houseNumber}, ${a.street}${hasLm ? `, ${a.landmark}` : ""}${a.addressType ? ` (${a.addressType})` : ""}`;
};
const generateTimeSlots = (date) => {
  const slots = []; const today = new Date(); const base = new Date(date);
  const isToday = base.toDateString() === today.toDateString();
  let startHour = 8; const endHour = 19;
  if (isToday) {
    const now = new Date(); now.setMinutes(now.getMinutes() + 120);
    startHour = Math.max(startHour, now.getHours());
  }
  for (let h = startHour; h <= endHour; h++) {
    [0, 30].forEach((m) => {
      const s = new Date(base); s.setHours(h, m, 0, 0);
      const now2 = new Date(); now2.setMinutes(now2.getMinutes() + 120);
      if (!isToday || s > now2) slots.push(s);
    });
  }
  return slots;
};

/* ─── Main ───────────────────────────────────────────────────────────────────── */
export default function Cart() {
  const { cartItems, removeFromCart, clearCart, updateCartItem } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showModal, setShowModal]         = useState(false);
  const [isPlacing, setIsPlacing]         = useState(false);
  const [houseNumber, setHouseNumber]     = useState("");
  const [street, setStreet]               = useState("");
  const [landmark, setLandmark]           = useState("");
  const [addressType, setAddressType]     = useState("Home");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddrIdx, setSelectedAddrIdx] = useState(-1);
  const [selectedDate, setSelectedDate]   = useState(new Date());
  const [selectedTime, setSelectedTime]   = useState(null);
  const [errors, setErrors]               = useState({});
  const [error, setError]                 = useState(null);
  const [productSubs, setProductSubs]     = useState({});
  const [selectedTip, setSelectedTip]     = useState(null);
  const [customTip, setCustomTip]         = useState(0);
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [toastMsg, setToastMsg]           = useState("");
  const [showToast, setShowToast]         = useState(false);
  const sliderRef = useRef();
  const [carouselPage, setCarouselPage] = useState(0);


  /* totals */
  const subtotal = cartItems.reduce((acc, item) => {
    const extra = (item.subServices || []).reduce((s, sub) => s + Number(sub.price), 0);
    return acc + Number(item.price) + extra;
  }, 0);
  const discount  = subtotal * 0.15;
  const taxable   = subtotal - discount;
  const tax       = taxable * 0.18;
  const tipAmt    = selectedTip === "custom" ? customTip : (selectedTip || 0);
  const total     = taxable + tax + tipAmt;

  /* date options */
  const today       = new Date();
  const tomorrow    = new Date(today); tomorrow.setDate(today.getDate() + 1);
  const after       = new Date(today); after.setDate(today.getDate() + 2);
  const dateOptions = [today, tomorrow, after];
  const dateLabels  = ["Today", "Tomorrow", "Day after"];

  /* fetch sub-services for add-ons panel */
  useEffect(() => {
    async function load() {
      const r = {};
      for (const item of cartItems) {
        try {
          const res = await axios.get(`${BASE_URL}/api/products/${item.id}`);
          r[item.id] = Array.isArray(res.data?.subServices) ? res.data.subServices : [];
        } catch { 
          r[item.id] = []; 
          setError("Failed to load some service details.");
        }
      }
      setProductSubs(r);
    }
    if (cartItems.length) load();
  }, [cartItems]);

  /* saved addresses */
  useEffect(() => { if (showModal) fetchSaved(); }, [showModal]);
  const fetchSaved = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/users/addresses`, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } });
      setSavedAddresses(Array.isArray(res.data) ? res.data : []);
    } catch { 
      setSavedAddresses([]); 
      setError("Failed to load saved addresses.");
    }
  };

  /* sync address fields when saved addr selected */
  useEffect(() => {
    if (selectedAddrIdx >= 0 && savedAddresses[selectedAddrIdx]) {
      const a = savedAddresses[selectedAddrIdx];
      setHouseNumber(a.houseNumber || ""); setStreet(a.street || "");
      setLandmark(a.landmark || ""); setAddressType(a.addressType || "Home");
    }
    if (selectedAddrIdx === -1) { setHouseNumber(""); setStreet(""); setLandmark(""); setAddressType("Home"); }
  }, [selectedAddrIdx, savedAddresses]);

  /* toast */
  useEffect(() => {
    if (showToast) { const t = setTimeout(() => setShowToast(false), 3500); return () => clearTimeout(t); }
  }, [showToast]);

  const validate = () => {
    const e = {};
    if (!houseNumber.trim()) e.houseNumber = "Required";
    if (!street.trim())      e.street      = "Required";
    if (!selectedDate)       e.date        = "Select a date";
    if (!selectedTime)       e.time        = "Select a time slot";
    setErrors(e); return !Object.keys(e).length;
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation not supported."); return; }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json`);
        const data = await res.json(); const a = data.address || {};
        setHouseNumber(a.house_number || "");
        setStreet([a.road, a.neighbourhood, a.suburb, a.village, a.town, a.city].filter(Boolean).join(", "));
        setLandmark(a.state_district || a.state || ""); setAddressType("Home");
      } catch { alert("Failed to get address."); }
    }, () => alert("Location unavailable."));
  };

  const handleConfirm = () => {
    if (!validate()) return;
    const fullAddress = `${houseNumber}, ${street}${landmark ? `, Landmark: ${landmark}` : ""} (${addressType})`;
    const timeSlot    = `${formatDateYMD(selectedDate)} at ${formatTimeHM(selectedTime)}`;
    navigate("/payment", {
      state: {
        orderDetails: {
          items: cartItems, total,
          address: { houseNumber, street, landmark, addressType, fullAddress, timeSlot },
        },
      },
    });
  };

  const timeSlots = generateTimeSlots(selectedDate);

  /* ─── Empty cart ─────────────────────────────────────────────── */
  if (!cartItems.length) return (
    <div className="cart-root">
      <style>{CSS}</style>
      <div className="empty-wrap">
        <div className="empty-icon">
          <FiShoppingBag size={32} color={T.blue} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: T.text, marginBottom: 8 }}>Your cart is empty</h2>
        <p style={{ fontSize: 14, color: T.muted, marginBottom: 28 }}>Browse our services and add something you need.</p>
        <button
          onClick={() => navigate("/products")}
          style={{ padding: "12px 28px", background: `linear-gradient(135deg, ${T.blue}, ${T.blueDeep})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(37,99,235,0.28)" }}
        >
          Browse Services
        </button>
      </div>
    </div>
  );

  /* ─── Main render ─────────────────────────────────────────────── */
  return (
    <div className="cart-root">
      <style>{CSS}</style>

      <div className="cart-page">

        {/* ── Page header ───────────────────────────────────────── */}
        <div className="cart-header">
          <div className="cart-header-left">
            <div className="cart-header-icon">
              <FiShoppingBag size={20} color="#fff" />
            </div>
            <div>
              <h1 className="cart-title">Your Cart</h1>
              <p style={{ fontSize: 13, color: T.muted }}>Review your selections before checkout</p>
            </div>
          </div>
          <span className="cart-count">{cartItems.length} service{cartItems.length !== 1 ? "s" : ""}</span>
        </div>

        {/* ── Two-col grid ──────────────────────────────────────── */}
        <div className="cart-grid">

          {/* ══ LEFT — Items + Add-ons ══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Items list */}
            <div className="section-card">
              <div className="section-head">
                <div className="section-head-dot" />
                <span className="section-head-title">Selected Services</span>
              </div>

              {cartItems.map((item, idx) => {
                const subs     = Array.isArray(item.subServices) ? item.subServices : [];
                const subTotal = subs.reduce((a, s) => a + Number(s.price), 0);
                const itemTotal = Number(item.price) + subTotal;
                const imgSrc = item.imageUrl
                  ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${BASE_URL}/uploads/${item.imageUrl}`)
                  : (Array.isArray(item.images) && item.images[0] ? (item.images[0].startsWith('http') ? item.images[0] : `${BASE_URL}/uploads/${item.images[0]}`) : "/default-service.png");

                return (
                  <div className="item-wrap" key={item.id || idx}>
                    <div className="item-inner">
                      <img src={imgSrc} alt={item.title} className="item-img"
                        onError={e => { e.target.src = "/default-service.png"; }} />

                      <div className="item-body">
                        <p className="item-title">{safeText(item.title) || safeText(item.name)}</p>
                        <p className="item-base-price">Visiting price: ₹{item.price}</p>

                        {/* Selected sub-service chips */}
                        {subs.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                            {subs.map((sub, si) => (
                              <div className="sub-chip" key={sub._id || sub.name || si}>
                                <img
                                  src={sub.image ? (sub.image.startsWith('http') ? sub.image : `${BASE_URL}/uploads/${sub.image}`) : "/default-service.png"}
                                  alt={sub.name} className="sub-chip-img"
                                  onError={e => { e.target.src = "/default-service.png"; }}
                                />
                                <div>
                                  <p style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{sub.name || sub.title}</p>
                                  <p style={{ fontSize: 12, fontWeight: 700, color: T.green }}>₹{sub.price || 0}</p>
                                </div>
                                <button
                                  className="sub-chip-remove"
                                  onClick={() => updateCartItem({ ...item, subServices: subs.filter((_, i) => i !== si) })}
                                ><FiX size={10} /></button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="item-footer">
                          <div>
                            <p style={{ fontSize: 11, color: T.muted, marginBottom: 1 }}>Total</p>
                            <p className="item-total">₹{itemTotal}</p>
                          </div>
                          <button className="item-del" onClick={() => removeFromCart(item.id)}>
                            <FiTrash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add-ons slider */}
            {cartItems.length > 0 && (() => {
              const VISIBLE = 4;
              const allAddons = cartItems.flatMap((item) => {
                const allSubs = Array.isArray(productSubs[item.id]) ? productSubs[item.id] : [];
                const subs = Array.isArray(item.subServices) ? item.subServices : [];
                return allSubs.map((sub, si) => ({ sub, item, subs, key: item.id + "-" + si }));
              });

              if (!allAddons.length) return null;

              const totalPages = Math.ceil(allAddons.length / VISIBLE);
              const canPrev = carouselPage > 0;
              const canNext = (carouselPage + 1) * VISIBLE < allAddons.length;
              const pageItems = allAddons.slice(carouselPage * VISIBLE, (carouselPage + 1) * VISIBLE);

              return (
                <div className="addons-card">
                  {/* ── Header ── */}
                  <div className="addons-head">
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: T.amberPale, border: `1px solid #fde68a`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FiZap size={14} color={T.amber} />
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Available Add-ons</p>
                        <p style={{ fontSize: 11, color: T.muted }}>{allAddons.length} add-on{allAddons.length !== 1 ? "s" : ""} available</p>
                      </div>
                    </div>

                    {/* Pagination controls — only show when more than 4 addons */}
                    {allAddons.length > VISIBLE && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {/* Dot indicators */}
                        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                          {Array.from({ length: totalPages }).map((_, i) => (
                            <button key={i} onClick={() => setCarouselPage(i)} style={{
                              width: i === carouselPage ? 18 : 7, height: 7,
                              borderRadius: 999, border: "none",
                              background: i === carouselPage ? T.blue : T.border,
                              cursor: "pointer", padding: 0, transition: "all 0.2s",
                            }} />
                          ))}
                        </div>
                        {/* Prev */}
                        <button
                          onClick={() => setCarouselPage(p => Math.max(0, p - 1))}
                          disabled={!canPrev}
                          style={{
                            width: 30, height: 30, borderRadius: "50%",
                            border: `1px solid ${canPrev ? T.borderMid : T.border}`,
                            background: canPrev ? T.bgWhite : T.bgSoft,
                            color: canPrev ? T.blue : T.muted,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: canPrev ? "pointer" : "not-allowed", transition: "all 0.15s",
                          }}
                        ><FiChevronLeft size={14} /></button>
                        {/* Next */}
                        <button
                          onClick={() => setCarouselPage(p => Math.min(totalPages - 1, p + 1))}
                          disabled={!canNext}
                          style={{
                            width: 30, height: 30, borderRadius: "50%",
                            border: `1px solid ${canNext ? T.borderMid : T.border}`,
                            background: canNext ? T.blue : T.bgSoft,
                            color: canNext ? "#fff" : T.muted,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: canNext ? "pointer" : "not-allowed", transition: "all 0.15s",
                          }}
                        ><FiChevronRight size={14} /></button>
                      </div>
                    )}
                  </div>

                  {/* ── Grid ── */}
                  <div style={{ padding: "16px 20px 20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                      {pageItems.map(({ sub, item, subs, key }) => {
                        const inCart = subs.some(s =>
                          (s._id && sub._id && s._id === sub._id) ||
                          (s.name && sub.name && s.name === sub.name)
                        );
                        const toggle = () => {
                          if (inCart) updateCartItem({ ...item, subServices: subs.filter(s => !((s._id && sub._id && s._id === sub._id) || (s.name && sub.name && s.name === sub.name))) });
                          else updateCartItem({ ...item, subServices: [...subs, sub] });
                        };
                        return (
                          <div
                            key={key}
                            onClick={toggle}
                            style={{
                              background: T.bgWhite,
                              border: `1.5px solid ${inCart ? T.blue : T.border}`,
                              borderRadius: 14, overflow: "hidden", cursor: "pointer",
                              position: "relative",
                              boxShadow: inCart ? `0 0 0 3px rgba(37,99,235,0.12)` : "none",
                              transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; }}
                          >
                            <img
                              src={sub.image ? (sub.image.startsWith('http') ? sub.image : `${BASE_URL}/uploads/${sub.image}`) : "/default-service.png"}
                              alt={sub.name}
                              style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
                              onError={e => { e.target.src = "/default-service.png"; }}
                            />
                            <div style={{ padding: "10px 10px 12px" }}>
                              <p style={{ fontSize: 12, fontWeight: 700, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>
                                {sub.name || sub.title}
                              </p>
                              <p style={{ fontSize: 13, fontWeight: 800, color: T.blue }}>₹{sub.price || 0}</p>
                            </div>
                            {inCart && <span style={{ position: "absolute", top: 7, left: 7, background: T.blue, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px" }}>Added</span>}
                            {inCart && (
                              <button onClick={e => { e.stopPropagation(); toggle(); }}
                                style={{ position: "absolute", top: 6, right: 6, background: T.red, color: "#fff", border: "none", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}
                              >×</button>
                            )}
                          </div>
                        );
                      })}

                      {/* Ghost placeholders to keep grid stable on last page */}
                      {Array.from({ length: VISIBLE - pageItems.length }).map((_, i) => (
                        <div key={"ghost-" + i} style={{ borderRadius: 14, background: T.bgSoft, border: `1px dashed ${T.border}`, minHeight: 150, opacity: 0.4 }} />
                      ))}
                    </div>

                    {allAddons.length > VISIBLE && (
                      <p style={{ fontSize: 11, color: T.muted, textAlign: "center", marginTop: 12 }}>
                        Showing {carouselPage * VISIBLE + 1}–{Math.min((carouselPage + 1) * VISIBLE, allAddons.length)} of {allAddons.length} add-ons
                      </p>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* ══ RIGHT — Summary ══ */}
          <div className="summary-card summary-sticky">

            {/* Hero band */}
            <div className="summary-hero">
              <p className="summary-hero-label">Order total</p>
              <p className="summary-hero-total">₹{total.toFixed(2)}</p>
              <p className="summary-hero-sub">incl. taxes & fees</p>
            </div>

            <div className="summary-body">

              {/* Promo banner */}
              <div className="promo-banner">
                <FiTag size={14} color={T.green} style={{ flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: T.greenDark }}>15% discount applied!</p>
                  <p style={{ fontSize: 11, color: T.green }}>You're saving ₹{discount.toFixed(2)} on this order</p>
                </div>
              </div>

              {/* Line items */}
              <div className="line-row"><span className="line-label">Item subtotal</span><span className="line-val">₹{subtotal.toFixed(2)}</span></div>
              <div className="line-row"><span className="line-label">15% discount</span><span className="line-val line-green">−₹{discount.toFixed(2)}</span></div>
              <div className="line-row"><span className="line-label">Taxes & fees (18%)</span><span className="line-val">₹{tax.toFixed(2)}</span></div>
              {tipAmt > 0 && <div className="line-row"><span className="line-label">Tip</span><span className="line-val">₹{tipAmt.toFixed(2)}</span></div>}
              <hr className="line-divider" />
              <div className="line-total-row">
                <span className="line-total-label">Total</span>
                <span className="line-total-val">₹{total.toFixed(2)}</span>
              </div>

              {/* Tip */}
              <div className="tip-section">
                <p className="tip-label">
                  <span>💝</span> Tip your professional
                </p>
                <div className="tip-grid">
                  {[50, 75, 100].map(t => (
                    <button key={t} className={`tip-btn${selectedTip === t ? " active" : ""}`} onClick={() => { setSelectedTip(t); setShowCustomTip(false); }}>
                      ₹{t}
                    </button>
                  ))}
                  <button className={`tip-btn${selectedTip === "custom" ? " active" : ""}`} onClick={() => { setSelectedTip("custom"); setShowCustomTip(true); }}>
                    Custom
                  </button>
                </div>
                {showCustomTip && (
                  <input type="number" min={0} className="form-input" style={{ marginTop: 8 }}
                    placeholder="Enter amount" value={customTip}
                    onChange={e => setCustomTip(Number(e.target.value))} />
                )}
                <p style={{ fontSize: 11, color: T.muted, marginTop: 6 }}>100% goes directly to your professional.</p>
              </div>

              {/* CTA */}
              <button className="checkout-btn desktop-checkout" onClick={() => { if (!isAuthenticated) { navigate("/login"); return; } setShowModal(true); }}>
                <FiCheck size={16} /> Proceed to Checkout
              </button>
              <button className="clear-btn" onClick={clearCart}>
                <FiTrash2 size={14} /> Clear Cart
              </button>

              {/* Trust badges */}
              <div className="trust-row">
                <span className="trust-badge"><FiCheck size={11} style={{ color: T.green }} /> Secure</span>
                <span className="trust-badge"><FiCheck size={11} style={{ color: T.blue }} /> Encrypted</span>
                <span className="trust-badge"><FiCheck size={11} style={{ color: T.muted }} /> PCI Safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky checkout */}
      <div className="mobile-checkout-bar">
        <button className="checkout-btn" style={{ margin: 0 }} onClick={() => { if (!isAuthenticated) { navigate("/login"); return; } setShowModal(true); }}>
          <FiCheck size={16} /> Checkout — ₹{total.toFixed(2)}
        </button>
      </div>

      {/* ══ Confirmation Modal ══ */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-box">

            <div className="modal-head">
              <div className="modal-head-left">
                <div className="modal-head-icon">
                  <FiMapPin size={17} color={T.green} />
                </div>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: T.text }}>Confirm Your Order</h2>
                  <p style={{ fontSize: 12, color: T.muted }}>Set delivery address & time slot</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}><FiX size={16} /></button>
            </div>

            {/* Saved addresses */}
            {savedAddresses.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p className="modal-section-label"><FiMapPin size={12} /> Saved addresses</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {savedAddresses.map((a, i) => (
                    <button key={i} className={`addr-btn${selectedAddrIdx === i ? " active" : ""}`} onClick={() => setSelectedAddrIdx(i)}>
                      {getDisplayAddress(a)}
                    </button>
                  ))}
                  <button className={`addr-btn${selectedAddrIdx === -1 ? " active" : ""}`} onClick={() => setSelectedAddrIdx(-1)}>
                    <span style={{ color: T.blue, fontWeight: 700 }}>+</span> Enter new address
                  </button>
                </div>
              </div>
            )}

            {/* Address form */}
            {selectedAddrIdx === -1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label className="form-label" style={{ marginBottom: 0 }}><FiHome size={12} /> Flat / House No. *</label>
                    <button type="button" onClick={handleUseLocation} style={{ fontSize: 11, fontWeight: 600, color: T.blue, background: T.bluePale, border: `1px solid ${T.blueLight}`, borderRadius: 7, padding: "4px 10px", cursor: "pointer", fontFamily: "inherit" }}>
                      📍 Use my location
                    </button>
                  </div>
                  <input type="text" value={houseNumber} onChange={e => setHouseNumber(e.target.value)} className={`form-input${errors.houseNumber ? " err" : ""}`} placeholder="Flat/House number" />
                  {errors.houseNumber && <p className="err-msg">{errors.houseNumber}</p>}
                </div>
                <div>
                  <label className="form-label"><FiMapPin size={12} /> Street / Colony *</label>
                  <input type="text" value={street} onChange={e => setStreet(e.target.value)} className={`form-input${errors.street ? " err" : ""}`} placeholder="Street or colony name" />
                  {errors.street && <p className="err-msg">{errors.street}</p>}
                </div>
                <div>
                  <label className="form-label"><FiMapPin size={12} /> Landmark <span style={{ fontSize: 10, color: T.muted, fontWeight: 400 }}>(optional)</span></label>
                  <input type="text" value={landmark} onChange={e => setLandmark(e.target.value)} className="form-input" placeholder="Nearby landmark" />
                </div>
                <div>
                  <label className="form-label"><FiHome size={12} /> Address type</label>
                  <select value={addressType} onChange={e => setAddressType(e.target.value)} className="form-input">
                    <option>Home</option><option>Office</option><option>Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Date */}
            <div style={{ marginBottom: 18 }}>
              <p className="modal-section-label"><FiCalendar size={12} /> Select date *</p>
              <div style={{ display: "flex", gap: 8 }}>
                {dateOptions.map((d, i) => (
                  <button key={i} className={`date-btn${selectedDate.toDateString() === d.toDateString() ? " active" : ""}`}
                    onClick={() => { setSelectedDate(new Date(d)); setSelectedTime(null); }}>
                    <span className="day-num">{d.getDate()}</span>
                    <span>{dateLabels[i]}</span>
                  </button>
                ))}
              </div>
              {errors.date && <p className="err-msg" style={{ marginTop: 4 }}>{errors.date}</p>}
            </div>

            {/* Time */}
            <div style={{ marginBottom: 4 }}>
              <p className="modal-section-label"><FiClock size={12} /> Select time slot *</p>
              {!timeSlots.length ? (
                <p style={{ fontSize: 12, color: T.muted, fontStyle: "italic" }}>No slots available — try another date.</p>
              ) : (
                <div className="time-grid">
                  {timeSlots.map((slot, i) => (
                    <button key={i} className={`time-btn${selectedTime && slot.getTime() === selectedTime.getTime() ? " active" : ""}`}
                      onClick={() => setSelectedTime(slot)}>
                      <span style={{ fontWeight: 700 }}>{formatTimeHM(slot)}</span>
                      <span style={{ fontSize: 10, opacity: 0.65 }}>~1hr</span>
                    </button>
                  ))}
                </div>
              )}
              {errors.time && <p className="err-msg" style={{ marginTop: 4 }}>{errors.time}</p>}
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setShowModal(false)} disabled={isPlacing}>
                <FiX size={14} /> Cancel
              </button>
              <button className="modal-confirm" onClick={handleConfirm} disabled={isPlacing}>
                {isPlacing
                  ? <><div className="spinner" /> Placing…</>
                  : <><FiCheck size={14} /> Confirm Order</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {showToast && (
        <div className="toast">
          <FiCheck size={18} color={T.green} />
          <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{toastMsg}</span>
        </div>
      )}
      {error && <ErrorToast message={error} onClose={() => setError(null)} />}
    </div>
  );
}