// GameStore.WebClient/src/components/common/PageSkeleton.jsx
import { useEffect } from "react";

let injected = false;
function injectShimmer() {
  if (injected) return;
  injected = true;
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

const shimmer = {
  background: "linear-gradient(90deg, #2a2a2a 25%, #333 50%, #2a2a2a 75%)",
  backgroundSize: "200% 100%",
  animation: "shimmer 1.5s ease-in-out infinite",
  borderRadius: 6,
};

// ===== ORDER HISTORY SKELETON =====
export function OrderHistorySkeleton() {
  useEffect(() => { injectShimmer(); }, []);

  return (
    <div className="container" style={{ paddingTop: 30, maxWidth: 1000 }}>
      <div style={{ width: 200, height: 28, marginBottom: 24, ...shimmer }} />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} style={{ background: "#16162a", borderRadius: 12, border: "1px solid #2a2a4a", overflow: "hidden", marginBottom: 16 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #2a2a4a", display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 120, height: 16, ...shimmer }} />
              <div style={{ width: 160, height: 14, ...shimmer }} />
            </div>
            <div style={{ width: 100, height: 16, ...shimmer }} />
          </div>
          <div style={{ padding: "12px 20px" }}>
            {Array.from({ length: 2 }, (_, j) => (
              <div key={j} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: j < 1 ? "1px solid #1e1e2e" : "none" }}>
                <div style={{ width: "40%", height: 14, ...shimmer }} />
                <div style={{ width: "10%", height: 14, ...shimmer }} />
                <div style={{ width: "15%", height: 14, ...shimmer }} />
                <div style={{ width: "15%", height: 14, ...shimmer }} />
              </div>
            ))}
          </div>
          <div style={{ padding: "12px 20px", borderTop: "1px solid #2a2a4a", background: "#0d0d14", display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: 100, height: 14, ...shimmer }} />
            <div style={{ width: 80, height: 20, ...shimmer }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ===== INVOICE SKELETON =====
export function InvoiceSkeleton() {
  useEffect(() => { injectShimmer(); }, []);

  return (
    <div className="container" style={{ paddingTop: 40, maxWidth: 800 }}>
      <div style={{ width: 120, height: 16, marginBottom: 30, ...shimmer }} />
      {/* Stepper */}
      <div style={{ background: "#16162a", padding: "30px 40px", borderRadius: 20, border: "1px solid #2a2a4a", marginBottom: 30, display: "flex", justifyContent: "space-between" }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
            <div style={{ width: 50, height: 50, borderRadius: "50%", ...shimmer }} />
            <div style={{ width: 80, height: 12, ...shimmer }} />
          </div>
        ))}
      </div>
      {/* Invoice card */}
      <div style={{ background: "#16162a", borderRadius: 20, border: "1px solid #2a2a4a", overflow: "hidden" }}>
        <div style={{ padding: "30px 40px", borderBottom: "1px solid #2a2a4a" }}>
          <div style={{ width: 180, height: 24, marginBottom: 8, ...shimmer }} />
          <div style={{ width: 250, height: 16, ...shimmer }} />
        </div>
        <div style={{ padding: 40 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, marginBottom: 40 }}>
            <div>
              <div style={{ width: 100, height: 12, marginBottom: 12, ...shimmer }} />
              <div style={{ width: "80%", height: 16, marginBottom: 8, ...shimmer }} />
              <div style={{ width: "60%", height: 16, ...shimmer }} />
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ width: 100, height: 12, marginBottom: 12, marginLeft: "auto", ...shimmer }} />
              <div style={{ width: "60%", height: 16, marginBottom: 8, marginLeft: "auto", ...shimmer }} />
              <div style={{ width: "40%", height: 16, marginLeft: "auto", ...shimmer }} />
            </div>
          </div>
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "15px 0", borderBottom: "1px solid #2a2a4a" }}>
              <div style={{ width: "50%", height: 16, ...shimmer }} />
              <div style={{ width: "10%", height: 16, ...shimmer }} />
              <div style={{ width: "15%", height: 16, ...shimmer }} />
              <div style={{ width: "15%", height: 16, ...shimmer }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== ADMIN SKELETON =====
export function AdminSkeleton() {
  useEffect(() => { injectShimmer(); }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-primary)" }}>
      {/* Sidebar skeleton */}
      <div style={{ width: 240, padding: 24, borderRight: "1px solid #2a2a2a" }}>
        <div style={{ width: 100, height: 20, marginBottom: 32, ...shimmer }} />
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 4 }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, ...shimmer }} />
            <div style={{ flex: 1, height: 14, ...shimmer }} />
          </div>
        ))}
      </div>
      {/* Content skeleton */}
      <div style={{ flex: 1, padding: "24px 32px" }}>
        <div style={{ width: 160, height: 20, marginBottom: 24, ...shimmer }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} style={{ background: "#111118", borderRadius: 8, border: "1px solid #1a1a2e", padding: 20 }}>
              <div style={{ width: 60, height: 14, marginBottom: 8, ...shimmer }} />
              <div style={{ width: 80, height: 28, ...shimmer }} />
            </div>
          ))}
        </div>
        <div style={{ background: "#111118", borderRadius: 8, border: "1px solid #1a1a2e", padding: 20 }}>
          <div style={{ width: "100%", height: 200, ...shimmer, borderRadius: 6 }} />
        </div>
      </div>
    </div>
  );
}

// ===== PROFILE SKELETON =====
export function ProfileSkeleton() {
  useEffect(() => { injectShimmer(); }, []);

  return (
    <div className="container" style={{ paddingTop: 30, paddingBottom: 60, maxWidth: 720 }}>
      <div style={{ width: 200, height: 28, marginBottom: 6, ...shimmer }} />
      <div style={{ width: 300, height: 16, marginBottom: 32, ...shimmer }} />
      <div style={{ background: "#16162a", borderRadius: 16, border: "1px solid #2a2a4a", padding: 32, marginBottom: 24 }}>
        <div style={{ width: 160, height: 18, marginBottom: 24, ...shimmer }} />
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #2a2a4a" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", ...shimmer }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: "40%", height: 16, marginBottom: 8, ...shimmer }} />
            <div style={{ width: "60%", height: 14, ...shimmer }} />
          </div>
        </div>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ width: 100, height: 12, marginBottom: 6, ...shimmer }} />
            <div style={{ width: "100%", height: 44, borderRadius: 10, ...shimmer }} />
          </div>
        ))}
      </div>
      <div style={{ background: "#16162a", borderRadius: 16, border: "1px solid #2a2a4a", padding: 32, marginBottom: 24 }}>
        <div style={{ width: 140, height: 18, marginBottom: 24, ...shimmer }} />
        <div style={{ width: "60%", height: 14, marginBottom: 20, ...shimmer }} />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} style={{ marginBottom: 18 }}>
            <div style={{ width: 120, height: 12, marginBottom: 6, ...shimmer }} />
            <div style={{ width: "100%", height: 44, borderRadius: 10, ...shimmer }} />
          </div>
        ))}
      </div>
    </div>
  );
}
