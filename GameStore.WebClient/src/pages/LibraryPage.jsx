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
} from "lucide-react";

export default function LibraryPage() {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await libraryAPI.getMyLibrary();
        setGames(res.data || []);
      } catch (err) {
        console.error("Failed to load library:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchLibrary();
  }, [user]);

  const filteredGames = games
    .filter((g) => g.title?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.title?.localeCompare(b.title);
      if (sortBy === "playtime") return (b.playTime || 0) - (a.playTime || 0);
      return new Date(b.acquiredAt) - new Date(a.acquiredAt);
    });

  if (!user)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "70vh",
        }}
      >
        <Library size={80} color="#333" />
        <h2 style={{ marginTop: 20, color: "#fff" }}>Login Required</h2>
        <p style={{ color: "#888", margin: "8px 0 20px" }}>
          Sign in to access your game library
        </p>
        <Link to="/login">
          <button
            className="btn-primary"
            style={{ padding: "12px 32px", fontSize: 15 }}
          >
            Sign In
          </button>
        </Link>
      </div>
    );

  return (
    <div style={{ background: "#1b2838", minHeight: "100vh" }}>
      {/* HEADER */}
      <div
        style={{
          background: "linear-gradient(180deg, #1a3a5c 0%, #1b2838 100%)",
          padding: "40px 40px 30px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 300,
              color: "#fff",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Library size={28} color="#66c0f4" /> Library
          </h1>
          <p style={{ color: "#8f98a0", fontSize: 14 }}>
            {games.length} game{games.length !== 1 ? "s" : ""} in your
            collection
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={{ background: "#2a3f5a", borderBottom: "1px solid #1a2a3a" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "10px 40px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
            <Search
              size={16}
              color="#8f98a0"
              style={{ position: "absolute", left: 10, top: 10 }}
            />
            <input
              placeholder="Search your library..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 34px",
                background: "#1b2838",
                border: "1px solid #3d5a80",
                borderRadius: 4,
                color: "#dcdedf",
                fontSize: 13,
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 12px",
                background: "#1b2838",
                border: "1px solid #3d5a80",
                borderRadius: 4,
                color: "#dcdedf",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              <option value="recent">Recently Acquired</option>
              <option value="name">Alphabetical</option>
              <option value="playtime">Play Time</option>
            </select>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: 8,
                background: viewMode === "grid" ? "#3d5a80" : "#1b2838",
                border: "1px solid #3d5a80",
                borderRadius: 4,
                cursor: "pointer",
                color: "#dcdedf",
              }}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: 8,
                background: viewMode === "list" ? "#3d5a80" : "#1b2838",
                border: "1px solid #3d5a80",
                borderRadius: 4,
                cursor: "pointer",
                color: "#dcdedf",
              }}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* GAMES */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 40px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#8f98a0" }}>
            Loading your library...
          </div>
        ) : filteredGames.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80 }}>
            <Gamepad2 size={64} color="#333" />
            <h2 style={{ color: "#8f98a0", marginTop: 16, fontWeight: 300 }}>
              No games found
            </h2>
            <p style={{ color: "#555", marginTop: 8 }}>
              {games.length === 0
                ? "Visit the Store to add games to your collection"
                : "Try a different search"}
            </p>
            {games.length === 0 && (
              <Link to="/store">
                <button
                  className="btn-primary"
                  style={{ marginTop: 16, padding: "10px 24px" }}
                >
                  Browse Store
                </button>
              </Link>
            )}
          </div>
        ) : viewMode === "list" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredGames.map((game, index) => (
              <Link
                to={`/game/${game.id}`}
                key={game.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "12px 16px",
                  background: index % 2 === 0 ? "#1e3145" : "#233752",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 120,
                    height: 56,
                    flexShrink: 0,
                    overflow: "hidden",
                    borderRadius: 4,
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
                        background: "#1a2a3a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Gamepad2 size={20} color="#555" />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h4
                    style={{ color: "#66c0f4", fontSize: 15, fontWeight: 400 }}
                  >
                    {game.title}
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      marginTop: 2,
                      fontSize: 11,
                      color: "#8f98a0",
                    }}
                  >
                    {game.rating > 0 && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Star size={11} fill="#ffd700" color="#ffd700" />{" "}
                        {game.rating?.toFixed(1)}
                      </span>
                    )}
                    {game.developer && <span>{game.developer}</span>}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      color: "#8f98a0",
                      fontSize: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Clock size={12} /> {game.playTime || 0}h
                  </span>
                  <ChevronRight size={16} color="#555" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 12,
            }}
          >
            {filteredGames.map((game) => (
              <Link
                to={`/game/${game.id}`}
                key={game.id}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "#1e3145",
                    borderRadius: 4,
                    overflow: "hidden",
                    border: "1px solid #2a3f5a",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      background: "#1a2a3a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
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
                      <Gamepad2 size={40} color="#333" />
                    )}
                  </div>
                  <div
                    style={{
                      padding: 12,
                      background:
                        "linear-gradient(180deg, #233752 0%, #1e3145 100%)",
                    }}
                  >
                    <h4
                      style={{
                        color: "#66c0f4",
                        fontSize: 14,
                        fontWeight: 400,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {game.title}
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 4,
                        fontSize: 11,
                        color: "#8f98a0",
                      }}
                    >
                      {game.rating > 0 && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Star size={11} fill="#ffd700" color="#ffd700" />{" "}
                          {game.rating?.toFixed(1)}
                        </span>
                      )}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <Clock size={11} /> {game.playTime || 0}h
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const pageBtnStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  background: "#2a2a4a",
  color: "#aaa",
};
