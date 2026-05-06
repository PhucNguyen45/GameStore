// GameStore.WebClient/src/components/admin/DashboardTab.jsx
import { useMemo } from "react";
import { Gamepad2, Users, ShoppingBag, DollarSign, TrendingUp } from "lucide-react";

export default function DashboardTab({ stats, monthlyRevenue, allOrders, loadDashboard, setActiveTab }) {
  const recentOrders = useMemo(() => {
    return [...allOrders]
      .sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0))
      .slice(0, 8);
  }, [allOrders]);

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  const displayMax = maxRevenue > 0 ? maxRevenue : 100;
  const currentMonthIdx = new Date().getMonth();

  const statCards = [
    { icon: Gamepad2, label: "Total Games", value: stats.totalGames.toLocaleString(), color: "var(--accent)" },
    { icon: Users, label: "Users", value: stats.totalUsers.toLocaleString(), color: "#00c853" },
    { icon: ShoppingBag, label: "Orders", value: stats.totalOrders.toLocaleString(), color: "#ffc107" },
    { icon: DollarSign, label: "Revenue", value: `$${Number(stats.revenue).toLocaleString()}`, color: "#e94560" },
  ];

  return (
    <>
      <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Dashboard</h1>
        <button onClick={loadDashboard} style={{
          padding: "6px 14px", background: "#1a1a2e", color: "#fff",
          border: "1px solid #2a2a3e", borderRadius: 6, cursor: "pointer",
          fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <TrendingUp size={12} /> Refresh
        </button>
      </div>

      {/* STATS CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 24 }}>
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ background: "#111118", borderRadius: 10, padding: 18, border: "1px solid #1a1a2e" }}>
            <Icon size={18} color={color} style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{value}</p>
            <p style={{ fontSize: 11, color: "#666", marginTop: 2, textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* REVENUE CHART */}
        <div style={{ background: "#111118", borderRadius: 10, padding: 20, border: "1px solid #1a1a2e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
                Revenue ({new Date().getFullYear()})
              </h3>
              <p style={{ fontSize: 10, color: "#666" }}>
                Total: <span style={{ color: "#4caf50", fontWeight: 600 }}>${Number(stats.revenue).toLocaleString()}</span>
              </p>
            </div>
            <div style={{ fontSize: 10, color: "#666" }}>
              Peak: <span style={{ color: "#fff", fontWeight: 600 }}>${maxRevenue.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 160 }}>
            {monthlyRevenue.map((item, i) => {
              const heightPercent = Math.max((item.value / displayMax) * 100, 6);
              const isCurrent = i === currentMonthIdx;
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, position: "relative" }}>
                  <div style={{
                    position: "absolute", top: -34, left: "50%", transform: "translateX(-50%)",
                    background: "#1a1a2e", color: "#fff", padding: "4px 8px", borderRadius: 4,
                    fontSize: 10, fontWeight: 600, opacity: 0, pointerEvents: "none",
                    transition: "opacity 0.2s", whiteSpace: "nowrap", zIndex: 10,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                  }} className="bar-tooltip">
                    ${item.value.toLocaleString()} • {item.count} order{item.count !== 1 ? "s" : ""}
                  </div>
                  <div
                    style={{
                      width: "100%", height: `${Math.max(heightPercent, 2)}%`, minHeight: 4,
                      background: isCurrent ? "linear-gradient(180deg, #4fc3f7 0%, var(--accent) 100%)" : "var(--accent)",
                      borderRadius: "4px 4px 0 0", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
                      cursor: "pointer", position: "relative", overflow: "hidden",
                      opacity: item.value === 0 ? 0.35 : 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "linear-gradient(180deg, #4fc3f7 0%, var(--accent) 100%)";
                      e.currentTarget.style.transform = "scaleY(1.05)";
                      e.currentTarget.style.transformOrigin = "bottom";
                      const shine = e.currentTarget.querySelector(".shine");
                      const tip = e.currentTarget.parentElement.querySelector(".bar-tooltip");
                      if (shine) shine.style.opacity = 1;
                      if (tip) tip.style.opacity = 1;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isCurrent
                        ? "linear-gradient(180deg, #4fc3f7 0%, var(--accent) 100%)" : "var(--accent)";
                      e.currentTarget.style.transform = "scaleY(1)";
                      const shine = e.currentTarget.querySelector(".shine");
                      const tip = e.currentTarget.parentElement.querySelector(".bar-tooltip");
                      if (shine) shine.style.opacity = 0;
                      if (tip) tip.style.opacity = 0;
                    }}
                  >
                    <div className="shine" style={{
                      position: "absolute", top: 0, left: 0, right: 0, height: "40%",
                      background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)",
                      borderRadius: "4px 4px 0 0", opacity: 0, transition: "opacity 0.3s",
                    }} />
                  </div>
                  <span style={{ fontSize: 9, color: isCurrent ? "#fff" : "#555", fontWeight: isCurrent ? 700 : 400 }}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div style={{ background: "#111118", borderRadius: 10, padding: 20, border: "1px solid #1a1a2e" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>Recent Orders</h3>
            <button onClick={() => setActiveTab("orders")} style={{
              background: "transparent", border: "none", color: "var(--accent)",
              fontSize: 11, cursor: "pointer", fontWeight: 600,
            }}>
              View all →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto" }}>
            {recentOrders.map((o) => (
              <div key={o.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 10px", borderRadius: 6, background: "#0a0a10", fontSize: 12,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: o.status === "Completed" ? "#4caf50"
                      : o.status === "Cancelled" ? "#e94560"
                      : o.status === "Refunded" ? "#ff9800" : "#ffc107",
                  }} />
                  <span style={{ color: "#fff", fontWeight: 500 }}>#{o.id}</span>
                  <span style={{ color: "#666" }}>User #{o.userId}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "#888", fontSize: 10 }}>
                    {o.orderDate ? new Date(o.orderDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "-"}
                  </span>
                  <span style={{ color: "#4caf50", fontWeight: 600 }}>${o.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p style={{ color: "#666", textAlign: "center", padding: 12, fontSize: 12 }}>No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
