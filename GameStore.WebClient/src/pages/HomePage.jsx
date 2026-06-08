// GameStore.WebClient/src/pages/HomePage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { gameAPI, genreAPI } from "../services/api";
import GameCard from "../components/games/GameCard";
import FeaturedSlider from "../components/games/FeaturedSlider";
import { HomePageSkeleton } from "../components/common/PageSkeleton";
import { Gamepad2, TrendingUp, Star, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation();
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

  if (loading) return <HomePageSkeleton />;

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
              {t("home.heroTitle")}
              <br />
              <span style={{ color: "var(--accent)" }}>{t("home.heroSubtitle")}</span>
              <br />
              {t("home.heroDescription")}
            </h1>
            <p
              style={{
                color: "#888",
                fontSize: 16,
                marginBottom: 32,
                lineHeight: 1.6,
              }}
            >
              {t("home.heroText")}
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
                {t("home.enterStore")} <ArrowRight size={18} />
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
          <Star size={20} color="var(--accent)" fill="var(--accent)" /> {t("home.featured")}
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
          <TrendingUp size={20} color="var(--accent)" /> {t("home.trending")}
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
          {t("home.browseGenres")}
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
