// GameStore.WebClient/src/components/store/HeroBanner.jsx
import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import useCartStore from "../../stores/cartStore";
import { useAuth } from "../../contexts/AuthContext";
import { formatVND } from "../../utils/format";
import toast from "react-hot-toast";

export default function HeroBanner({ games }) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuth();

  const totalSlides = games?.length || 0;

  // Auto rotate every 6s, pause on hover
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused]);

  const goTo = useCallback((index) => {
    setCurrent(((index % totalSlides) + totalSlides) % totalSlides);
  }, [totalSlides]);

  const prev = useCallback(() => goTo(current - 1), [current, goTo]);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") { prev(); }
      if (e.key === "ArrowRight") { next(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [prev, next]);

  if (!games || games.length === 0) return null;

  const handleAddToCart = (e, g) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      toast.error("Đăng nhập để mua hàng");
      navigate("/login");
      return;
    }
    if (g.availableKeys !== undefined && g.availableKeys <= 0) {
      toast.error("Game đã hết hàng");
      return;
    }
    addItem(g);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  return (
    <div
      className="hero-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className="hero-slides-wrapper">
        {games.map((g, i) => (
          <Link
            key={g.id}
            to={`/game/${g.id}`}
            className={`hero-slide ${i === current ? "hero-slide-active" : ""}`}
            style={{
              backgroundImage: `url(${g.coverImageUrl || ""})`,
            }}
          >
            {/* Gradient overlays */}
            <div className="hero-gradient-left" />
            <div className="hero-gradient-bottom" />

            {/* Content */}
            <div className="hero-content">
              {/* Discount badge */}
              {g.discountPrice > 0 && i === current && (
                <div className="hero-discount-badge">
                  <span className="hero-discount-pct">-{Math.round((1 - g.discountPrice / g.price) * 100)}%</span>
                  <span className="hero-discount-price">
                    {formatVND(g.discountPrice || 0)}
                  </span>
                </div>
              )}

              {/* Rating */}
              {g.rating > 0 && i === current && (
                <div className="hero-rating">
                  <Star size={14} fill="#f7b731" color="#f7b731" />
                  <span>{g.rating.toFixed(1)}</span>
                  <span className="hero-rating-count">({g.ratingCount})</span>
                </div>
              )}

              {/* Title */}
              <h2 className="hero-title">{g.title}</h2>

              {/* Description */}
              <p className="hero-desc">
                {g.description?.substring(0, 180)}
                {g.description?.length > 180 ? "..." : ""}
              </p>

              {/* Genres */}
              <div className="hero-genres">
                {g.gameGenres?.slice(0, 3).map((gg) => (
                  <span key={gg.genreId} className="hero-genre-tag">
                    {gg.genre?.name}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <div className="hero-actions">
                <button
                  className="hero-btn-primary"
                  onClick={(e) => handleAddToCart(e, g)}
                >
                  <ShoppingCart size={16} />
                  Thêm vào giỏ
                </button>
                <Link
                  to={`/game/${g.id}`}
                  className="hero-btn-secondary"
                  onClick={(e) => e.stopPropagation()}
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navigation arrows */}
      {totalSlides > 1 && (
        <>
          <button className="hero-arrow hero-arrow-left" onClick={(e) => { e.preventDefault(); prev(); }}>
            <ChevronLeft size={22} />
          </button>
          <button className="hero-arrow hero-arrow-right" onClick={(e) => { e.preventDefault(); next(); }}>
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Dots */}
      {totalSlides > 1 && (
        <div className="hero-dots">
          {games.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === current ? "hero-dot-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="hero-counter">
        <span className="hero-counter-current">{String(current + 1).padStart(2, "0")}</span>
        <span className="hero-counter-sep">/</span>
        <span className="hero-counter-total">{String(totalSlides).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
