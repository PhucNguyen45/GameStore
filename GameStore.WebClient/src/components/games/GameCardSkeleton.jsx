// GameStore.WebClient/src/components/games/GameCardSkeleton.jsx

const shimmerStyle = {
  background: "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
  borderRadius: 4,
};

export default function GameCardSkeleton({ compact = false }) {

  const cardWidth = compact ? "100%" : "100%";

  return (
    <div
      className="card"
      style={{
        position: "relative",
        overflow: "hidden",
        width: cardWidth,
      }}
    >
      {/* Cover image placeholder */}
      <div
        style={{
          width: "100%",
          aspectRatio: "16/9",
          ...shimmerStyle,
          borderRadius: 0,
        }}
      />

      {/* Content */}
      <div style={{ padding: compact ? 10 : 12 }}>
        {/* Title */}
        <div
          style={{
            height: compact ? 12 : 14,
            width: "75%",
            marginBottom: 6,
            ...shimmerStyle,
          }}
        />

        {/* Developer + Rating row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              height: compact ? 10 : 12,
              width: "40%",
              ...shimmerStyle,
            }}
          />
          <div
            style={{
              height: compact ? 10 : 12,
              width: "20%",
              ...shimmerStyle,
            }}
          />
        </div>

        {/* Price + Button row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: compact ? 6 : 8,
          }}
        >
          <div
            style={{
              height: compact ? 12 : 14,
              width: "30%",
              ...shimmerStyle,
            }}
          />
          <div
            style={{
              height: compact ? 28 : 32,
              width: compact ? 28 : 32,
              borderRadius: 4,
              ...shimmerStyle,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a grid of skeletons matching GameCard layout.
 * @param {number} count - Number of skeleton cards (default 12)
 * @param {boolean} compact - Compact mode for Library grid (180px cards)
 */
export function GameCardSkeletonGrid({ count = 12, compact = false }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(${compact ? "180px" : "240px"}, 1fr))`,
        gap: compact ? 16 : 20,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <GameCardSkeleton key={i} compact={compact} />
      ))}
    </div>
  );
}
