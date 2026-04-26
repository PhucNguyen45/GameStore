import { useState, useEffect } from "react";
import { gameAPI, genreAPI } from "../services/api";
import GameCard from "../components/games/GameCard";
import FeaturedSlider from "../components/games/FeaturedSlider";
import { Gamepad2, TrendingUp, Star, Zap } from "lucide-react";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);

  useEffect(() => {
    Promise.all([gameAPI.getFeatured(12), genreAPI.getAll()])
      .then(([g, gn]) => {
        setGames(g.data);
        setGenres(gn.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filterByGenre = async (genreId) => {
    const newGenre = genreId === activeGenre ? null : genreId;
    setActiveGenre(newGenre);
    try {
      const res = newGenre
        ? await gameAPI.getAll({ genreId: newGenre })
        : await gameAPI.getFeatured(12);
      setGames(newGenre ? res.data.data : res.data);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Gamepad2
            size={48}
            color="#e94560"
            style={{ animation: "spin 2s linear infinite", marginBottom: 16 }}
          />
          <p style={{ color: "#6b6b8e" }}>Loading games...</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    );

  const featured = games?.slice(0, 6) || [];
  const trending = games?.filter((g) => g.rating > 4) || [];
  const newReleases =
    games?.filter(
      (g) => new Date(g.releaseDate) > new Date(Date.now() - 30 * 86400000),
    ) || [];

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      {/* Hero Slider */}
      <FeaturedSlider games={featured} />

      {/* Genre Filter */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 30,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => filterByGenre(null)}
          className={!activeGenre ? "btn-primary" : "btn-outline"}
          style={{ padding: "8px 18px", fontSize: 13, borderRadius: 20 }}
        >
          <Zap size={14} style={{ verticalAlign: "middle", marginRight: 4 }} />{" "}
          All Games
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => filterByGenre(g.id)}
            className={activeGenre === g.id ? "btn-primary" : "btn-outline"}
            style={{ padding: "8px 18px", fontSize: 13, borderRadius: 20 }}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Trending Section */}
      {trending.length > 0 && (
        <>
          <h2
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 22,
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <TrendingUp size={24} color="#e94560" /> Trending Now
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
              marginBottom: 40,
            }}
          >
            {trending.slice(0, 4).map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        </>
      )}

      {/* All Games */}
      <h2
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 22,
          fontWeight: 700,
          marginBottom: 20,
        }}
      >
        <Gamepad2 size={24} color="#e94560" />{" "}
        {activeGenre
          ? genres.find((g) => g.id === activeGenre)?.name + " Games"
          : "All Games"}
      </h2>
      {games.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b6b8e", padding: 40 }}>
          No games found in this category.
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
