// GameStore.WebClient/src/components/wallet/WalletModal.jsx
import { useState } from "react";
import { X, Wallet, CreditCard } from "lucide-react";
import { userAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { formatVND, formatVNDRaw } from "../../utils/format";

const AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

export default function WalletModal({ onClose }) {
  const [amount, setAmount] = useState(50000);
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

      setMessage(`✅ Đã nạp ${formatVND(finalAmount)}!`);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setMessage("❌ Nạp tiền thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ width: 440 }} onClick={(e) => e.stopPropagation()}>
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
            <Wallet size={24} color="#4fc3f7" /> Nạp tiền
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
            Số dư hiện tại
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: "#4fc3f7" }}>
            {formatVND(user?.wallet)}
          </p>
        </div>

        {/* Quick Amounts */}
        <p style={{ color: "#888", fontSize: 13, marginBottom: 10 }}>
          Chọn số tiền
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
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
              {formatVND(a)}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <div style={{ marginBottom: 20, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: 14, color: "#888", fontSize: 16, fontWeight: 600 }}>₫</span>
          <input
            type="number"
            placeholder="Nhập số tiền"
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
          className="btn btn-primary btn-block btn-lg"
        >
          {loading
            ? "Đang xử lý..."
            : `Nạp ${formatVND(customAmount || amount)}`}
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
            <CreditCard size={14} /> Thẻ
          </span>
        </div>
      </div>
    </div>
  );
}
