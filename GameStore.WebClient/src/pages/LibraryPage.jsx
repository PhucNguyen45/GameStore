// GameStore.WebClient/src/pages/LibraryPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { libraryAPI } from "../services/api";
import {
  Library,
  Gamepad2,
  Clock,
  Search,
  Grid3X3,
  List,
  Star,
  ChevronRight,
  Download,
  Play,
  Infinity,
  Filter,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function LibraryPage() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all"); // all, installed, recent

  useEffect(() => {
    if (user) {
      libraryAPI
        .getMyLibrary()
        .then((res) => setGames(res.data || []))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const filteredGames = games
    .filter((g) => {
      if (filter === "installed") return g.installed;
      if (filter === "recent") {
        const d = new Date(g.acquiredAt);
        return d > new Date(Date.now() - 30 * 86400000);
      }
      return true;
    })
    .filter((g) => g.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.title?.localeCompare(b.title);
      if (sortBy === "playtime") return (b.playTime || 0) - (a.playTime || 0);
      return new Date(b.acquiredAt) - new Date(a.acquiredAt);
    });

  if (!user) return <LoginPrompt />;

  return (
    <div
      style={{
        background: "#121212",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{ padding: "40px 40px 30px", borderBottom: "1px solid #222" }}
      >
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: -1,
              marginBottom: 4,
            }}
          >
            MY LIBRARY
          </h1>
          <p style={{ color: "#888", fontSize: 14 }}>
            {games.length} game{games.length !== 1 ? "s" : ""} in collection
          </p>
        </div>
      </div>

      {/* ===== TOOLBAR ===== */}
      <div
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #222",
          position: "sticky",
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "12px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                color="#666"
                style={{ position: "absolute", left: 10, top: 10 }}
              />
              <input
                placeholder="Search library..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: 220,
                  padding: "8px 12px 8px 32px",
                  background: "#2a2a2a",
                  border: "1px solid #333",
                  borderRadius: 4,
                  color: "#fff",
                  fontSize: 12,
                  outline: "none",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { id: "all", label: "All" },
                { id: "installed", label: "Installed" },
                { id: "recent", label: "Recent" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 4,
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 1,
                    background: filter === f.id ? "#fff" : "#2a2a2a",
                    color: filter === f.id ? "#000" : "#888",
                    transition: "all 0.2s",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort + View */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 12px",
                background: "#2a2a2a",
                border: "1px solid #333",
                borderRadius: 4,
                color: "#ccc",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
                letterSpacing: 0.5,
              }}
            >
              <option value="recent">Sort: Recent</option>
              <option value="name">Sort: A-Z</option>
              <option value="playtime">Sort: Play Time</option>
            </select>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                ...viewBtnStyle,
                background: viewMode === "grid" ? "#333" : "#2a2a2a",
              }}
            >
              <Grid3X3 size={14} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                ...viewBtnStyle,
                background: viewMode === "list" ? "#333" : "#2a2a2a",
              }}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px 40px" }}>
        {loading ? (
          <div
            style={{ display: "flex", justifyContent: "center", padding: 80 }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "3px solid #333",
                borderTopColor: "#fff",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : filteredGames.length === 0 ? (
          <EmptyState gamesCount={games.length} search={search} />
        ) : viewMode === "grid" ? (
          <GridView games={filteredGames} />
        ) : (
          <ListView games={filteredGames} />
        )}
      </div>
    </div>
  );
}

