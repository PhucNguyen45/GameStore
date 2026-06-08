// GameStore.WebClient/src/components/games/GameCard.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingCart, Check, Heart } from "lucide-react";
import useCartStore from "../../stores/cartStore";
import { useAuth } from "../../contexts/AuthContext";
import { libraryAPI, wishlistAPI } from "../../services/api";
import { formatVND } from "../../utils/format";

export default function GameCard({ game }) {
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuth();
  const [owned, setOwned] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const discount = game.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0;

  useEffect(() => {
    if (user && game.id) {
      libraryAPI
        .checkOwned(game.id)
        .then((res) => setOwned(res.data.owned))
        .catch(() => setOwned(false));
      wishlistAPI
        .check(game.id)
        .then((res) => setWishlisted(res.data.isWishlisted))
        .catch(() => setWishlisted(false));
    }
  }, [user, game.id]);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (wishlisted) {
        await wishlistAPI.remove(game.id);
        setWishlisted(false);
      } else {
        await wishlistAPI.add(game.id);
        setWishlisted(true);
      }
    } catch {}
  };

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
          <Check size={12} /> ĐÃ SỞ HỮU
        </div>
      )}
      {/* Wishlist heart */}
      <button
        onClick={toggleWishlist}
        style={{
          position: "absolute",
          top: 8,
          right: owned ? 80 : 8,
          zIndex: 2,
          background: wishlisted ? "#e94560" : "rgba(0,0,0,0.5)",
          border: "none",
          borderRadius: "50%",
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <Heart size={14} fill={wishlisted ? "#fff" : "none"} color="#fff" />
      </button>

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
                {formatVND(game.price)}
              </span>
            )}
            <span style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>
              {formatVND(game.discountPrice || game.price)}
            </span>
          </div>
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
            >
              <Check size={14} color="#4caf50" />
              <span style={{ color: "#4caf50", fontSize: 11, fontWeight: 600 }}>
                ĐÃ MUA
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
            >
              <ShoppingCart size={14} color="#fff" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
