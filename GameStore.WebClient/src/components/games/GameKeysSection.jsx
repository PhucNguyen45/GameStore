// GameStore.WebClient/src/components/games/GameKeysSection.jsx
import { KeyRound, Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function GameKeysSection({ user, owned, gameKeys, keysLoading, handleBuyNow }) {
  const { t } = useTranslation();

  const copyKey = async (keyCode) => {
    try {
      await navigator.clipboard.writeText(keyCode);
      toast.success(t("gameDetail.keyCopied") || "Đã sao chép key!");
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>
          {t("gameDetail.gameKeys")}
        </h2>
        {gameKeys.length > 0 && (
          <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600, background: "#10b98115", padding: "4px 12px", borderRadius: 20 }}>
            {gameKeys.length} {t("gameDetail.keysAvailable")}
          </span>
        )}
      </div>

      {!user ? (
        <div style={{ textAlign: "center", padding: 60, background: "#1e1e1e", borderRadius: 8, border: "1px solid #333" }}>
          <KeyRound size={48} color="#444" />
          <p style={{ color: "#888", marginTop: 16, fontSize: 14 }}>{t("gameDetail.loginToViewKeys")}</p>
        </div>
      ) : !owned ? (
        <div style={{ textAlign: "center", padding: 60, background: "#1e1e1e", borderRadius: 8, border: "1px solid #333" }}>
          <KeyRound size={48} color="#444" />
          <p style={{ color: "#888", marginTop: 16, fontSize: 14 }}>{t("gameDetail.buyToGetKeys")}</p>
          <button
            onClick={handleBuyNow}
            className="btn btn-primary"
            style={{ marginTop: 16, padding: "10px 24px", fontSize: 12, letterSpacing: 1, whiteSpace: "nowrap" }}
          >
            {t("gameDetail.buyNow")}
          </button>
        </div>
      ) : keysLoading ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <div style={{ width: 40, height: 40, border: "3px solid #333", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
          <p style={{ color: "#888" }}>{t("common.loading")}</p>
        </div>
      ) : gameKeys.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, background: "#1e1e1e", borderRadius: 8, border: "1px solid #333" }}>
          <KeyRound size={48} color="#444" />
          <h3 style={{ color: "#fff", marginTop: 16, fontSize: 16 }}>{t("gameDetail.noKeysYet")}</h3>
          <p style={{ color: "#888", marginTop: 8, fontSize: 14 }}>{t("gameDetail.waitForDelivery")}</p>
        </div>
      ) : (
        <div style={{ background: "#1e1e1e", borderRadius: 8, border: "1px solid #333", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #333" }}>
                <th style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
                  {t("gameDetail.keyCode")}
                </th>
                <th style={{ padding: "14px 20px", textAlign: "center", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
                  {t("gameDetail.status")}
                </th>
                <th style={{ padding: "14px 20px", textAlign: "right", fontSize: 11, color: "#888", textTransform: "uppercase", letterSpacing: 1 }}>
                  {t("gameDetail.acquired")}
                </th>
              </tr>
            </thead>
            <tbody>
              {gameKeys.map((key, i) => (
                <tr
                  key={key.id}
                  style={{ borderBottom: i < gameKeys.length - 1 ? "1px solid #2a2a2a" : "none" }}
                >
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#10b981",
                          background: "#10b98111",
                          padding: "4px 10px",
                          borderRadius: 4,
                          letterSpacing: 1,
                          userSelect: "all",
                        }}
                      >
                        {key.keyCode}
                      </span>
                      <button
                        onClick={() => copyKey(key.keyCode)}
                        title="Copy key"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: 6,
                          border: "1px solid #333",
                          background: "#2a2a2a",
                          color: "#aaa",
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#333";
                          e.currentTarget.style.color = "#fff";
                          e.currentTarget.style.borderColor = "#10b981";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#2a2a2a";
                          e.currentTarget.style.color = "#aaa";
                          e.currentTarget.style.borderColor = "#333";
                        }}
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "center" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                        fontWeight: 600,
                        color: key.isUsed ? "#888" : "#10b981",
                      }}
                    >
                      <Check size={14} />
                      {key.isUsed ? t("gameDetail.used") : t("gameDetail.active")}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "right", fontSize: 12, color: "#888" }}>
                    {new Date(key.acquiredAt || key.usedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
