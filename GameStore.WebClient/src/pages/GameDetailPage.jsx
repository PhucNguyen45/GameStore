// GameStore.WebClient/src/pages/GameDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import {
  Star,
  ShoppingCart,
  Monitor,
  Cpu,
  HardDrive,
  Gamepad2,
  Heart,
  Users,
  Check,
  Play,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [owned, setOwned] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  // ===== WISHLIST STATE =====
  const [wishlisted, setWishlisted] = useState(false);

  // ===== REVIEWS STATE =====
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    content: "",
    isRecommended: true,
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  // ===== LOAD GAME =====
  useEffect(() => {
    gameAPI
      .getById(id)
      .then((res) => setGame(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  // ===== CHECK OWNED & WISHLIST =====
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

  // ===== LOAD REVIEWS WHEN TAB ACTIVE =====
  const loadReviews = async (page = 1) => {
    try {
      const { data } = await reviewAPI.getByGame(id, page);
      setReviews(data.reviews || data); // tuỳ backend trả về
      setTotalReviewPages(data.totalPages || 1);
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
  }, [activeTab, id, user]);

  // ===== WISHLIST TOGGLE =====
  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Đăng nhập để cho vào Yêu Thích");
      return;
    }
    try {
      if (wishlisted) {
        await wishlistAPI.remove(id);
        setWishlisted(false);
        toast.success("Xóa khỏi Yêu Thích");
      } else {
        await wishlistAPI.add(id);
        setWishlisted(true);
        toast.success("Đã thêm vào Yêu Thích");
      }
    } catch {
      toast.error("Lỗi khi tải Yêu Thích");
    }
  };

  // ===== BUY NOW =====
  const handleBuyNow = () => {
    if (!user) {
      toast.error("Đăng nhập để mua");
      navigate("/login");
      return;
    }
    addItem(game);
    navigate("/cart");
  };

  // ===== SUBMIT REVIEW =====
  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.content.trim()) return;
    setSubmittingReview(true);
    try {
      await reviewAPI.create({ gameId: parseInt(id), ...reviewForm });
      toast.success("Đã gửi đánh giá!");
      setShowReviewForm(false);
      setReviewForm({ rating: 5, content: "", isRecommended: true });
      setHasReviewed(true);
      // Reload reviews để có review mới + cập nhật rating game
      loadReviews(1);
      gameAPI.getById(id).then((res) => setGame(res.data)); // cập nhật rating mới
    } catch (err) {
      toast.error(err.response?.data?.message || "Gửi đánh giá thất bại!");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (!game) return <NotFound />;

  const discount = game.discountPrice
    ? Math.round((1 - game.discountPrice / game.price) * 100)
    : 0;
  const finalPrice = game.discountPrice || game.price;

  return (
    <div
      style={{
        background: "#121212",
        minHeight: "100vh",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ===== HERO ===== */}
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
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 40px 60px",
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
              Sẵn có
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
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              flexWrap: "wrap",
            }}
          >
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#aaa",
                fontSize: 13,
              }}
            >
              <Monitor size={16} /> Windows PC
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: 24,
            }}
          >
            {owned ? (
              <>
                <button
                  style={{
                    ...epicPrimaryBtn,
                    background: "#4caf50",
                    cursor: "default",
                  }}
                >
                  <Check size={16} style={{ marginRight: 6 }} /> ĐÃ CÓ TRONG THƯ
                  VIỆN
                </button>
                <button
                  style={epicSecondaryBtn}
                  onClick={() => navigate("/library")}
                >
                  ĐẾN THƯ VIỆN
                </button>
              </>
            ) : game.price === 0 ? (
              <button
                style={epicPrimaryBtn}
                onClick={async () => {
                  if (!user) {
                    navigate("/login");
                    return;
                  }
                  try {
                    await orderAPI.create({
                      items: [{ gameId: game.id, quantity: 1 }],
                    });
                    setOwned(true);
                    toast.success("Đã thêm game vào thư viện!");
                  } catch (e) {
                    toast.error(e.response?.data?.message || "Thất bại");
                  }
                }}
              >
                MIỄN PHÍ
              </button>
            ) : (
              <>
                <button style={epicPrimaryBtn} onClick={handleBuyNow}>
                  MUA NGAY
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 14,
                      fontWeight: 400,
                      opacity: 0.9,
                    }}
                  >
                    {discount > 0 && (
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: 8,
                          fontSize: 12,
                          opacity: 0.6,
                        }}
                      >
                        ${game.price?.toFixed(2)}
                      </span>
                    )}
                    ${finalPrice?.toFixed(2)}
                  </span>
                </button>
                <button
                  style={epicSecondaryBtn}
                  onClick={() => {
                    addItem(game);
                    toast.success("Added to cart!");
                  }}
                >
                  <ShoppingCart size={16} /> THÊM VÀO GIỎ HÀNG
                </button>
              </>
            )}
            {/* ===== WISHLIST BUTTON ===== */}
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
                color={wishlisted ? "#ffffff" : "inherit"}
              />
            </button>
          </div>
          <div style={{ display: "flex", gap: 20, marginTop: 20 }}>
            <span
              style={{
                padding: "2px 6px",
                background: "#333",
                borderRadius: 3,
                fontSize: 11,
                fontWeight: 700,
                color: "#aaa",
              }}
            >
              CHỜ XẾP HẠNG
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 12,
                color: "#888",
              }}
            >
              <Users size={14} /> Single Player
            </span>
          </div>
        </div>
      </div>

      {/* ===== TABS ===== */}
      <div
        style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #333",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: 1400,
            margin: "0 auto",
            padding: "0 40px",
            display: "flex",
            gap: 0,
          }}
        >
          {[
            { id: "overview", label: "TỔNG QUAN" },
            { id: "requirements", label: "CẤU HÌNH YÊU CẦU" },
            { id: "reviews", label: "ĐÁNH GIÁ" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "18px 28px",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 1.5,
                background: "transparent",
                color: activeTab === tab.id ? "#fff" : "#888",
                borderBottom:
                  activeTab === tab.id
                    ? "3px solid #fff"
                    : "3px solid transparent",
                transition: "all 0.2s",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===== TAB CONTENT ===== */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "40px" }}>
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 340px",
              gap: 60,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 20,
                  letterSpacing: -0.5,
                }}
              >
                VỀ {game.title?.toUpperCase()}
              </h2>
              <p
                style={{
                  color: "#aaa",
                  fontSize: 14,
                  lineHeight: 1.8,
                  marginBottom: 30,
                }}
              >
                {game.description}
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                }}
              >
                {[
                  { label: "Nhà phát triển", value: game.developer },
                  { label: "Nhà phát hành", value: game.publisher },
                  {
                    label: "Ngày phát hành",
                    value: new Date(game.releaseDate).toLocaleDateString(
                      "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    ),
                  },
                  { label: "Nền tảng", value: "Windows PC" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#666",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </p>
                    <p style={{ fontSize: 13, color: "#ccc" }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div
                style={{
                  background: "#1e1e1e",
                  borderRadius: 8,
                  padding: 20,
                  border: "1px solid #333",
                  marginBottom: 20,
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 16,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  ĐÁNH GIÁ CỦA NGƯỜI CHƠI
                </h3>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      border: "2px solid #f7b731",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        color: "#f7b731",
                      }}
                    >
                      {game.rating?.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 2 }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          fill={
                            s <= Math.round(game.rating) ? "#f7b731" : "none"
                          }
                          color="#f7b731"
                        />
                      ))}
                    </div>
                    <p style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                      {game.ratingCount?.toLocaleString()} reviews
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("reviews")}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "transparent",
                    color: "#fff",
                    border: "1px solid #444",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 1,
                  }}
                >
                  XEM TẤT CẢ ĐÁNH GIÁ
                </button>
              </div>
              <div
                style={{
                  background: "#1e1e1e",
                  borderRadius: 8,
                  padding: 20,
                  border: "1px solid #333",
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    marginBottom: 16,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                  }}
                >
                  THÔNG TIN CHI TIẾT
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {[
                    [
                      "Thể loại",
                      game.gameGenres?.map((g) => g.genre?.name).join(", "),
                    ],
                    [
                      "Ngày phát hành",
                      new Date(game.releaseDate).toLocaleDateString(),
                    ],
                    ["Nền tảng", "Windows PC"],
                    ["Nhà phát triển", game.developer],
                    ["Nhà phát hành", game.publisher],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: 12, color: "#888" }}>
                        {label}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "#ccc",
                          textAlign: "right",
                          maxWidth: 180,
                        }}
                      >
                        {value || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REQUIREMENTS TAB */}
        {activeTab === "requirements" && (
          <div style={{ maxWidth: 700 }}>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 30,
                letterSpacing: -0.5,
              }}
            >
              CẤU HÌNH YÊU CẦU
            </h2>
            <div
              style={{
                background: "#1e1e1e",
                borderRadius: 8,
                padding: "30px 32px",
                border: "1px solid #333",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {[
                  {
                    icon: Monitor,
                    label: "Hệ điều hành",
                    value: game.minimumOS,
                  },
                  {
                    icon: Cpu,
                    label: "Bộ xử lý",
                    value: game.minimumProcessor,
                  },
                  {
                    icon: HardDrive,
                    label: "Bộ nhớ",
                    value: game.minimumMemory,
                  },
                  {
                    icon: Gamepad2,
                    label: "Card đồ họa",
                    value: game.minimumGraphics,
                  },
                  {
                    icon: HardDrive,
                    label: "Dung lượng lưu trữ",
                    value: game.minimumStorage,
                  },
                ]
                  .filter((r) => r.value)
                  .map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      style={{ display: "flex", alignItems: "center", gap: 16 }}
                    >
                      <Icon size={16} color="#666" />
                      <span
                        style={{
                          fontSize: 12,
                          color: "#888",
                          minWidth: 120,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        {label}
                      </span>
                      <span style={{ fontSize: 14, color: "#ccc" }}>
                        {value}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== REVIEWS TAB (REAL) ===== */}
        {activeTab === "reviews" && (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 30,
              }}
            >
              <h2
                style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}
              >
                ĐÁNH GIÁ CỦA NGƯỜI CHƠI
              </h2>
              {owned && !hasReviewed && !showReviewForm && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  style={{
                    padding: "10px 24px",
                    background: "#fff",
                    color: "#000",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: 1,
                  }}
                >
                  VIẾT ĐÁNH GIÁ
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form
                onSubmit={submitReview}
                style={{
                  background: "#1e1e1e",
                  borderRadius: 8,
                  padding: 24,
                  marginBottom: 30,
                  border: "1px solid #333",
                }}
              >
                <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
                  Your Review
                </h3>
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      color: "#888",
                      fontSize: 12,
                    }}
                  >
                    Rating
                  </label>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={20}
                        fill={s <= reviewForm.rating ? "#f7b731" : "none"}
                        color="#f7b731"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setReviewForm({ ...reviewForm, rating: s })
                        }
                      />
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: 6,
                      color: "#888",
                      fontSize: 12,
                    }}
                  >
                    Content
                  </label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, content: e.target.value })
                    }
                    placeholder="Hãy viết trải nghiệm của bạn..."
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#0a0a10",
                      border: "1px solid #333",
                      borderRadius: 4,
                      color: "#fff",
                      fontSize: 13,
                      resize: "vertical",
                      outline: "none",
                    }}
                    required
                  />
                </div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "#ccc",
                    fontSize: 13,
                    marginBottom: 12,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={reviewForm.isRecommended}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        isRecommended: e.target.checked,
                      })
                    }
                  />
                  Tôi đề xuất tựa game này
                </label>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-primary"
                    style={{ padding: "10px 20px" }}
                  >
                    {submittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-outline"
                    style={{ padding: "10px 20px" }}
                  >
                    HỦY
                  </button>
                </div>
              </form>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <Star size={64} color="#333" />
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    marginTop: 20,
                    letterSpacing: -0.5,
                  }}
                >
                  CHƯA CÓ ĐÁNH GIÁ NÀO
                </h2>
                <p style={{ color: "#888", marginTop: 8, fontSize: 14 }}>
                  Be the first to review "{game.title}"
                </p>
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    style={{
                      background: "#1e1e1e",
                      borderRadius: 8,
                      padding: 20,
                      border: "1px solid #333",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: 14 }}>
                          {review.username}
                        </span>
                        <div style={{ display: "flex", gap: 2 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              fill={s <= review.rating ? "#f7b731" : "none"}
                              color="#f7b731"
                            />
                          ))}
                        </div>
                      </div>
                      <span style={{ color: "#888", fontSize: 11 }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: "#ccc", fontSize: 13, lineHeight: 1.5 }}>
                      {review.content}
                    </p>
                    {review.isRecommended && (
                      <p
                        style={{ color: "#4caf50", fontSize: 11, marginTop: 8 }}
                      >
                        👍 Được đề xuất
                      </p>
                    )}
                  </div>
                ))}
                {/* Pagination */}
                {totalReviewPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 8,
                      marginTop: 16,
                    }}
                  >
                    <button
                      disabled={reviewPage === 1}
                      onClick={() => loadReviews(reviewPage - 1)}
                      style={{
                        padding: "6px 12px",
                        background: "#2a2a2a",
                        border: "none",
                        borderRadius: 4,
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      ←
                    </button>
                    <span
                      style={{ color: "#888", fontSize: 13, padding: "6px 0" }}
                    >
                      Page {reviewPage} of {totalReviewPages}
                    </span>
                    <button
                      disabled={reviewPage === totalReviewPages}
                      onClick={() => loadReviews(reviewPage + 1)}
                      style={{
                        padding: "6px 12px",
                        background: "#2a2a2a",
                        border: "none",
                        borderRadius: 4,
                        color: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      →
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ===== STYLES (giữ nguyên) =====
const epicPrimaryBtn = {
  padding: "12px 28px",
  background: "#fff",
  color: "#000",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.5,
  display: "flex",
  alignItems: "center",
  transition: "opacity 0.2s",
};

const epicSecondaryBtn = {
  padding: "12px 28px",
  background: "transparent",
  color: "#fff",
  border: "1px solid #fff",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.5,
  display: "flex",
  alignItems: "center",
  gap: 6,
  transition: "all 0.2s",
};

const epicWishlistBtn = {
  padding: "12px",
  background: "transparent",
  color: "#fff",
  border: "1px solid #fff",
  borderRadius: 4,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  transition: "all 0.2s",
};

// ===== SUB COMPONENTS (giữ nguyên) =====
function LoadingSkeleton() {
  return (
    <div style={{ background: "#121212", minHeight: "100vh" }}>
      <div
        style={{
          height: "70vh",
          background: "#1e1e1e",
          display: "flex",
          alignItems: "flex-end",
          padding: "60px 40px",
        }}
      >
        <div>
          <div
            style={{
              width: 300,
              height: 48,
              background: "#333",
              borderRadius: 4,
              marginBottom: 16,
            }}
          />
          <div
            style={{
              width: 500,
              height: 20,
              background: "#333",
              borderRadius: 4,
              marginBottom: 24,
            }}
          />
          <div
            style={{
              width: 200,
              height: 48,
              background: "#333",
              borderRadius: 4,
            }}
          />
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: 100,
        background: "#121212",
        minHeight: "100vh",
        color: "#888",
      }}
    >
      <Gamepad2 size={64} />
      <h2 style={{ marginTop: 16, color: "#fff" }}>Không có game</h2>
      <Link
        to="/store"
        style={{
          color: "#fff",
          marginTop: 12,
          display: "inline-block",
          textDecoration: "underline",
        }}
      >
        Trở về Cửa Hàng
      </Link>
    </div>
  );
}
