// GameStore.WebClient/src/components/games/GameDetailSkeleton.jsx

export default function GameDetailSkeleton() {
  return (
    <div style={{ background: "#121212", minHeight: "100vh" }}>
      <div style={{ height: "70vh", background: "#1e1e1e", display: "flex", alignItems: "flex-end", padding: "60px 40px" }}>
        <div>
          <div style={{ width: 300, height: 48, background: "#333", borderRadius: 4, marginBottom: 16 }} />
          <div style={{ width: 500, height: 20, background: "#333", borderRadius: 4, marginBottom: 24 }} />
          <div style={{ width: 200, height: 48, background: "#333", borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}
