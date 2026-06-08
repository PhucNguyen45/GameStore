// GameStore.WebClient/src/pages/StorePage.jsx
import { useState, useEffect } from "react";
import { gameAPI, genreAPI } from "../services/api";
import GameCard from "../components/games/GameCard";
import { GameCardSkeletonGrid } from "../components/games/GameCardSkeleton";
import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function StorePage() {
  const { t } = useTranslation();
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("totalSales");
  const [desc, setDesc] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    genreAPI.getAll().then((r) => setGenres(r.data));
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const params = { page, pageSize, sortBy: sort, desc };
        if (search) params.keyword = search;
        if (genreId) params.genreId = genreId;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        const res = await gameAPI.getAll(params);
        setGames(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchGames, 300);
    return () => clearTimeout(timer);
  }, [page, sort, desc, genreId, search, minPrice, maxPrice]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{ display: "flex", gap: 12, marginBottom: 20 }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#16162a",
            borderRadius: 12,
            padding: "0 16px",
            border: "1px solid #2a2a4a",
          }}
        >
          <Search size={20} color="#6b6b8e" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("store.searchPlaceholder")}
            style={{
              flex: 1,
              padding: "14px 0",
              background: "transparent",
              border: "none",
              color: "#e0e0e0",
              fontSize: 15,
              outline: "none",
            }}
          />
        </div>
        <button
          type="submit"
          className="btn-primary"
          style={{ padding: "14px 28px" }}
        >
          {t("store.search")}
        </button>
        <button
          type="button"
          className={showFilters ? "btn-primary" : "btn-outline"}
          onClick={() => setShowFilters(!showFilters)}
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <SlidersHorizontal size={18} /> {t("store.filters")}
        </button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            flexWrap: "wrap",
            alignItems: "center",
            padding: 16,
            background: "#16162a",
            borderRadius: 12,
          }}
        >
          <select
            value={genreId}
            onChange={(e) => {
              setGenreId(e.target.value);
              handleFilterChange();
            }}
            style={selectStyle}
          >
            <option value="">{t("store.allGenres")}</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder={t("store.minPrice")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ ...selectStyle, width: 120 }}
          />
          <input
            type="number"
            placeholder={t("store.maxPrice")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ ...selectStyle, width: 120 }}
          />

          <select
            value={sort}
            onChange={(e) => {
              const newSort = e.target.value;
              setSort(newSort);
              if (newSort === "price" || newSort === "title") {
                setDesc(false);
              } else {
                setDesc(true);
              }
              handleFilterChange();
            }}
            style={selectStyle}
          >
            <option value="totalSales">{t("store.bestSelling")}</option>
            <option value="rating">{t("store.highestRated")}</option>
            <option value="releaseDate">{t("store.newest")}</option>
            <option value="title">{t("store.nameAZ")}</option>
          </select>

          <button
            onClick={() => {
              setDesc(!desc);
              handleFilterChange();
            }}
            style={{
              ...selectStyle,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            title={desc ? "Descending" : "Ascending"}
          >
            {desc ? t("store.desc") : t("store.asc")}
          </button>

          <button
            onClick={() => {
              setGenreId("");
              setMinPrice("");
              setMaxPrice("");
              setSort("sales");
              setShowFilters(false);
              handleFilterChange();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "transparent",
              color: "#e94560",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            <X size={14} /> {t("store.clearAll")}
          </button>

          <button
            onClick={handleFilterChange}
            className="btn-primary"
            style={{ padding: "8px 16px", fontSize: 13 }}
          >
            {t("store.apply")}
          </button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <GameCardSkeletonGrid count={12} />
      ) : games.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b6b8e", padding: 40 }}>
          {t("store.noGames")}
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
              paddingBottom: 20,
            }}
          >
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                paddingBottom: 40,
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={pageBtnStyle}
              >
                {t("store.prev")}
              </button>
              {(() => {
                const pages = [];
                const maxVisible = 4;
                if (totalPages <= maxVisible + 1) {
                  for (let i = 1; i <= totalPages; i++) pages.push(i);
                } else {
                  let start = Math.max(1, page - 1);
                  let end = Math.min(totalPages, start + maxVisible - 1);
                  if (end - start < maxVisible - 1)
                    start = Math.max(1, end - maxVisible + 1);
                  if (start > 1) {
                    pages.push(1);
                    if (start > 2) pages.push("...");
                  }
                  for (let i = start; i <= end; i++) pages.push(i);
                  if (end < totalPages) {
                    if (end < totalPages - 1) pages.push("...");
                    pages.push(totalPages);
                  }
                }
                return pages;
              })().map((p, idx) =>
                p === "..." ? (
                  <span key={`e-${idx}`} style={{ color: "#666", padding: "0 6px", fontSize: 14 }}>
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    style={{
                      ...pageBtnStyle,
                      background: page === p ? "#e94560" : "#2a2a4a",
                      color: page === p ? "#fff" : "#aaa",
                    }}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={pageBtnStyle}
              >
                {t("store.next")}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const selectStyle = {
  padding: "10px 14px",
  background: "#0a0a15",
  color: "#e0e0e0",
  border: "1px solid #2a2a4a",
  borderRadius: 8,
  fontSize: 14,
  cursor: "pointer",
  outline: "none",
};
const pageBtnStyle = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
};
