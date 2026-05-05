// GameStore.WebClient/src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gameAPI, genreAPI } from "../services/api";
import GameCard from "../components/games/GameCard";
import FeartureSlider from "../components/games/FeaturedSlider";
import { Gamepad2, TrendingUp, Star, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [games, setGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([gameAPI.getFeatured(12), genreAPI.getAll()])
      .then(([g, gn]) => {
        setGames(g.data);
        setFeaturedGames(g.data.slice(0, 6));
        setGenres(gn.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: 80, color: "#888" }}
      >
        Loading...
      </div>
    );

  const featured = games.slice(0, 6);
  const trending = games.filter((g) => g.rating > 4).slice(0, 8);

  return (
    <div>
      {/* Featured slider */}
      <FeaturedSlider games={featuredGames} />

      {/* HERO */}
      <div
        style={{
          background: "linear-gradient(180deg, #0a0a1a 0%, #121212 100%)",
          padding: "60px 0",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: 600 }}>
            <h1
              style={{
                fontSize: 42,
                fontWeight: 900,
                marginBottom: 16,
                letterSpacing: -1,
              }}
            >
              DISCOVER
              <br />
              <span style={{ color: "var(--accent)" }}>YOUR NEXT</span>
              <br />
              FAVORITE GAME
            </h1>
            <p
              style={{
                color: "#888",
                fontSize: 16,
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              Explore a vast library of games from AAA blockbusters to indie
              gems. Buy once, play forever.
            </p>
            <Link to="/store">
              <button
                className="btn-primary"
                style={{
                  padding: "14px 32px",
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                BROWSE STORE <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* FEATURED */}
      <div className="container" style={{ marginTop: -40 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Star size={20} color="var(--accent)" fill="var(--accent)" /> FEATURED
          GAMES
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {featured.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </div>
      {/* TRENDING */}
      <div className="container" style={{ marginTop: 40 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <TrendingUp size={20} color="var(--accent)" /> TRENDING NOW
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {trending.map((g) => (
            <GameCard key={g.id} game={g} />
          ))}
        </div>
      </div>
      {/* GENRES */}
      <div className="container" style={{ marginTop: 40, paddingBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>
          BROWSE BY GENRE
        </h2>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {genres.map((g) => (
            <Link key={g.id} to={`/store?genre=${g.id}`}>
              <button
                className="btn-outline"
                style={{ padding: "10px 20px", fontSize: 13, borderRadius: 2 }}
              >
                {g.name}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