// ===== GRID VIEW =====
function GridView({ games }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: 16,
      }}
    >
      {games.map((game) => (
        <Link
          to={`/game/${game.id}`}
          key={game.id}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              background: "#1a1a1a",
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid #2a2a2a",
              transition: "all 0.2s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#fff";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a2a2a";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* Cover */}
            <div
              style={{
                aspectRatio: "16/9",
                background: "#222",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {game.coverImageUrl ? (
                <img
                  src={game.coverImageUrl}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#252525",
                  }}
                >
                  <Gamepad2 size={32} color="#444" />
                </div>
              )}
              {/* Hover Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                className="hover-overlay"
              >
                <Play size={32} fill="#fff" color="#fff" />
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: 12 }}>
              <h4
                style={{
                  color: "#ddd",
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: 4,
                }}
              >
                {game.title}
              </h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {game.rating > 0 && (
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      fontSize: 11,
                      color: "#888",
                    }}
                  >
                    <Star size={10} fill="#f7b731" color="#f7b731" />{" "}
                    {game.rating?.toFixed(1)}
                  </span>
                )}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    fontSize: 11,
                    color: "#666",
                  }}
                >
                  <Clock size={10} /> {game.playTime || 0}h
                </span>
              </div>
              {/* Action Buttons */}
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <button
                  style={smallBtnStyle}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                >
                  <Play size={12} /> Play
                </button>
                <button
                  style={{
                    ...smallBtnStyle,
                    background: "#2a2a2a",
                    color: "#888",
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <Download size={12} />
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ===== LIST VIEW =====
function ListView({ games }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          padding: "10px 16px",
          borderBottom: "1px solid #222",
          fontSize: 10,
          color: "#666",
          textTransform: "uppercase",
          letterSpacing: 1,
          fontWeight: 700,
        }}
      >
        <span style={{ flex: 1 }}>Game</span>
        <span style={{ width: 100, textAlign: "center" }}>Rating</span>
        <span style={{ width: 100, textAlign: "center" }}>Play Time</span>
        <span style={{ width: 100, textAlign: "right" }}>Acquired</span>
      </div>
      {games.map((game, i) => (
        <Link
          to={`/game/${game.id}`}
          key={game.id}
          style={{ textDecoration: "none" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 16px",
              background: i % 2 === 0 ? "#1a1a1a" : "#151515",
              transition: "background 0.15s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                i % 2 === 0 ? "#1a1a1a" : "#151515")
            }
          >
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 40,
                  borderRadius: 4,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: "#252525",
                }}
              >
                {game.coverImageUrl ? (
                  <img
                    src={game.coverImageUrl}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Gamepad2 size={16} color="#444" />
                  </div>
                )}
              </div>
              <div>
                <h4 style={{ color: "#ddd", fontSize: 13, fontWeight: 500 }}>
                  {game.title}
                </h4>
                <span style={{ fontSize: 11, color: "#666" }}>
                  {game.developer}
                </span>
              </div>
            </div>

            <span
              style={{
                width: 100,
                textAlign: "center",
                fontSize: 12,
                color: "#888",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <Star size={11} fill="#f7b731" color="#f7b731" />{" "}
              {game.rating?.toFixed(1) || "-"}
            </span>

            <span
              style={{
                width: 100,
                textAlign: "center",
                fontSize: 12,
                color: "#888",
              }}
            >
              {game.playTime || 0}h
            </span>

            <span
              style={{
                width: 100,
                textAlign: "right",
                fontSize: 11,
                color: "#666",
              }}
            >
              {game.acquiredAt
                ? new Date(game.acquiredAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "-"}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// ===== EMPTY STATE =====
function EmptyState({ gamesCount, search }) {
  return (
    <div style={{ textAlign: "center", padding: 80 }}>
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <Library size={32} color="#444" />
      </div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 8,
          letterSpacing: -0.5,
        }}
      >
        {gamesCount === 0 ? "Your library is empty" : "No games found"}
      </h2>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
        {gamesCount === 0
          ? "Games you purchase or claim will appear here"
          : `No results for "${search}"`}
      </p>
      {gamesCount === 0 && (
        <Link to="/store">
          <button
            style={{
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
            BROWSE STORE
          </button>
        </Link>
      )}
    </div>
  );
}

// ===== PROMPT =====
function LoginPrompt() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        background: "#121212",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Library size={32} color="#444" />
      </div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: "#fff",
          marginBottom: 8,
          letterSpacing: -0.5,
        }}
      >
        Sign In Required
      </h2>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
        Sign in to access your game library
      </p>
      <Link to="/login">
        <button
          style={{
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
          SIGN IN
        </button>
      </Link>
    </div>
  );
}

// ===== STYLES =====
const viewBtnStyle = {
  padding: 8,
  borderRadius: 4,
  border: "1px solid #333",
  cursor: "pointer",
  color: "#ccc",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s",
};

const smallBtnStyle = {
  padding: "6px 10px",
  borderRadius: 4,
  border: "none",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  background: "#fff",
  color: "#000",
  display: "flex",
  alignItems: "center",
  gap: 4,
  flex: 1,
  justifyContent: "center",
};
