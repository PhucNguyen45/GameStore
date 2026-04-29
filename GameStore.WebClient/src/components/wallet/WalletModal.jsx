import { useState } from "react";
import { X, Wallet, DollarSign, CreditCard, Smartphone } from "lucide-react";
import { userAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const AMOUNTS = [10, 20, 50, 100, 200, 500];

export default function WalletModal({ onClose }) {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, setUser } = useAuth();

  const handleTopUp = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) return;

    setLoading(true);
    try {
      await userAPI.topUp(finalAmount);

      // Fetch wallet mới từ API thay vì tự cộng
      const walletRes = await userAPI.getWallet();
      const newWallet = walletRes.data?.balance || walletRes.data?.wallet || 0;

      const updatedUser = { ...user, wallet: newWallet };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage(`✅ Added $${finalAmount.toFixed(2)}!`);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setMessage("❌ Failed to top up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#16162a",
          borderRadius: 16,
          padding: 32,
          width: 440,
          border: "1px solid #2a2a4a",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 20,
              fontWeight: 700,
              color: "#fff",
            }}
          >
            <Wallet size={24} color="#4fc3f7" /> Top Up Wallet
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Current Balance */}
        <div
          style={{
            background: "#0a0a15",
            borderRadius: 10,
            padding: 16,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          <p style={{ color: "#888", fontSize: 13, marginBottom: 4 }}>
            Current Balance
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: "#4fc3f7" }}>
            ${user?.wallet?.toFixed(2) || "0.00"}
          </p>
        </div>

        {/* Quick Amounts */}
        <p style={{ color: "#888", fontSize: 13, marginBottom: 10 }}>
          Select Amount
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => {
                setAmount(a);
                setCustomAmount("");
              }}
              style={{
                padding: "12px",
                borderRadius: 10,
                border:
                  amount === a && !customAmount
                    ? "2px solid #4fc3f7"
                    : "2px solid #2a2a4a",
                background:
                  amount === a && !customAmount ? "#4fc3f720" : "#0a0a15",
                color: amount === a && !customAmount ? "#4fc3f7" : "#aaa",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <DollarSign size={14} style={{ verticalAlign: "middle" }} />
              {a}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div style={{ marginBottom: 20, position: "relative" }}>
          <DollarSign
            size={18}
            color="#888"
            style={{ position: "absolute", left: 14, top: 14 }}
          />
          <input
            type="number"
            placeholder="Custom amount"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setAmount(0);
            }}
            style={{
              width: "100%",
              padding: "14px 14px 14px 42px",
              background: "#0a0a15",
              border: customAmount ? "2px solid #4fc3f7" : "1px solid #2a2a4a",
              borderRadius: 10,
              color: "#fff",
              fontSize: 15,
              outline: "none",
            }}
          />
        </div>

        {/* Message */}
        {message && (
          <div
            style={{
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
              background: message.includes("✅") ? "#4caf5020" : "#e9456020",
              color: message.includes("✅") ? "#4caf50" : "#e94560",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}

        {/* Top Up Button */}
        <button
          onClick={handleTopUp}
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            background: "linear-gradient(135deg, #4fc3f7, #2196f3)",
            color: "#000",
            border: "none",
            borderRadius: 10,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {loading
            ? "Processing..."
            : `Top Up $${(customAmount || amount || 0).toFixed(2)}`}
        </button>

        {/* Payment Methods */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            marginTop: 20,
          }}
        >
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#888",
              fontSize: 12,
            }}
          >
            <CreditCard size={14} /> Card
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#888",
              fontSize: 12,
            }}
          >
            <Smartphone size={14} /> Mobile
          </span>
        </div>
      </div>
    </div>
  );
}
