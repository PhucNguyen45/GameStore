// GameStore.WebClient/src/pages/StorePage.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useResponsive } from "../../hooks/useResponsive";
import { gameAPI, genreAPI } from "../../services/api";
import { GameCard, GameCardSkeletonGrid } from "../../components/games";
import { Pagination } from "../../components/common";
import { Search, Check, X, ArrowUpDown, Filter } from "lucide-react";
import HeroBanner from "../../components/store/HeroBanner";
import { useTranslation } from "react-i18next";

export default function StorePage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("keyword") || "");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("totalSales");
  const [desc, setDesc] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { value: resp, breakpoint } = useResponsive();
  const pageSize = 16;
  const gridMinWidth = resp(160, 180, 200, 220);

  useEffect(() => {
    genreAPI.getAll().then((r) => setGenres(r.data));
    gameAPI
      .getFeatured(6)
      .then((r) => setFeatured(r.data || []))
      .catch(() => {});
  }, []);

  const toggleGenre = (id) => {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((gid) => gid !== id) : [...prev, id],
    );
    setPage(1);
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const params = { page, pageSize, sortBy: sort, desc };
        if (search) params.keyword = search;
        if (selectedGenres.length > 0) params.genreIds = selectedGenres;
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
  }, [page, sort, desc, selectedGenres, search, minPrice, maxPrice]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  const handleFilterChange = () => {
    setPage(1);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setMinPrice("");
    setMaxPrice("");
    setSort("totalSales");
    setDesc(true);
    setPage(1);
  };

  const activeFilterCount =
    selectedGenres.length +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (sort !== "totalSales" ? 1 : 0);

  const isDesktop = breakpoint !== "xs" && breakpoint !== "sm";

  const renderFilterContent = (sidebar = false) => (
    <div
      style={{
        background: "#16162a",
        border: "1px solid #2a2a4a",
        borderRadius: 12,
        padding: sidebar ? 20 : "clamp(14px, 2.5vw, 20px)",
      }}
    >
      {/* Genre chips */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6b6b8e",
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 10,
          }}
        >
          {t("store.genres")}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {genres.map((g) => {
            const isSelected = selectedGenres.includes(g.id);
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => toggleGenre(g.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: isSelected
                    ? "1px solid var(--accent)"
                    : "1px solid #2a2a4a",
                  background: isSelected
                    ? "rgba(0,120,242,0.15)"
                    : "transparent",
                  color: isSelected ? "#fff" : "#999",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >
                {isSelected && <Check size={11} strokeWidth={3} />}
                {g.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price + Sort + Clear */}
      <div
        style={{
          display: "flex",
          flexDirection: sidebar ? "column" : "row",
          flexWrap: "wrap",
          gap: 10,
          alignItems: sidebar ? "stretch" : "center",
        }}
      >
        {/* Price Range */}
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#0a0a15",
            borderRadius: 10,
            padding: "6px 12px",
            border: "1px solid #2a2a4a",
          }}
        >
          <input
            type="number"
            placeholder={t("store.minPrice")}
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            style={{
              width: 80,
              padding: "4px 0",
              background: "transparent",
              border: "none",
              color: "#e0e0e0",
              fontSize: 13,
              outline: "none",
              MozAppearance: "textfield",
            }}
          />
          <span style={{ color: "#555", fontSize: 13 }}>—</span>
          <input
            type="number"
            placeholder={t("store.maxPrice")}
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            style={{
              width: 80,
              padding: "4px 0",
              background: "transparent",
              border: "none",
              color: "#e0e0e0",
              fontSize: 13,
              outline: "none",
              MozAppearance: "textfield",
            }}
          />
        </div> */}

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            const newSort = e.target.value;
            setSort(newSort);
            if (newSort === "price" || newSort === "title") setDesc(false);
            else setDesc(true);
            handleFilterChange();
          }}
          style={{
            padding: "8px 12px",
            background: "#0a0a15",
            border: "1px solid #2a2a4a",
            borderRadius: 10,
            color: "#e0e0e0",
            fontSize: 13,
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="totalSales">{t("store.bestSelling")}</option>
          <option value="rating">{t("store.highestRated")}</option>
          <option value="price">{t("store.price")}</option>
          <option value="discount">{t("store.discount")}</option>
          <option value="releaseDate">{t("store.newest")}</option>
          <option value="title">{t("store.name")}</option>
        </select>

        {/* Asc/Desc */}
        <button
          type="button"
          onClick={() => {
            setDesc(!desc);
            handleFilterChange();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "8px 12px",
            background: "#0a0a15",
            border: "1px solid #2a2a4a",
            borderRadius: 10,
            color: "#ccc",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: "nowrap",
          }}
        >
          <ArrowUpDown size={14} />
          {desc ? t("store.desc") : t("store.asc")}
        </button>

        {/* Clear */}
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 14px",
              background: "transparent",
              border: "1px solid rgba(233,69,96,0.3)",
              borderRadius: 10,
              color: "#e94560",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            <X size={14} /> {t("store.clearAll")}
          </button>
        )}
      </div>
    </div>
  );

  const searchBar = (
    <form
      onSubmit={handleSearch}
      style={{
        display: "flex",
        gap: 10,
        marginBottom: 20,
        flexWrap: "wrap",
      }}
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
          minWidth: 180,
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
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setPage(1);
            }}
            style={{
              background: "none",
              border: "none",
              color: "#6b6b8e",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className="btn btn-primary"
        style={{ padding: "14px 28px" }}
      >
        {t("store.search")}
      </button>
    </form>
  );

  const resultsArea = (
    <>
      {/* Game grid */}
      {loading ? (
        <GameCardSkeletonGrid count={12} />
      ) : games.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b6b8e", padding: 60 }}>
          {t("store.noGames")}
        </p>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${gridMinWidth}px, 1fr))`,
              gap: 20,
              paddingBottom: 20,
            }}
          >
            {games.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>

          {totalPages > 1 && (
            <div style={{ paddingBottom: 40 }}>
              <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={games.length}
                pageSize={pageSize}
                setPage={setPage}
                variant="store"
              />
            </div>
          )}
        </>
      )}
    </>
  );

  return (
    <div>
      {/* Hero Banner — full width */}
      <HeroBanner games={featured} />

      <div className="container">
        {isDesktop ? (
          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <aside style={{ width: 260, flexShrink: 0 }}>
              {renderFilterContent(true)}
            </aside>
            <div style={{ flex: 1, minWidth: 0 }}>
              {searchBar}
              {resultsArea}
            </div>
          </div>
        ) : (
          <>
            {searchBar}
            {/* Filter toggle button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "14px 20px",
                background: showFilters ? "var(--accent)" : "#16162a",
                color: showFilters ? "#fff" : "#ccc",
                border: showFilters ? "none" : "1px solid #2a2a4a",
                borderRadius: 12,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.15s",
                marginBottom: showFilters ? 0 : 20,
              }}
            >
              <Filter size={18} />
              {showFilters ? null : t("store.filters")}
              {activeFilterCount > 0 && !showFilters && (
                <span
                  style={{
                    background: "var(--accent)",
                    color: "#fff",
                    borderRadius: 10,
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 700,
                    marginLeft: 4,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* Collapsible Filter Panel */}
            {showFilters && (
              <div style={{ marginBottom: 20, marginTop: 10 }}>
                {renderFilterContent()}
              </div>
            )}
            {resultsArea}
          </>
        )}
      </div>
    </div>
  );
}
