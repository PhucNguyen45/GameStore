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
import { epicPrimaryBtn, epicSecondaryBtn, epicWishlistBtn } from "../components/games/gameDetailStyles";

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
      toast.error(t("gameDetail.wishlistError"));
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

  const formattedReleaseDate = useMemo(() =>
    game?.releaseDate ? new Date(game.releaseDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "",
    [game?.releaseDate]
  );
  const formattedShortDate = useMemo(() =>
    game?.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : "",
    [game?.releaseDate]
  );
  const genreNames = useMemo(() =>
    game?.gameGenres?.map((g) => g.genre?.name).join(", ") || "-",
    [game?.gameGenres]
  );

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
                borderRadius: 4,
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
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
            {owned ? (
              <>
                <button style={{ ...epicPrimaryBtn, background: "#4caf50", cursor: "default" }}>
                  <Check size={16} style={{ marginRight: 6 }} /> {t("gameDetail.ownedLib")}
                </button>
              </>
            ) : game.price === 0 ? (
              <button
                style={{ ...epicPrimaryBtn, width: isMobile ? "100%" : "auto" }}
                onClick={async () => {
                  if (!user) { navigate("/login"); return; }
                  try {
                    await orderAPI.create({ items: [{ gameId: game.id, quantity: 1 }] });
                    setOwned(true);
                    toast.success(t("gameDetail.freeClaimSuccess"));
                  } catch (e) {
                    toast.error(e.response?.data?.message || t("gameDetail.freeClaimError"));
                  }
                }}
              >
                {t("gameDetail.free")}
              </button>
            ) : (
              <>
                <button style={{ ...epicPrimaryBtn, width: isMobile ? "100%" : "auto", justifyContent: "center" }} onClick={handleBuyNow}>
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
                  style={{ ...epicSecondaryBtn, width: isMobile ? "100%" : "auto", justifyContent: "center" }}
                  onClick={() => { addItem(game); toast.success(t("gameDetail.addedToCart")); }}
                >
                  <ShoppingCart size={16} /> {t("gameDetail.addToCart")}
                </button>
              </>
            )}
            <button
              onClick={toggleWishlist}
              style={{
                ...epicWishlistBtn,
                background: wishlisted ? "#e94560" : "transparent",
                borderColor: wishlisted ? "#e94560" : "#fff",
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
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 60 }} className="game-detail-grid">
            <div>
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
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "absolute",
                          inset: 0,
                          color: "#555",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <Image size={32} />
                        <span style={{ fontSize: 12 }}>{t("gameDetail.screenshotNotFound")}</span>
                      </div>
                    ) : (
                      <img
                        src={screenshots[screenshotIndex]}
                        alt={`Screenshot ${screenshotIndex + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          transition: "opacity 0.3s ease",
                        }}
                        onError={() => setScreenshotError(true)}
                      />
                    )}

                    {/* NAV ARROWS */}
                    {screenshots.length > 1 && (
                      <>
                        <button
                          onClick={prevScreenshot}
                          style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                            opacity: 0,
                            zIndex: 2,
                          }}
                          className="carousel-arrow"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={nextScreenshot}
                          style={{
                            position: "absolute",
                            right: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            border: "none",
                            background: "rgba(0,0,0,0.6)",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                            opacity: 0,
                            zIndex: 2,
                          }}
                          className="carousel-arrow"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}

                    {/* COUNTER BADGE */}
                    {screenshots.length > 1 && (
                      <span
                        style={{
                          position: "absolute",
                          bottom: 12,
                          right: 12,
                          padding: "4px 10px",
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          background: "rgba(0,0,0,0.7)",
                          color: "#fff",
                          letterSpacing: 0.5,
                          zIndex: 2,
                        }}
                      >
                        {screenshotIndex + 1} / {screenshots.length}
                      </span>
                    )}
                  </div>

                  {/* THUMBNAIL STRIP */}
                  {screenshots.length > 1 && (
                    <div
                      className="thumbnail-strip"
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 10,
                        overflowX: "auto",
                        paddingBottom: 4,
                      }}
                    >
                      {screenshots.map((url, i) => (
                        <button
                          key={i}
                          onClick={() => setScreenshotIndex(i)}
                          style={{
                            position: "relative",
                            flexShrink: 0,
                            width: 120,
                            height: 68,
                            borderRadius: 4,
                            overflow: "hidden",
                            border: i === screenshotIndex ? "2px solid #fff" : "2px solid transparent",
                            background: "#1a1a1a",
                            cursor: "pointer",
                            padding: 0,
                            transition: "all 0.2s",
                            opacity: i === screenshotIndex ? 1 : 0.5,
                          }}
                          onMouseEnter={(e) => { if (i !== screenshotIndex) e.currentTarget.style.opacity = "0.8"; }}
                          onMouseLeave={(e) => { if (i !== screenshotIndex) e.currentTarget.style.opacity = "0.5"; }}
                        >
                          {/* Skeleton placeholder (behind image) */}
                          {!thumbLoaded.has(i) && !thumbErrored.has(i) && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                background: "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)",
                                backgroundSize: "200% 100%",
                                animation: "shimmer 1.5s ease-in-out infinite",
                              }}
                            />
                          )}
                          {/* Error fallback (over image) */}
                          {thumbErrored.has(i) && (
                            <div
                              style={{
                                position: "absolute",
                                inset: 0,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#1a1a1a",
                              }}
                            >
                              <Image size={16} color="#444" />
                            </div>
                          )}
                          {/* Actual image (always rendered for lazy to work) */}
                          <img
                            src={url}
                            alt={`Thumbnail ${i + 1}`}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              display: "block",
                              opacity: thumbLoaded.has(i) || thumbErrored.has(i) ? 1 : 0,
                              transition: "opacity 0.25s ease",
                            }}
                            onLoad={() => setThumbLoaded((prev) => new Set([...prev, i]))}
                            onError={() => {
                              setThumbErrored((prev) => new Set([...prev, i]));
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {[
                  { label: t("gameDetail.developer"), value: game.developer },
                  { label: t("gameDetail.publisher"), value: game.publisher },
                  {
                    label: t("gameDetail.releaseDate"),
                    value: formattedReleaseDate,
                  },
                  { label: t("gameDetail.platform"), value: t("gameDetail.windowsPc") },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p style={{ fontSize: 10, color: "#666", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
                      {label}
                    </p>
                    <p style={{ fontSize: 13, color: "#ccc" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ background: "#1e1e1e", borderRadius: 8, padding: 20, border: "1px solid #333", marginBottom: 20 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
                  {t("gameDetail.playerReviews")}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", border: "2px solid #f7b731", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#f7b731" }}>{game.rating?.toFixed(1)}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={16} fill={s <= Math.round(game.rating) ? "#f7b731" : "none"} color="#f7b731" />
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      {t("gameDetail.reviewsCount", { count: game.ratingCount })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("reviews")}
                  style={{ width: "100%", padding: "10px", background: "transparent", color: "#fff", border: "1px solid #444", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600, letterSpacing: 1, whiteSpace: "nowrap" }}
                >
                  {t("gameDetail.viewAllReviews")}
                </button>
              </div>
              <div style={{ background: "#1e1e1e", borderRadius: 8, padding: 20, border: "1px solid #333" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>
                  {t("gameDetail.info")}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    [t("gameDetail.genre"), genreNames],
                    [t("gameDetail.releaseDate"), formattedShortDate],
                    [t("gameDetail.platform"), t("gameDetail.windowsPc")],
                    [t("gameDetail.developer"), game.developer || "-"],
                    [t("gameDetail.publisher"), game.publisher || "-"],
                  ].map(([label, value]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 12, color: "#888" }}>{label}</span>
                      <span style={{ fontSize: 12, color: "#ccc", textAlign: "right", maxWidth: 180 }}>{value || "-"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
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
