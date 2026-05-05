// GameStore.WebClient/src/components/games/GameCard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Check } from "lucide-react";
import useCartStore from "../../stores/cartStore";
import { useAuth } from "../../contexts/AuthContext";
import { libraryAPI } from "../../services/api";

export default function GameCard({ game }) {
  const addItem = useCartStore((s) => s.addItem);
  // const hasItem = useCartStore((s) => s.hasItem);
  // const inCart = hasItem(game.id); // Kiểm tra đã trong giỏ chưa
  const { user } = useAuth();
  const [owned, setOwned] = useState(false);

  const discount = game.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0;

  // 🔍 Kiểm tra game đã mua chưa
  useEffect(() => {
    if (user && game.id) {
      libraryAPI
        .checkOwned(game.id)
        .then((res) => setOwned(res.data.owned))
        .catch(() => setOwned(false));
    }
  }, [user, game.id]);

  return (
    <div className="card" style={{ position: "relative" }}>
      {/* Discount Badge */}
      {discount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "var(--accent)",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 2,
            fontSize: 11,
            fontWeight: 700,
            zIndex: 2,
          }}
        >
          -{discount}%
        </div>
      )}

      {/* Owned Badge */}
      {owned && (
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "#4caf50",
            color: "#fff",
            padding: "2px 8px",
            borderRadius: 2,
            fontSize: 11,
            fontWeight: 700,
            zIndex: 2,
            display: "flex",
            alignItems: "center",
            gap: 3,
          }}
        >
          <Check size={12} /> OWNED
        </div>
      )}

      <Link to={`/game/${game.id}`}>
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: "#2a2a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {game.coverImageUrl ? (
            <img
              src={game.coverImageUrl}
              alt={game.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 40, opacity: 0.3 }}>🎮</span>
          )}
        </div>
      </Link>

      <div style={{ padding: 12 }}>
        <Link to={`/game/${game.id}`}>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#ddd",
              marginBottom: 4,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {game.title}
          </h4>
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "#888",
          }}
        >
          <span>{game.developer?.substring(0, 15)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Star size={12} fill="#ffd700" color="#ffd700" />
            {game.rating?.toFixed(1)}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <div>
            {game.discountPrice && (
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#555",
                  fontSize: 11,
                  marginRight: 4,
                }}
              >
                ${game.price?.toFixed(2)}
              </span>
            )}
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
              ${(game.discountPrice || game.price)?.toFixed(2)}
            </span>
          </div>

          {/* Nút: Owned / Add to Cart */}
          {owned ? (
            <button
              disabled
              style={{
                background: "#4caf5020",
                border: "1px solid #4caf50",
                borderRadius: 4,
                padding: "4px 10px",
                cursor: "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
              title="Already in your library"
            >
              <Check size={14} color="#4caf50" />
              <span style={{ color: "#4caf50", fontSize: 11, fontWeight: 600 }}>
                OWNED
              </span>
            </button>
          ) : (
            <button
              onClick={() => addItem(game)}
              style={{
                background: "var(--accent)",
                border: "none",
                borderRadius: 4,
                padding: "4px 10px",
                cursor: "pointer",
              }}
              title="Add to cart"
            >
              <ShoppingCart size={14} color="#fff" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
