import { useState, useEffect } from "react";
import { gameAPI, genreAPI } from "../services/api";
import GameCard from "../components/games/GameCard";
import { Search, SlidersHorizontal, X } from "lucide-react";

export default function StorePage() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genreId, setGenreId] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("sales");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    genreAPI.getAll().then((r) => setGenres(r.data));
  }, []);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const params = { page: 1, pageSize: 24, sortBy: sort };
      if (search) params.keyword = search;
      if (genreId) params.genreId = genreId;
      if (maxPrice) params.maxPrice = maxPrice;
      const res = await gameAPI.getAll(params);
      setGames(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, [sort, genreId]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGames();
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
            placeholder="Search games by title or description..."
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
          Search
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
          <SlidersHorizontal size={18} /> Filters
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
            onChange={(e) => setGenreId(e.target.value)}
            style={selectStyle}
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Max Price $"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ ...selectStyle, width: 120 }}
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={selectStyle}
          >
            <option value="sales">Best Selling</option>
            <option value="rating">Highest Rated</option>
            <option value="price">Price: Low to High</option>
            <option value="release">Newest</option>
          </select>
          <button
            onClick={() => {
              setGenreId("");
              setMaxPrice("");
              setSort("sales");
              setShowFilters(false);
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
            }}
          >
            <X size={14} /> Clear
          </button>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <p style={{ textAlign: "center", color: "#6b6b8e", padding: 40 }}>
          Loading...
        </p>
      ) : games.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b6b8e", padding: 40 }}>
          No games found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 20,
            paddingBottom: 40,
          }}
        >
          {games.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
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
