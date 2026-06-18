// GameStore.WebClient/src/pages/WishlistPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { wishlistAPI } from "../../services/api";
import { Heart, Trash2, ShoppingCart, Star } from "lucide-react";
import useCartStore from "../../stores/cartStore";
import { GameCardSkeletonGrid } from "../../components/games";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { formatVND } from "../../utils/format";

export default function WishlistPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  const load = async () => {
    try {
      const { data } = await wishlistAPI.get();
      setItems(data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const remove = async (gameId) => {
    await wishlistAPI.remove(gameId);
    setItems(items.filter((i) => i.gameId !== gameId));
    toast.success(t("wishlist.removed"));
  };

  if (!user)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "80vh",
          background: "#121212",
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#1a1a1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Heart size={32} color="#e94560" />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 8, letterSpacing: -0.5 }}>
          {t("wishlist.loginRequired")}
        </h2>
        <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>
          {t("wishlist.loginDesc")}
        </p>
        <Link to="/login">
          <button className="btn btn-primary" style={{ padding: "12px 32px", fontSize: 13 }}>
            {t("library.signIn")}
          </button>
        </Link>
      </div>
    );
  if (loading)
    return (
      <div className="container" style={{ paddingTop: 30 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 24,
          }}
        >
          <Heart size={28} fill="#e94560" color="#e94560" /> {t("wishlist.title")}
        </div>
        <GameCardSkeletonGrid count={8} />
      </div>
    );

  return (
    <div className="container" style={{ paddingTop: 30 }}>
      <h1
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontSize: 26,
          fontWeight: 700,
          marginBottom: 24,
        }}
      >
        <Heart size={28} fill="#e94560" color="#e94560" /> {t("wishlist.title")} (
        {items.length})
      </h1>
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
          <Heart size={48} color="#444" />
          <p style={{ marginTop: 16 }}>{t("wishlist.empty")}</p>
          <Link
            to="/store"
            className="btn btn-primary"
            style={{ marginTop: 16, display: "inline-block" }}
          >
            {t("wishlist.browseGames")}
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 16,
          }}
        >
          {items.map((item) => (
            <div
              key={item.gameId}
              className="card"
              style={{ position: "relative", padding: 12 }}
            >
              <Link to={`/game/${item.gameId}`}>
                <div
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    background: "#2a2a2a",
                    borderRadius: 8,
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.coverImageUrl ? (
                    <img
                      src={item.coverImageUrl}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <span style={{ fontSize: 30, opacity: 0.3 }}>🎮</span>
                  )}
                </div>
                <h4
                  style={{
                    fontSize: 13,
                    color: "#ddd",
                    marginTop: 8,
                    marginBottom: 4,
                  }}
                >
                  {item.title}
                </h4>
                <span
                  style={{ color: "#e94560", fontWeight: 600, fontSize: 14 }}
                >
                  {formatVND(item.discountPrice || item.price || 0)}
                </span>
              </Link>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                {(item.price > 0 && item.availableKeys !== undefined && item.availableKeys <= 0) ? (
                  <button
                    disabled
                    className="btn"
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      borderRadius: 10,
                      background: "#e9456020",
                      border: "1px solid #e94560",
                      color: "#e94560",
                      cursor: "not-allowed",
                    }}
                  >
                    {t("gameDetail.outOfStock")}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      addItem({
                        id: item.gameId,
                        title: item.title,
                        price: item.price,
                        discountPrice: item.discountPrice,
                        coverImageUrl: item.coverImageUrl,
                      });
                      toast.success(t("wishlist.addedToCart"));
                    }}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      padding: "6px 10px",
                      fontSize: 11,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      borderRadius: 10,
                    }}
                  >
                    <ShoppingCart size={14} /> {t("wishlist.addToCart")}
                  </button>
                )}
                <button
                  onClick={() => remove(item.gameId)}
                  style={{
                    padding: "6px 10px",
                    background: "#2a2a2a",
                    border: "none",
                    borderRadius: 10,
                    color: "#e94560",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
