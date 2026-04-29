import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { gameAPI, libraryAPI } from "../services/api";
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
  ChevronRight,
  Heart,
  Share2,
  Clock,
  Globe,
  Award,
  Users,
  Plus,
  Check,
  X,
  Play,
} from "lucide-react";

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  useEffect(() => {
    gameAPI
      .getById(id)
      .then((res) => setGame(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  // KIỂM TRA GAME ĐÃ MUA CHƯA
  useEffect(() => {
    if (user && id) {
      libraryAPI
        .checkOwned(id)
        .then((res) => setOwned(res.data.owned))
        .catch(() => setOwned(false));
    } else {
      setOwned(false);
    }
  }, [user, id]);

  const handleBuyNow = () => {
    if (!user) {
      toast.error("Sign in to purchase");
      navigate("/login");
      return;
    }
    addItem(game);
    navigate("/cart");
  };

  if (loading) return <LoadingSkeleton />;
  if (!game) return <NotFound />;

  const discount = game.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0;
  const finalPrice = game.discountPrice || game.price;

  return (
    <div
      style={{
        background: "#121212",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ===== HERO - FULL WIDTH DARK ===== */}
      <div
        style={{
          background: `linear-gradient(0deg, #121212 0%, rgba(18,18,18,0.6) 100%), url(${game.coverImageUrl}) center/cover no-repeat`,
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        {/* Gradient Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, #121212 10%, transparent 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 40px 60px",
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Coming Soon / Available Now Badge */}
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 4,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1,
                background: "#ffffff20",
                color: "#fff",
                border: "1px solid #ffffff30",
                textTransform: "uppercase",
              }}
            >
              Available Now
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1,
              marginBottom: 16,
              maxWidth: 800,
            }}
          >
            {game.title}
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 16,
              color: "#ccc",
              maxWidth: 600,
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {game.description?.substring(0, 150)}...
          </p>

          {/* Genres */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
            {game.gameGenres?.map((gg) => (
              <span
                key={gg.genreId}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  background: "#ffffff15",
                  color: "#aaa",
                  border: "1px solid #ffffff20",
                }}
              >
                {gg.genre?.name}
              </span>
            ))}
          </div>

          {/* Rating + Platform + Price Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {/* Rating */}
            {game.rating > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Star size={18} fill="#f7b731" color="#f7b731" />
                <span style={{ fontSize: 16, fontWeight: 700 }}>
                  {game.rating?.toFixed(1)}
                </span>
                <span style={{ color: "#888", fontSize: 13 }}>
                  ({game.ratingCount?.toLocaleString()})
                </span>
              </div>
            )}

            {/* Platform */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#aaa",
                fontSize: 13,
              }}
            >
              <Monitor size={16} /> Windows PC
            </div>
          </div>

          {/* Price & Buttons Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 24,
            }}
          >
            {/* 🆕 NẾU ĐÃ MUA → HIỂN THỊ "IN LIBRARY" */}
            {owned ? (
              <>
                <button
                  style={{
                    ...epicPrimaryBtn,
                    background: "#4caf50",
                    cursor: "default",
                  }}
                >
                  <Check size={16} style={{ marginRight: 6 }} />
                  IN LIBRARY
                </button>
                <button
                  style={epicSecondaryBtn}
                  onClick={() => navigate("/library")}
                >
                  GO TO LIBRARY
                </button>
              </>
            ) : game.price === 0 ? (
              /* FREE GAME */
              <button
                style={epicPrimaryBtn}
                onClick={async () => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  try {
                    await orderAPI.create({
                      items: [{ gameId: game.id, quantity: 1 }],
                    });
                    setOwned(true);
                    toast.success("Game added to your library!");
                  } catch (e) {
                    toast.error(e.response?.data?.message || "Failed");
                  }
                }}
              >
                GET{" "}
                <span style={{ marginLeft: 8, fontSize: 14, fontWeight: 400 }}>
                  Free
                </span>
              </button>
            ) : (
              /* GAME TRẢ PHÍ */
              <>
                <button style={epicPrimaryBtn} onClick={handleBuyNow}>
                  BUY NOW
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 14,
                      fontWeight: 400,
                      opacity: 0.9,
                    }}
                  >
                    {discount > 0 && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: 8,
                          fontSize: 12,
                          opacity: 0.6,
                        }}
                      >
                        ${game.price?.toFixed(2)}
                      </span>
                    )}
                    ${finalPrice?.toFixed(2)}
                  </span>
                </button>
                <button
                  style={epicSecondaryBtn}
                  onClick={() => {
                    addItem(game);
                    toast.success("Added to cart!");
                  }}
                >
                  <ShoppingCart size={16} /> ADD TO CART
                </button>
              </>
            )}

            <button style={epicWishlistBtn}>
              <Heart size={16} />
            </button>
          </div>

          {/* Age Rating + Features */}
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            <span
              style={{
                padding: "2px 6px",
                background: "#333",
                borderRadius: 3,
                fontSize: 11,
                fontWeight: 700,
                color: "#aaa",
              }}
            >
              RATING PENDING
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#888",
              }}
            >
              <Users size={14} /> Single Player
            </span>
          </div>
        </div>
      </div>

      {/* ===== TABS - STICKY ===== */}
      <div
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #333",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            gap: 0,
          }}
        >
          {[
            { id: "overview", label: "OVERVIEW" },
            { id: "requirements", label: "SYSTEM REQUIREMENTS" },
            { id: "reviews", label: "REVIEWS" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "18px 28px",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                background: "transparent",
                color: activeTab === tab.id ? "#fff" : "#888",
                borderBottom:
                  activeTab === tab.id
                    ? "3px solid #fff"
                    : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px" }}>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 60,
            }}
          >
            {/* LEFT - Description */}
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 20,
                  letterSpacing: -0.5,
                }}
              >
                ABOUT {game.title?.toUpperCase()}
              </h2>
              <p
                style={{
                  color: "#aaa",
                  fontSize: 14,
                  lineHeight: 1.8,
                  marginBottom: 30,
                }}
              >
                {game.description}
              </p>

              {/* Feature Highlights */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                {[
                  { label: "Developer", value: game.developer },
                  { label: "Publisher", value: game.publisher },
                  {
                    label: "Release Date",
                    value: new Date(game.releaseDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    ),
                  },
                  { label: "Platform", value: "Windows PC" },
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

            {/* RIGHT - Sidebar */}
            <div>
              {/* Ratings Card */}
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
                  EPIC PLAYER RATINGS
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
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#f7b731",
                      }}
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
                          fill={
                            s <= Math.round(game.rating) ? "#f7b731" : "none"
                          }
                          color="#f7b731"
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      {game.ratingCount?.toLocaleString()} reviews
                    </p>
                  </div>
                </div>
                <button
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
                  }}
                >
                  WRITE A REVIEW
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
                  SPECIFICATIONS
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[
                    [
                      "Genre",
                      game.gameGenres?.map((g) => g.genre?.name).join(", "),
                    ],
                    [
                      "Release Date",
                      new Date(game.releaseDate).toLocaleDateString(),
                    ],
                    ["Platform", "Windows PC"],
                    ["Developer", game.developer],
                    ["Publisher", game.publisher],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#888" }}>
                        {label}
                      </span>
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
        )}

        {/* REQUIREMENTS TAB */}
        {activeTab === "requirements" && (
          <div style={{ maxWidth: 700 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 30,
                letterSpacing: -0.5,
              }}
            >
              SYSTEM REQUIREMENTS
            </h2>
            <div
              style={{
                background: "#1e1e1e",
                borderRadius: 8,
                padding: "30px 32px",
                border: "1px solid #333",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
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
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                    >
                      <Icon size={16} color="#666" />
                      <span
                        style={{
                          fontSize: 12,
                          color: "#888",
                          minWidth: 120,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        {label}
                      </span>
                      <span style={{ fontSize: 14, color: "#ccc" }}>
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === "reviews" && (
          <div style={{ textAlign: "center", padding: 60 }}>
            <Star size={64} color="#333" />
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginTop: 20,
                letterSpacing: -0.5,
              }}
            >
              NO REVIEWS YET
            </h2>
            <p style={{ color: "#888", marginTop: 8, fontSize: 14 }}>
              Be the first to review "{game.title}"
            </p>
            <button
              style={{
                marginTop: 20,
                padding: "12px 32px",
                background: "#fff",
                color: "#000",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              WRITE REVIEW
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ===== STYLES =====
const epicPrimaryBtn = {
  padding: "12px 28px",
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.5,
  display: "flex",
  alignItems: "center",
  transition: "opacity 0.2s",
};

const epicSecondaryBtn = {
  padding: "12px 28px",
  background: "transparent",
  color: "#fff",
  border: "1px solid #fff",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.5,
  display: "flex",
  alignItems: "center",
  gap: 6,
  transition: "all 0.2s",
};

const epicWishlistBtn = {
  padding: "12px",
  background: "transparent",
  color: "#fff",
  border: "1px solid #fff",
  borderRadius: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s",
};

// ===== SUB COMPONENTS =====
function LoadingSkeleton() {
  return (
    <div style={{ background: "#121212", minHeight: "100vh" }}>
      <div
        style={{
          height: "70vh",
          background: "#1e1e1e",
          display: "flex",
          alignItems: "flex-end",
          padding: "60px 40px",
        }}
      >
        <div>
          <div
            style={{
              width: 300,
              height: 48,
              background: "#333",
              borderRadius: 4,
              marginBottom: 16,
            }}
          />
          <div
            style={{
              width: 500,
              height: 20,
              background: "#333",
              borderRadius: 4,
              marginBottom: 24,
            }}
          />
          <div
            style={{
              width: 200,
              height: 48,
              background: "#333",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: 100,
        background: "#121212",
        minHeight: "100vh",
        color: "#888",
      }}
    >
      <Gamepad2 size={64} />
      <h2 style={{ marginTop: 16, color: "#fff" }}>Game Not Found</h2>
      <Link
        to="/store"
        style={{
          color: "#fff",
          marginTop: 12,
          display: "inline-block",
          textDecoration: "underline",
        }}
      >
        Back to Store
      </Link>
    </div>
  );
}
