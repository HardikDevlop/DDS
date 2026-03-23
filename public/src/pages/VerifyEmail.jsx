import { useNavigate, useLocation } from "react-router-dom";
import { FiMail, FiCheckCircle } from "react-icons/fi";

const BASE_URL_VE = import.meta.env.VITE_API_BASE_URL;

const VE_CSS = `
  .ve-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    background: #f0f4ff; min-height: 100vh;
    display: flex; align-items: center; justify-content: center; padding: 24px 16px;
  }
  .ve-card {
    background: #ffffff; border: 1px solid #dde5f4;
    border-radius: 18px; overflow: hidden; width: 100%; max-width: 400px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  }
  .ve-header {
    background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
    padding: 28px 24px; text-align: center;
  }
  .ve-body { padding: 28px; }
  .ve-input {
    width: 100%; border: 1px solid #dde5f4; border-radius: 9px;
    padding: 12px 13px; font-size: 15px; font-family: inherit; letter-spacing: 0.15em;
    color: #0f172a; background: #f8faff; outline: none; box-sizing: border-box; text-align: center;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ve-input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); background: #fff; }
  .ve-btn {
    width: 100%; padding: 13px; border: none; border-radius: 10px;
    background: #2563eb; color: #fff;
    font-size: 14px; font-weight: 700; font-family: inherit; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background 0.15s; margin-top: 4px;
  }
  .ve-btn:hover { background: #1d4ed8; }
`;

export function VerifyEmail() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL_VE}/api/auth/verify-email`, { email, verificationCode: code });
      alert("Email verified! You can now login.");
      navigate("/login");
    } catch (err) {
      alert("Invalid verification code.");
    }
  };

  return (
    <div className="ve-root">
      <style>{VE_CSS}</style>
      <div className="ve-card">
        <div className="ve-header">
          <div style={{ width: 48, height: 48, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
            <FiMail size={20} color="#fff" />
          </div>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>Verify Your Email</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.72)" }}>
            {email ? <>Code sent to <strong style={{ color: "#fff" }}>{email}</strong></> : "Enter the verification code below."}
          </p>
        </div>

        <div className="ve-body">
          <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Verification Code</label>
              <input type="text" placeholder="Enter code" className="ve-input" required value={code} onChange={e => setCode(e.target.value)} />
              <p style={{ fontSize: 11, color: "#64748b", marginTop: 6, textAlign: "center" }}>Check your inbox for the 6-digit verification code.</p>
            </div>
            <button type="submit" className="ve-btn">
              <FiCheckCircle size={14} /> Verify Email
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;