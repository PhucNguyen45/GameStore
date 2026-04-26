import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { gameAPI } from "../services/api";
import useCartStore from "../stores/cartStore";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  Star,
  ShoppingCart,
  Monitor,
  Cpu,
  HardDrive,
  Gamepad2,
  Tag,
  ArrowLeft,
  Heart,
  Share2,
  Clock,
  Globe,
  Users,
} from "lucide-react";

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  useEffect(() => {
    gameAPI
      .getById(id)
      .then((res) => setGame(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Please login to purchase");
      navigate("/login");
      return;
    }
    addItem(game);
    navigate("/cart");
  };

  const handleAddToCart = () => {
    addItem(game);
    toast.success(`${game.title} added to cart!`, {
      icon: "🛒",
      style: {
        background: "#16162a",
        color: "#fff",
        border: "1px solid #4caf50",
      },
    });
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 100, color: "#888" }}>
        Loading...
      </div>
    );
  if (!game)
    return (
      <div style={{ textAlign: "center", padding: 100, color: "#888" }}>
        Game not found
      </div>
    );

  const discount = game.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0;

  return (
    <div
      style={{ background: "#0a0a0f", minHeight: "100vh", paddingBottom: 40 }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          background: "#16162a",
          borderBottom: "1px solid #2a2a4a",
          padding: "12px 0",
        }}
      >
        <div className="container">
          <Link
            to="/store"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#888",
              fontSize: 14,
            }}
          >
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24 }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}
        >
          {/* LEFT - Image */}
          <div>
            <div
              style={{
                width: "100%",
                aspectRatio: "16/10",
                background: "linear-gradient(135deg, #1a1a3e, #2a2a5e)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "1px solid #2a2a4a",
              }}
            >
              {game.coverImageUrl ? (
                <img
                  src={game.coverImageUrl}
                  alt={game.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Gamepad2 size={80} color="#e94560" opacity={0.3} />
              )}
            </div>
          </div>

          {/* RIGHT - Info */}
          <div>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              {game.title}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <p style={{ color: "#888", fontSize: 14 }}>{game.developer}</p>
              <span style={{ color: "#444" }}>·</span>
              <p style={{ color: "#888", fontSize: 14 }}>{game.publisher}</p>
              <span style={{ color: "#444" }}>·</span>
              <p style={{ color: "#888", fontSize: 14 }}>
                {new Date(game.releaseDate).toLocaleDateString()}
              </p>
            </div>

            {/* Rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  background: "#ffd70020",
                  padding: "4px 10px",
                  borderRadius: 6,
                }}
              >
                <Star size={16} fill="#ffd700" color="#ffd700" />
                <span style={{ color: "#ffd700", fontWeight: 700 }}>
                  {game.rating?.toFixed(1)}
                </span>
              </div>
              <span style={{ color: "#888", fontSize: 13 }}>
                ({game.ratingCount?.toLocaleString()} reviews)
              </span>
              <span style={{ color: "#888", fontSize: 13 }}>
                📦 {game.totalSales?.toLocaleString()} sold
              </span>
            </div>

            {/* Price Box */}
            <div
              style={{
                background: "linear-gradient(135deg, #1a1a3e, #16162a)",
                borderRadius: 12,
                padding: 24,
                marginBottom: 20,
                border: "1px solid #2a2a4a",
              }}
            >
              {discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      background: "#e94560",
                      color: "#fff",
                      padding: "2px 10px",
                      borderRadius: 4,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    -{discount}%
                  </span>
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#555",
                      fontSize: 18,
                    }}
                  >
                    ${game.price?.toFixed(2)}
                  </span>
                </div>
              )}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: "#fff" }}>
                  ${(game.discountPrice || game.price)?.toFixed(2)}
                </span>
                {game.price === 0 && (
                  <span
                    style={{
                      background: "#4caf5020",
                      color: "#4caf50",
                      padding: "4px 12px",
                      borderRadius: 4,
                      fontSize: 16,
                      fontWeight: 700,
                    }}
                  >
                    FREE TO PLAY
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  padding: 16,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #e94560, #c23152)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                style={{
                  flex: 1,
                  padding: 16,
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  background: "linear-gradient(135deg, #4caf50, #2e7d32)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                ⚡ Buy Now
              </button>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
              <button style={quickActionStyle}>
                <Heart size={16} /> Wishlist
              </button>
              <button style={quickActionStyle}>
                <Share2 size={16} /> Share
              </button>
            </div>

            {/* System Requirements */}
            <div
              style={{
                background: "#16162a",
                borderRadius: 12,
                padding: 20,
                border: "1px solid #2a2a4a",
              }}
            >
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#fff",
                }}
              >
                💻 System Requirements
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { icon: Monitor, label: "OS", value: game.minimumOS },
                  {
                    icon: Cpu,
                    label: "Processor",
                    value: game.minimumProcessor,
                  },
                  {
                    icon: HardDrive,
                    label: "Memory",
                    value: game.minimumMemory,
                  },
                  {
                    icon: Gamepad2,
                    label: "Graphics",
                    value: game.minimumGraphics,
                  },
                  {
                    icon: HardDrive,
                    label: "Storage",
                    value: game.minimumStorage,
                  },
                ]
                  .filter((r) => r.value)
                  .map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "#aaa",
                        fontSize: 13,
                      }}
                    >
                      <Icon size={14} color="#666" />
                      <span style={{ color: "#888", minWidth: 90 }}>
                        {label}:
                      </span>
                      <span style={{ color: "#ccc" }}>{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            marginTop: 30,
            background: "#16162a",
            borderRadius: 12,
            padding: 24,
            border: "1px solid #2a2a4a",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              marginBottom: 16,
              color: "#fff",
            }}
          >
            About This Game
          </h2>
          <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8 }}>
            {game.description}
          </p>
        </div>
      </div>
    </div>
  );
}

const quickActionStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 16px",
  background: "#16162a",
  color: "#888",
  border: "1px solid #2a2a4a",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};
