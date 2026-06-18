import { useState, useEffect } from "react";
import {
  X,
  Wallet,
  CreditCard,
  ArrowUp,
  Clock,
  ArrowDown,
  ShoppingBag,
  RotateCcw,
  Activity,
} from "lucide-react";
import { userAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { formatVND } from "../../utils/format";
import { useTranslation } from "react-i18next";

const AMOUNTS = [10000, 20000, 50000, 100000, 200000, 500000];

const TX_TYPE_META = {
  TopUp: { icon: ArrowDown, color: "#4caf50", labelKey: "wallet.typeTopUp" },
  Purchase: {
    icon: ShoppingBag,
    color: "#e94560",
    labelKey: "wallet.typePurchase",
  },
  Refund: { icon: RotateCcw, color: "#ff9800", labelKey: "wallet.typeRefund" },
};

function TopUpTab({ user, setUser, onClose, t }) {
  const [amount, setAmount] = useState(50000);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleTopUp = async () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : amount;
    if (!finalAmount || finalAmount <= 0) return;

    setLoading(true);
    try {
      await userAPI.topUp(finalAmount);
      const walletRes = await userAPI.getWallet();
      const newWallet = walletRes.data?.balance || walletRes.data?.wallet || 0;

      const updatedUser = { ...user, wallet: newWallet };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage(
        `✅ ${t("wallet.success", { amount: formatVND(finalAmount) })}`,
      );
      setTimeout(() => onClose(), 1200);
    } catch {
      setMessage(`❌ ${t("wallet.failed")}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Current Balance */}
      <div
        style={{
          background: "linear-gradient(135deg, #0d1b2a, #1b2838)",
          borderRadius: 14,
          padding: "20px 24px",
          marginBottom: 20,
          textAlign: "center",
          border: "1px solid rgba(79,195,247,0.15)",
        }}
      >
        <p
          style={{
            color: "#8ab",
            fontSize: 12,
            marginBottom: 6,
            letterSpacing: 1,
            fontWeight: 600,
          }}
        >
          {t("wallet.balance")}
        </p>
        <p
          style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#4fc3f7",
            letterSpacing: 1,
          }}
        >
          {formatVND(user?.wallet)}
        </p>
      </div>

      {/* Quick Amounts */}
      <p
        style={{
          color: "#999",
          fontSize: 12,
          marginBottom: 10,
          fontWeight: 600,
        }}
      >
        {t("wallet.selectAmount")}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(90px, 1fr))",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {AMOUNTS.map((a) => {
          const selected = amount === a && !customAmount;
          return (
            <button
              key={a}
              onClick={() => {
                setAmount(a);
                setCustomAmount("");
              }}
              style={{
                padding: "10px 4px",
                borderRadius: 10,
                border: selected ? "2px solid #4fc3f7" : "1px solid #2a2a4a",
                background: selected ? "rgba(79,195,247,0.12)" : "#0d1117",
                color: selected ? "#4fc3f7" : "#aaa",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {formatVND(a)}
            </button>
          );
        })}
      </div>

      {/* Custom Amount */}
      <div style={{ marginBottom: 16, position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: 13,
            color: "#888",
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          ₫
        </span>
        <input
          type="number"
          placeholder={t("wallet.customAmount")}
          value={customAmount}
          onChange={(e) => {
            setCustomAmount(e.target.value);
            setAmount(0);
          }}
          style={{
            width: "100%",
            padding: "12px 14px 12px 40px",
            background: "#0d1117",
            border: customAmount ? "2px solid #4fc3f7" : "1px solid #2a2a4a",
            borderRadius: 10,
            color: "#fff",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>

      {/* Message */}
      {message && (
        <div
          style={{
            padding: 10,
            borderRadius: 8,
            marginBottom: 14,
            background: message.includes("✅")
              ? "rgba(76,175,80,0.12)"
              : "rgba(233,69,96,0.12)",
            color: message.includes("✅") ? "#4caf50" : "#e94560",
            fontSize: 13,
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
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {loading ? (
          <>
            <div
              style={{
                width: 16,
                height: 16,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                flexShrink: 0,
              }}
            />{" "}
            {t("wallet.processing")}
          </>
        ) : (
          <>
            <ArrowUp size={18} />
            {t("wallet.topUpButton", {
              amount: formatVND(customAmount || amount),
            })}
          </>
        )}
      </button>

      {/* Payment Methods */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 20,
          marginTop: 16,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#888",
            fontSize: 11,
          }}
        >
          <CreditCard size={13} /> {t("wallet.card")}
        </span>
      </div>
    </div>
  );
}

function HistoryTab({ t }) {
  const [txns, setTxns] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const pageSize = 15;

  const load = async (p) => {
    setLoading(true);
    try {
      const { data } = await userAPI.getTransactions(p, pageSize);
      const items = Array.isArray(data)
        ? data
        : data?.items || data?.data || [];
      if (p === 1) setTxns(items);
      else setTxns((prev) => [...prev, ...items]);
      setHasMore(items.length >= pageSize);
      setPage(p);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const getMeta = (type) =>
    TX_TYPE_META[type] || {
      icon: Activity,
      color: "#888",
      labelKey: "wallet.typeOther",
    };

  const filtered =
    typeFilter === "All" ? txns : txns.filter((t) => t.type === typeFilter);

  const typeFilters = [
    { key: "All", label: t("wallet.filterAll"), color: "#888" },
    { key: "TopUp", label: t("wallet.typeTopUp"), color: "#4caf50" },
    { key: "Purchase", label: t("wallet.typePurchase"), color: "#e94560" },
    { key: "Refund", label: t("wallet.typeRefund"), color: "#ff9800" },
  ];

  return (
    <div>
      {/* Type Filter */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        {typeFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => {
              setTypeFilter(f.key);
              setPage(1);
            }}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              border:
                typeFilter === f.key
                  ? `2px solid ${f.color}`
                  : "1px solid #2a2a4a",
              background: typeFilter === f.key ? `${f.color}18` : "transparent",
              color: typeFilter === f.key ? f.color : "#888",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Summary mini-row */}
      {txns.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 12,
            background: "#0d1117",
            borderRadius: 10,
            padding: "10px 14px",
            border: "1px solid #1e1e3a",
          }}
        >
          {["TopUp", "Purchase", "Refund"].map((type) => {
            const meta = getMeta(type);
            const total = txns
              .filter((t) => t.type === type)
              .reduce((s, t) => s + Math.abs(t.amount), 0);
            return (
              <div key={type} style={{ flex: 1, textAlign: "center" }}>
                <meta.icon
                  size={14}
                  color={meta.color}
                  style={{ marginBottom: 2 }}
                />
                <p style={{ fontSize: 12, fontWeight: 700, color: meta.color }}>
                  {formatVND(total)}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Transaction List */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
          maxHeight: 320,
          overflowY: "auto",
          paddingRight: 4,
        }}
      >
        {filtered.length === 0 && !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "30px 0",
              color: "#666",
              fontSize: 13,
            }}
          >
            <Clock size={32} style={{ marginBottom: 8, opacity: 0.4 }} />
            <p>
              {typeFilter === "All"
                ? t("wallet.noTransactions")
                : t("wallet.noFiltered")}
            </p>
          </div>
        )}

        {filtered.map((tx) => {
          const meta = getMeta(tx.type);
          const Icon = meta.icon;
          const isPositive = tx.type !== "Purchase";
          return (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                background: "#0d1117",
                border: "1px solid #1a1a2e",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${meta.color}18`,
                }}
              >
                <Icon size={16} color={meta.color} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0" }}>
                  {t(meta.labelKey)}
                </p>
                <p style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                  {new Date(tx.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: isPositive ? "#4caf50" : "#e94560",
                  }}
                >
                  {isPositive ? "+" : ""}
                  {formatVND(tx.amount)}
                </p>
                <p style={{ fontSize: 10, color: "#666" }}>
                  {t("wallet.balanceAfter")}: {formatVND(tx.balanceAfter)}
                </p>
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ textAlign: "center", padding: 16, color: "#888" }}>
            <div
              style={{
                width: 20,
                height: 20,
                border: "2px solid rgba(255,255,255,0.15)",
                borderTopColor: "#888",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto",
              }}
            />
          </div>
        )}

        {hasMore && !loading && (
          <button
            onClick={() => load(page + 1)}
            style={{
              padding: "8px",
              borderRadius: 8,
              marginTop: 4,
              background: "none",
              border: "1px solid #2a2a4a",
              color: "#888",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {t("wallet.loadMore")}
          </button>
        )}
      </div>
    </div>
  );
}

export default function WalletModal({ onClose, initialTab = "topup" }) {
  const { t } = useTranslation();
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState(initialTab);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ width: 460, padding: 0, overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px 24px 0",
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
            <Wallet size={22} color="#4fc3f7" /> {t("wallet.title")}
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

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            margin: "16px 24px 20px",
            background: "#0d1117",
            borderRadius: 10,
            padding: 3,
            border: "1px solid #1e1e3a",
          }}
        >
          <button
            onClick={() => setTab("topup")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: tab === "topup" ? "#4fc3f7" : "transparent",
              color: tab === "topup" ? "#fff" : "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <ArrowUp size={15} /> {t("wallet.topUp")}
          </button>
          <button
            onClick={() => setTab("history")}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: tab === "history" ? "#4fc3f7" : "transparent",
              color: tab === "history" ? "#fff" : "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
          >
            <Clock size={15} /> {t("wallet.history")}
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "0 24px 24px" }}>
          {tab === "topup" ? (
            <TopUpTab user={user} setUser={setUser} onClose={onClose} t={t} />
          ) : (
            <HistoryTab t={t} />
          )}
        </div>
      </div>
    </div>
  );
}
