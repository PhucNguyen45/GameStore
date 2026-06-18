// GameStore.WebClient/src/pages/LibraryPage.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { libraryAPI } from "../services/api";
import {
  Library,
  Gamepad2,
  Star,
  Search,
  Grid3X3,
  List,
  KeyRound,
  X,
} from "lucide-react";
import { GameCardSkeletonGrid } from "../components/games/GameCardSkeleton";
import { useTranslation } from "react-i18next";

export default function LibraryPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("grid");
  const [filter, setFilter] = useState("all");
  const [totalResults, setTotalResults] = useState(0);
  const [searching, setSearching] = useState(false);
  const searchTimer = useRef(null);
  const inputRef = useRef(null);

  // Fetch library — with debounced search
  const fetchLibrary = useCallback(async (keyword, sort, page = 1) => {
    if (!user) return;
    setSearching(true);
    try {
      const params = { sortBy: sort, page, pageSize: 100 };
      if (keyword && keyword.trim()) params.keyword = keyword.trim();
      const res = await libraryAPI.getMyLibrary(params);
      // Handle both paginated (with keyword) and non-paginated responses
      const data = res.data.data || res.data || [];
      const count = res.data.totalCount ?? data.length;
      setGames(data);
      setTotalResults(count);
    } catch {
      // Fallback: no-op
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user) {
      fetchLibrary("", sortBy);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search when keyword or sort changes
  useEffect(() => {
    if (!user) return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    // Don't debounce on initial load
    if (loading) return;
    searchTimer.current = setTimeout(() => {
      fetchLibrary(search, sortBy);
    }, 300);
    return () => {
      if (searchTimer.current) clearTimeout(searchTimer.current);
    };
  }, [search, sortBy, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const clearSearch = () => {
    setSearch("");
    setSearching(true);
    fetchLibrary("", sortBy);
    inputRef.current?.focus();
  };

  // Apply local "recent" filter on top of server results
  const displayGames = games.filter((g) => {
    if (filter === "recent") {
      const d = new Date(g.acquiredAt);
      return d > new Date(Date.now() - 30 * 86400000);
    }
    return true;
  });

  if (!user) return <LoginPrompt />;

  const hasActiveSearch = search.trim().length > 0;

  return (
    <div
      style={{
        background: "#121212",
        minHeight: "100vh",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ borderBottom: "1px solid #222" }}>
        <div className="container" style={{ paddingTop: 40, paddingBottom: 30 }}>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: "#fff",
              letterSpacing: -1,
              marginBottom: 4,
            }}
          >
            {t("library.title")}
          </h1>
          <p style={{ color: "#888", fontSize: 14, margin: 0 }}>
            {hasActiveSearch
              ? `Tìm thấy ${totalResults} kết quả cho "${search}"`
              : t("library.gameCount", { count: games.length })}
          </p>
        </div>
      </div>

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
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {/* Search input */}
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                color="#666"
                style={{ position: "absolute", left: 10, top: 10, pointerEvents: "none" }}
              />
              <input
                ref={inputRef}
                placeholder={t("library.searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: 260,
                  padding: `8px ${search ? 32 : 12}px 8px 32px`,
                  background: "#2a2a2a",
                  border: "1px solid #333",
                  borderRadius: 10,
                  color: "#fff",
                  fontSize: 12,
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#666";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#333";
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") clearSearch();
                }}
              />
              {search && (
                <button
                  onClick={clearSearch}
                  style={{
                    position: "absolute",
                    right: 6,
                    top: 6,
                    background: "none",
                    border: "none",
                    color: "#888",
                    cursor: "pointer",
                    padding: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "#444"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "none"; }}
                  title="Xoá tìm kiếm (Esc)"
                >
                  <X size={14} />
                </button>
              )}
              {searching && search && (
                <div
                  style={{
                    position: "absolute",
                    right: search ? 32 : 8,
                    top: 8,
                    width: 14,
                    height: 14,
                    border: "2px solid #444",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite",
                  }}
                />
              )}
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { id: "all", label: t("library.all") },
                { id: "recent", label: t("library.recent") },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 10,
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

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: "8px 12px",
                background: "#2a2a2a",
                border: "1px solid #333",
                borderRadius: 10,
                color: "#ccc",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                outline: "none",
                letterSpacing: 0.5,
              }}
            >
              <option value="recent">{t("library.sortRecent")}</option>
              <option value="name">{t("library.sortAZ")}</option>
              <option value="playtime">{t("library.sortPlaytime")}</option>
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

      <div className="container" style={{ paddingTop: 24, paddingBottom: 24 }}>
        {loading ? (
          <GameCardSkeletonGrid count={12} compact />
        ) : displayGames.length === 0 ? (
          <EmptyState gamesCount={games.length} search={search} />
        ) : viewMode === "grid" ? (
          <GridView games={displayGames} />
        ) : (
          <ListView games={displayGames} />
        )}
      </div>
    </div>
  );
}

function GridView({ games }) {
  const { t } = useTranslation();

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
                <KeyRound size={32} color="#10b981" />
              </div>
            </div>

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
                  {game.acquiredAt
                    ? new Date(game.acquiredAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 11,
                  color: "#10b981",
                }}
              >
                <KeyRound size={11} />
                {t("library.keyAvailable")}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function ListView({ games }) {
  const { t } = useTranslation();

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
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
        <span style={{ flex: 1 }}>{t("library.game")}</span>
        <span style={{ width: 100, textAlign: "center" }}>{t("library.rating")}</span>
        <span style={{ width: 100, textAlign: "center" }}>{t("library.playTime")}</span>
        <span style={{ width: 100, textAlign: "right" }}>{t("library.acquired")}</span>
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
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 12 }}>
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
                <span style={{ fontSize: 11, color: "#666" }}>{game.developer}</span>
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

            <span style={{ width: 100, textAlign: "center", fontSize: 12, color: "#888" }}>
              {game.playTime || 0}h
            </span>

            <span style={{ width: 100, textAlign: "right", fontSize: 11, color: "#666" }}>
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

function EmptyState({ gamesCount, search }) {
  const { t } = useTranslation();

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
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: -0.5 }}>
        {gamesCount === 0 ? t("library.empty") : t("library.noResults")}
      </h2>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
        {gamesCount === 0
          ? t("library.emptyDesc")
          : t("library.noResultsDesc", { search })}
      </p>
      {gamesCount === 0 && (
        <Link to="/store">
          <button className="btn btn-primary">
            {t("library.browseStore")}
          </button>
        </Link>
      )}
    </div>
  );
}

function LoginPrompt() {
  const { t } = useTranslation();

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
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: -0.5 }}>
        {t("library.loginRequired")}
      </h2>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
        {t("library.loginDesc")}
      </p>
      <Link to="/login">
        <button className="btn btn-primary" style={{ padding: "12px 32px", fontSize: 13 }}>
          {t("library.signIn")}
        </button>
      </Link>
    </div>
  );
}

const viewBtnStyle = {
  padding: 8,
  borderRadius: 10,
  border: "1px solid #333",
  cursor: "pointer",
  color: "#ccc",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s",
};
