// GameStore.WebClient/src/components/games/OverviewSection.jsx
import { useMemo } from "react";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function OverviewSection({ game, setActiveTab, children }) {
  const { t } = useTranslation();

  const formattedReleaseDate = useMemo(
    () =>
      game?.releaseDate
        ? new Date(game.releaseDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",
    [game?.releaseDate],
  );

  const formattedShortDate = useMemo(
    () =>
      game?.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : "",
    [game?.releaseDate],
  );

  const genreNames = useMemo(
    () => game?.gameGenres?.map((g) => g.genre?.name).join(", ") || "-",
    [game?.gameGenres],
  );

  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 60 }}
      className="game-detail-grid"
    >
      {/* ── LEFT COLUMN: description + trailer + screenshots + info grid ── */}
      <div>
        {children}

        {/* Info Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {[
            { label: t("gameDetail.developer"), value: game.developer },
            { label: t("gameDetail.publisher"), value: game.publisher },
            {
              label: t("gameDetail.releaseDate"),
              value: formattedReleaseDate,
            },
            {
              label: t("gameDetail.platform"),
              value: t("gameDetail.windowsPc"),
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <p
                style={{
                  fontSize: 10,
                  color: "#666",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {label}
              </p>
              <p style={{ fontSize: 13, color: "#ccc" }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT COLUMN: Player Reviews + Game Info ── */}
      <div>
        {/* Player Reviews Summary */}
        <div
          style={{
            background: "#1e1e1e",
            borderRadius: 8,
            padding: 20,
            border: "1px solid #333",
            marginBottom: 20,
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("gameDetail.playerReviews")}
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "2px solid #f7b731",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{ fontSize: 20, fontWeight: 800, color: "#f7b731" }}
              >
                {game.rating?.toFixed(1)}
              </span>
            </div>
            <div>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    fill={s <= Math.round(game.rating) ? "#f7b731" : "none"}
                    color="#f7b731"
                  />
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                {t("gameDetail.reviewsCount", { count: game.ratingCount })}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("reviews")}
            style={{
              width: "100%",
              padding: "10px",
              background: "transparent",
              color: "#fff",
              border: "1px solid #444",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 1,
              whiteSpace: "nowrap",
            }}
          >
            {t("gameDetail.viewAllReviews")}
          </button>
        </div>

        {/* Game Info Card */}
        <div
          style={{
            background: "#1e1e1e",
            borderRadius: 8,
            padding: 20,
            border: "1px solid #333",
          }}
        >
          <h3
            style={{
              fontSize: 14,
              fontWeight: 700,
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("gameDetail.info")}
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              [t("gameDetail.genre"), genreNames],
              [t("gameDetail.releaseDate"), formattedShortDate],
              [t("gameDetail.platform"), t("gameDetail.windowsPc")],
              [t("gameDetail.developer"), game.developer || "-"],
              [t("gameDetail.publisher"), game.publisher || "-"],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
                <span
                  style={{
                    fontSize: 12,
                    color: "#ccc",
                    textAlign: "right",
                    maxWidth: 180,
                  }}
                >
                  {value || "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
