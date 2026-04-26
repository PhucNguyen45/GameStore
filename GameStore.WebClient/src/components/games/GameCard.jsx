import { Link } from "react-router-dom";
import { Star, ShoppingCart } from "lucide-react";
import useCartStore from "../../stores/cartStore";

export default function GameCard({ game }) {
  const addItem = useCartStore((s) => s.addItem);
  const discount = game.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0;

  return (
    <div className="card" style={{ position: "relative" }}>
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
            <Star size={12} fill="#ffd700" color="#ffd700" />{" "}
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
          <button
            onClick={() => addItem(game)}
            style={{
              background: "var(--accent)",
              border: "none",
              borderRadius: 4,
              padding: "4px 10px",
              cursor: "pointer",
            }}
          >
            <ShoppingCart size={14} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}
