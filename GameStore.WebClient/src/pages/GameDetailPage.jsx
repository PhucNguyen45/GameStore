// GameStore.WebClient/src/pages/GameDetailPage.jsx
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatVND } from "../utils/format";
import { useResponsive } from "../hooks/useResponsive";
import {
  gameAPI,
  libraryAPI,
  orderAPI,
  wishlistAPI,
  reviewAPI,
} from "../services/api";
import useCartStore from "../stores/cartStore";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import TrailerPlayer from "../components/games/TrailerPlayer";
import GameDetailSkeleton from "../components/games/GameDetailSkeleton";
import GameNotFound from "../components/games/GameNotFound";
import RequirementsSection from "../components/games/RequirementsSection";
import GameKeysSection from "../components/games/GameKeysSection";
import ReviewSection from "../components/games/ReviewSection";
import OverviewSection from "../components/games/OverviewSection";
import {
  Star,
  ShoppingCart,
  Monitor,
  Heart,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Image,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GameDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const [wishlisted, setWishlisted] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [gameKeys, setGameKeys] = useState([]);
  const [keysLoading, setKeysLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: "",
    isRecommended: true,
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [screenshotError, setScreenshotError] = useState(false);
  const [thumbLoaded, setThumbLoaded] = useState(new Set());
  const [thumbErrored, setThumbErrored] = useState(new Set());

  useEffect(() => {
    gameAPI
      .getById(id)
      .then((res) => setGame(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user && id) {
      libraryAPI
        .checkOwned(id)
        .then((res) => setOwned(res.data.owned))
        .catch(() => setOwned(false));
      wishlistAPI
        .check(id)
        .then((res) => setWishlisted(res.data.isWishlisted))
        .catch(() => setWishlisted(false));
    } else {
      setOwned(false);
      setWishlisted(false);
    }
  }, [user, id]);

  const loadReviews = async (page = 1) => {
    try {
      const { data: response } = await reviewAPI.getByGame(id, page);
      setReviews(response.data || []);
      setTotalReviewPages(response.totalPages || 1);
      setReviewPage(page);
    } catch {}
  };

  useEffect(() => {
    if (activeTab === "reviews" && id) {
      loadReviews(1);
      if (user) {
        reviewAPI
          .check(id)
          .then((res) => setHasReviewed(res.data.reviewed))
          .catch(() => {});
      }
    }
    if (activeTab === "keys" && id && owned) {
      setKeysLoading(true);
      libraryAPI
        .getGameKeys(id)
        .then((res) => setGameKeys(res.data || []))
        .catch(() => setGameKeys([]))
        .finally(() => setKeysLoading(false));
    }
  }, [activeTab, id, user, owned]);

  const toggleWishlist = async () => {
    if (!user) {
      toast.error(t("wishlist.loginRequired"));
      navigate("/login");
      return;
    }
    try {
      if (wishlisted) {
        await wishlistAPI.remove(id);
        setWishlisted(false);
        toast.success(t("gameDetail.removedFromWishlist"));
      } else {
        await wishlistAPI.add(id);
        setWishlisted(true);
        toast.success(t("gameDetail.addedToWishlist"));
      }
    } catch {
      toast.error(t("gameDetail.wishlistError"));
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error(t("gameDetail.loginToBuy"));
      navigate("/login");
      return;
    }
    addItem(game);
    navigate("/cart");
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.content.trim()) return;
    setSubmittingReview(true);
    try {
      await reviewAPI.create({ gameId: parseInt(id), ...reviewForm });
      toast.success(t("gameDetail.reviewSubmitted"));
      setShowReviewForm(false);
      setReviewForm({ rating: 5, content: "", isRecommended: true });
      setHasReviewed(true);
      loadReviews(1);
      gameAPI.getById(id).then((res) => setGame(res.data));
    } catch (err) {
      toast.error(err.response?.data?.message || t("gameDetail.reviewFailed"));
    } finally {
      setSubmittingReview(false);
    }
  };

  // All hooks BEFORE early returns — React Rules of Hooks
  const discount = useMemo(() => game?.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0, [game?.discountPrice, game?.price]);
  const finalPrice = useMemo(() => game?.discountPrice || game?.price, [game?.discountPrice, game?.price]);

  const screenshots = useMemo(() => {
    try {
      const parsed = JSON.parse(game?.screenshots || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  }, [game?.screenshots]);



  // Reset screenshotIndex when game changes
  useEffect(() => {
    setScreenshotIndex(0);
    setScreenshotError(false);
    setThumbLoaded(new Set());
    setThumbErrored(new Set());
  }, [game?.id]);

  const prevScreenshot = () => {
    setScreenshotIndex((i) => (i <= 0 ? screenshots.length - 1 : i - 1));
    setScreenshotError(false);
  };
  const nextScreenshot = () => {
    setScreenshotIndex((i) => (i >= screenshots.length - 1 ? 0 : i + 1));
    setScreenshotError(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (activeTab !== "overview" || screenshots.length <= 1) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); prevScreenshot(); }
      if (e.key === "ArrowRight") { e.preventDefault(); nextScreenshot(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeTab, screenshots.length]);

  if (loading) return <GameDetailSkeleton />;
  if (!game) return <GameNotFound />;

  return (
    <div
      style={{
        background: "#121212",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* HERO */}
      <div
        style={{
          background: `linear-gradient(0deg, #121212 0%, rgba(18,18,18,0.6) 100%), url(${game.coverImageUrl}) center/cover no-repeat`,
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, #121212 10%, transparent 50%, rgba(0,0,0,0.4) 100%)",
          }}
        />
        <div
          className="container"
          style={{
            paddingBottom: 60,
            width: "100%",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                padding: "4px 12px",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 1,
                background: "#ffffff20",
                color: "#fff",
                border: "1px solid #ffffff30",
                textTransform: "uppercase",
              }}
            >
              {t("gameDetail.available")}
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 64px)",
              fontWeight: 900,
              letterSpacing: -2,
              lineHeight: 1,
              marginBottom: 16,
              maxWidth: 800,
            }}
          >
            {game.title}
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#ccc",
              maxWidth: 600,
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            {game.description?.substring(0, 150)}...
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {game.gameGenres?.map((gg) => (
              <span
                key={gg.genreId}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                  background: "#ffffff15",
                  color: "#aaa",
                  border: "1px solid #ffffff20",
                }}
              >
                {gg.genre?.name}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            {game.rating > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Star size={18} fill="#f7b731" color="#f7b731" />
                <span style={{ fontSize: 16, fontWeight: 700 }}>
                  {game.rating?.toFixed(1)}
                </span>
                <span style={{ color: "#888", fontSize: 13 }}>
                  ({game.ratingCount?.toLocaleString()})
                </span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#aaa", fontSize: 13 }}>
              <Monitor size={16} /> {t("gameDetail.windowsPc")}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
            {owned ? (
              <>
                <button className="btn btn-primary" style={{ background: "#4caf50", cursor: "default", border: "none" }}>
                  <Check size={16} style={{ marginRight: 6 }} /> {t("gameDetail.ownedLib")}
                </button>
              </>
            ) : game.price > 0 && game.availableKeys !== undefined && game.availableKeys <= 0 ? (
              <>
                <button disabled className="btn btn-primary" style={{ opacity: 0.5 }}>
                  {t("gameDetail.outOfStock")}
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary" style={{ width: isMobile ? "100%" : "auto" }} onClick={handleBuyNow}>
                  {t("gameDetail.buyNow")}
                  <span style={{ marginLeft: 10, fontSize: 14, fontWeight: 400, opacity: 0.9 }}>
                    {discount > 0 && (
                      <span style={{ textDecoration: "line-through", marginRight: 8, fontSize: 12, opacity: 0.6 }}>
                        {formatVND(game.price || 0)}
                      </span>
                    )}
                    {formatVND(finalPrice || 0)}
                  </span>
                </button>
                <button
                  className="btn btn-outline"
                  style={{ width: isMobile ? "100%" : "auto" }}
                  onClick={() => { addItem(game); toast.success(t("gameDetail.addedToCart")); }}
                >
                  <ShoppingCart size={16} /> {t("gameDetail.addToCart")}
                </button>
              </>
            )}
            <button
              onClick={toggleWishlist}
              className="btn btn-ghost"
              style={{
                padding: 12,
                background: wishlisted ? "#e94560" : "transparent",
                border: `1px solid ${wishlisted ? "#e94560" : "rgba(255,255,255,0.6)"}`,
                borderRadius: 10,
                minWidth: 44,
                justifyContent: "center",
              }}
            >
              <Heart
                size={16}
                fill={wishlisted ? "#ffffff" : "none"}
                color="#ffffff"
              />
            </button>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            <span style={{ padding: "2px 6px", background: "#333", borderRadius: 3, fontSize: 11, fontWeight: 700, color: "#aaa" }}>
              {t("gameDetail.waitingRating")}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#888" }}>
              <Users size={14} /> {t("gameDetail.singlePlayer")}
            </span>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: "#1a1a1a", borderBottom: "1px solid #333", position: "sticky", top: 0, zIndex: 100, overflowX: "auto" }}>
        <div className="container" style={{ display: "flex", gap: 0, minWidth: "fit-content" }}>
          {[
            { id: "overview", label: t("gameDetail.tabOverview") },
            { id: "requirements", label: t("gameDetail.tabRequirements") },
            { id: "keys", label: t("gameDetail.tabKeys") },
            { id: "reviews", label: t("gameDetail.tabReviews") },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "18px 24px",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                background: "transparent",
                color: activeTab === tab.id ? "#fff" : "#888",
                borderBottom: activeTab === tab.id ? "3px solid #fff" : "3px solid transparent",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 40 }}>
        {activeTab === "overview" && (
          <OverviewSection game={game} setActiveTab={setActiveTab}>
            {/* GAME DESCRIPTION */}
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, letterSpacing: -0.5 }}>
              {t("gameDetail.about", { game: game.title?.toUpperCase() })}
            </h2>
            <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.8, marginBottom: 30 }}>
              {game.description}
            </p>

            {/* TRAILER PLAYER */}
            {game.trailerUrl && (
              <TrailerPlayer
                trailerUrl={game.trailerUrl}
                poster={screenshots[0] || game.coverImageUrl}
                title={game.title}
              />
            )}

            {/* SCREENSHOTS CAROUSEL */}
            {screenshots.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <div
                  className="carousel-container"
                  style={{
                    position: "relative",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#1a1a1a",
                    aspectRatio: "16 / 9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {screenshotError ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "absolute", inset: 0, color: "#555", flexDirection: "column", gap: 8 }}>
                      <Image size={32} />
                      <span style={{ fontSize: 12 }}>{t("gameDetail.screenshotNotFound")}</span>
                    </div>
                  ) : (
                    <img
                      src={screenshots[screenshotIndex]}
                      alt={`Screenshot ${screenshotIndex + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.3s ease" }}
                      onError={() => setScreenshotError(true)}
                    />
                  )}
                  {screenshots.length > 1 && (
                    <>
                      <button onClick={prevScreenshot} className="carousel-arrow" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", opacity: 0, zIndex: 2 }}>
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={nextScreenshot} className="carousel-arrow" style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", opacity: 0, zIndex: 2 }}>
                        <ChevronRight size={20} />
                      </button>
                    </>
                  )}
                  {screenshots.length > 1 && (
                    <span style={{ position: "absolute", bottom: 12, right: 12, padding: "4px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700, background: "rgba(0,0,0,0.7)", color: "#fff", letterSpacing: 0.5, zIndex: 2 }}>
                      {screenshotIndex + 1} / {screenshots.length}
                    </span>
                  )}
                </div>
                {screenshots.length > 1 && (
                  <div className="thumbnail-strip" style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 }}>
                    {screenshots.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setScreenshotIndex(i)}
                        style={{ position: "relative", flexShrink: 0, width: 120, height: 68, borderRadius: 4, overflow: "hidden", border: i === screenshotIndex ? "2px solid #fff" : "2px solid transparent", background: "#1a1a1a", cursor: "pointer", padding: 0, transition: "all 0.2s", opacity: i === screenshotIndex ? 1 : 0.5 }}
                        onMouseEnter={(e) => { if (i !== screenshotIndex) e.currentTarget.style.opacity = "0.8"; }}
                        onMouseLeave={(e) => { if (i !== screenshotIndex) e.currentTarget.style.opacity = "0.5"; }}
                      >
                        {!thumbLoaded.has(i) && !thumbErrored.has(i) && (
                          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s ease-in-out infinite" }} />
                        )}
                        {thumbErrored.has(i) && (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#1a1a1a" }}>
                            <Image size={16} color="#444" />
                          </div>
                        )}
                        <img
                          src={url}
                          alt={`Thumbnail ${i + 1}`}
                          loading="lazy"
                          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", opacity: thumbLoaded.has(i) || thumbErrored.has(i) ? 1 : 0, transition: "opacity 0.25s ease" }}
                          onLoad={() => setThumbLoaded((prev) => new Set([...prev, i]))}
                          onError={() => setThumbErrored((prev) => new Set([...prev, i]))}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </OverviewSection>
        )}

        {activeTab === "requirements" && (
          <RequirementsSection game={game} />
        )}

        {activeTab === "keys" && (
          <GameKeysSection
            user={user}
            owned={owned}
            gameKeys={gameKeys}
            keysLoading={keysLoading}
            handleBuyNow={handleBuyNow}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewSection
            reviews={reviews}
            reviewPage={reviewPage}
            totalReviewPages={totalReviewPages}
            hasReviewed={hasReviewed}
            showReviewForm={showReviewForm}
            reviewForm={reviewForm}
            submittingReview={submittingReview}
            owned={owned}
            gameTitle={game.title}
            submitReview={submitReview}
            loadReviews={loadReviews}
            setShowReviewForm={setShowReviewForm}
            setReviewForm={setReviewForm}
          />
        )}
      </div>
    </div>
  );
}
