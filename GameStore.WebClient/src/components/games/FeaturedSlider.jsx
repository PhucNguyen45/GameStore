// GameStore.WebClient/src/components/games/FeaturedSlider.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

export default function FeaturedSlider({ games }) {
  if (!games?.length) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={20}
      slidesPerView={1}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true, dynamicBullets: true }}
      navigation
      style={{
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 30,
        height: 400,
      }}
    >
      {games.slice(0, 6).map((game, i) => (
        <SwiperSlide key={game.id}>
          <Link to={`/game/${game.id}`}>
            <div
              style={{
                width: "100%",
                height: "100%",
                background: `linear-gradient(135deg, ${["#1a1a3e", "#2a1a3e", "#1a2a3e", "#2a2a1e", "#3e1a1a", "#1a3e2a"][i]}, #0a0a15)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  textAlign: "center",
                  padding: 40,
                }}
              >
                <h2
                  style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: "#fff",
                    marginBottom: 12,
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {game.title}
                </h2>
                <p
                  style={{
                    fontSize: 16,
                    color: "#aaa",
                    maxWidth: 500,
                    margin: "0 auto 20px",
                  }}
                >
                  {game.description?.substring(0, 120)}...
                </p>
                <div
                  style={{ display: "flex", gap: 16, justifyContent: "center" }}
                >
                  <span
                    style={{
                      background: "#e94560",
                      color: "#fff",
                      padding: "8px 24px",
                      borderRadius: 8,
                      fontWeight: 700,
                      fontSize: 20,
                    }}
                  >
                    ${(game.discountPrice || game.price)?.toFixed(2)}
                  </span>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      padding: "8px 24px",
                      borderRadius: 8,
                      fontWeight: 600,
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    View Details →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
