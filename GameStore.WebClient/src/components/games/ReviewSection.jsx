// GameStore.WebClient/src/components/games/ReviewSection.jsx
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ReviewSection({
  reviews,
  reviewPage,
  totalReviewPages,
  hasReviewed,
  showReviewForm,
  reviewForm,
  submittingReview,
  owned,
  gameTitle,
  submitReview,
  loadReviews,
  setShowReviewForm,
  setReviewForm,
}) {
  const { t } = useTranslation();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>
          {t("gameDetail.playerReviews")}
        </h2>
        {owned && !hasReviewed && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            style={{ padding: "10px 24px", background: "#fff", color: "#000", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap" }}
          >
            {t("gameDetail.writeReview")}
          </button>
        )}
      </div>

      {showReviewForm && (
        <form
          onSubmit={submitReview}
          style={{ background: "#1e1e1e", borderRadius: 8, padding: 24, marginBottom: 30, border: "1px solid #333" }}
        >
          <h3 style={{ marginBottom: 16, fontSize: 14, fontWeight: 600 }}>
            {t("gameDetail.yourReview")}
          </h3>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 12 }}>
              {t("gameDetail.ratingLabel")}
            </label>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={20}
                  fill={s <= reviewForm.rating ? "#f7b731" : "none"}
                  color="#f7b731"
                  style={{ cursor: "pointer" }}
                  onClick={() => setReviewForm({ ...reviewForm, rating: s })}
                />
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: "block", marginBottom: 6, color: "#888", fontSize: 12 }}>
              {t("gameDetail.content")}
            </label>
            <textarea
              value={reviewForm.content}
              onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
              placeholder={t("gameDetail.reviewPlaceholder")}
              rows={4}
              style={{ width: "100%", padding: "12px", background: "#0a0a10", border: "1px solid #333", borderRadius: 4, color: "#fff", fontSize: 13, resize: "vertical", outline: "none" }}
              required
            />
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, color: "#ccc", fontSize: 13, marginBottom: 12, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={reviewForm.isRecommended}
              onChange={(e) => setReviewForm({ ...reviewForm, isRecommended: e.target.checked })}
            />
            {t("gameDetail.recommend")}
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submittingReview} className="btn-primary" style={{ padding: "10px 20px" }}>
              {submittingReview ? t("gameDetail.submitting") : t("gameDetail.submitReview")}
            </button>
            <button type="button" onClick={() => setShowReviewForm(false)} className="btn-outline" style={{ padding: "10px 20px" }}>
              {t("gameDetail.cancel")}
            </button>
          </div>
        </form>
      )}

      {reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60 }}>
          <Star size={64} color="#333" />
          <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 20, letterSpacing: -0.5 }}>
            {t("gameDetail.noReviews")}
          </h2>
          <p style={{ color: "#888", marginTop: 8, fontSize: 14 }}>
            {t("gameDetail.beFirst", { game: gameTitle })}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {reviews.map((review) => (
            <div key={review.id} style={{ background: "#1e1e1e", borderRadius: 8, padding: 20, border: "1px solid #333" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{review.username}</span>
                  <div style={{ display: "flex", gap: 2 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill={s <= review.rating ? "#f7b731" : "none"} color="#f7b731" />
                    ))}
                  </div>
                </div>
                <span style={{ color: "#888", fontSize: 11 }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p style={{ color: "#ccc", fontSize: 13, lineHeight: 1.5 }}>{review.content}</p>
              {review.isRecommended && (
                <p style={{ color: "#4caf50", fontSize: 11, marginTop: 8 }}>
                  {t("gameDetail.recommended")}
                </p>
              )}
            </div>
          ))}
          {totalReviewPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
              <button
                disabled={reviewPage === 1}
                onClick={() => loadReviews(reviewPage - 1)}
                style={{ padding: "6px 12px", background: "#2a2a2a", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer" }}
              >
                ←
              </button>
              <span style={{ color: "#888", fontSize: 13, padding: "6px 0" }}>
                {t("gameDetail.pageOf", { page: reviewPage, total: totalReviewPages })}
              </span>
              <button
                disabled={reviewPage === totalReviewPages}
                onClick={() => loadReviews(reviewPage + 1)}
                style={{ padding: "6px 12px", background: "#2a2a2a", border: "none", borderRadius: 4, color: "#fff", cursor: "pointer" }}
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
