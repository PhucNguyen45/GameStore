import { Link } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Gamepad2,
  Monitor,
  Cpu,
  HardDrive,
} from "lucide-react";
import useCartStore from "../../stores/cartStore";

export default function GameCard({ game }) {
  const addItem = useCartStore((s) => s.addItem);
  const finalPrice = game.discountPrice || game.price;
  const discount = game.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0;

  return (
    <div className="card" style={{ position: "relative" }}>
      {discount > 0 && (
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            background: "#e94560",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 12,
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
            height: 180,
            background: "linear-gradient(135deg, #1a1a3e, #2a2a5e)",
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
            <Gamepad2 size={48} color="#e94560" opacity={0.5} />
          )}
        </div>
      </Link>
      <div style={{ padding: 16 }}>
        <Link to={`/game/${game.id}`}>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 4,
              color: "#e0e0e0",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {game.title}
          </h3>
        </Link>
        <p style={{ fontSize: 12, color: "#6b6b8e", marginBottom: 8 }}>
          {game.developer || "Unknown Developer"}
        </p>

        {/* System Requirements Mini */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          {game.minimumOS && (
            <span
              style={{
                fontSize: 10,
                color: "#8b8b9e",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Monitor size={12} /> {game.minimumOS.substring(0, 12)}
            </span>
          )}
          {game.minimumProcessor && (
            <span
              style={{
                fontSize: 10,
                color: "#8b8b9e",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <Cpu size={12} /> {game.minimumProcessor.substring(0, 12)}
            </span>
          )}
          {game.minimumStorage && (
            <span
              style={{
                fontSize: 10,
                color: "#8b8b9e",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              <HardDrive size={12} /> {game.minimumStorage}
            </span>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            {game.discountPrice && (
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#555",
                  fontSize: 12,
                  marginRight: 6,
                }}
              >
                ${game.price?.toFixed(2)}
              </span>
            )}
            <span style={{ color: "#e94560", fontWeight: 700, fontSize: 16 }}>
              ${finalPrice?.toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#ffd700",
              fontSize: 13,
            }}
          >
            <Star size={14} fill="#ffd700" /> {game.rating?.toFixed(1) || "0.0"}
          </div>
        </div>
        <button
          className="btn-primary"
          onClick={() => addItem(game)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
