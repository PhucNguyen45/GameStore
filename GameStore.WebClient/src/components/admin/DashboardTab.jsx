// GameStore.WebClient/src/components/admin/DashboardTab.jsx
import { useMemo, useState } from "react";
import { formatVND } from "../../utils/format";
import {
  Gamepad2,
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  BadgeCheck,
  Ticket,
  Percent,
} from "lucide-react";

export default function DashboardTab({
  stats,
  monthlyRevenue,
  allOrders,
  loadDashboard,
  setActiveTab,
}) {
  const recentOrders = useMemo(() => {
    return [...allOrders]
      .sort((a, b) => new Date(b.orderDate || 0) - new Date(a.orderDate || 0))
      .slice(0, 8);
  }, [allOrders]);

  const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.value), 1);
  const displayMax = maxRevenue > 0 ? maxRevenue : 100;
  const currentMonthIdx = new Date().getMonth();
  const [hoveredBar, setHoveredBar] = useState(null);

  const CHART_H = 180;
  const Y_TICKS = 4;
  const formatYLabel = (v) =>
    v >= 10000
      ? `${(v / 1000).toFixed(0)}k₫`
      : v >= 1000
        ? `${(v / 1000).toFixed(1)}k₫`
        : `${Math.round(v).toLocaleString("vi-VN")}₫`;

  const statCards = [
    {
      icon: Gamepad2,
      label: "Tổng game",
      value: stats.totalGames.toLocaleString(),
      color: "var(--accent)",
    },
    {
      icon: Users,
      label: "Người dùng",
      value: stats.totalUsers.toLocaleString(),
      color: "#00c853",
    },
    {
      icon: ShoppingBag,
      label: "Đơn hàng",
      value: stats.totalOrders.toLocaleString(),
      color: "#ffc107",
    },
    {
      icon: DollarSign,
      label: "Doanh thu",
      value: formatVND(stats.revenue),
      color: "#e94560",
    },
    // {
    //   icon: BadgeCheck,
    //   label: "Đơn hoàn thành",
    //   value: `${stats.completedOrdersCount || 0}`,
    //   color: "#4ade80",
    // },
    // {
    //   icon: Ticket,
    //   label: "Key còn lại",
    //   value: `${stats.availableKeysCount || 0}`,
    //   color: "#38bdf8",
    // },
    // {
    //   icon: Percent,
    //   label: "Tỷ lệ hoàn thành",
    //   value: `${stats.completedRate || 0}%`,
    //   color: "#f97316",
    // },
  ];

  return (
    <>
      <div
        style={{
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
          Tổng quan
        </h1>
        <button
          onClick={loadDashboard}
          style={{
            padding: "6px 14px",
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid #2a2a3e",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <TrendingUp size={12} /> Làm mới
        </button>
      </div>

      {/* STATS CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div
            key={label}
            style={{
              background: "#111118",
              borderRadius: 10,
              padding: 18,
              border: "1px solid #1a1a2e",
            }}
          >
            <Icon size={18} color={color} style={{ marginBottom: 10 }} />
            <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
              {value}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "#666",
                marginTop: 2,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* <div
        style={{
          background: "#111118",
          borderRadius: 10,
          padding: 18,
          border: "1px solid #1a1a2e",
          marginBottom: 24,
        }}
      >
        <p style={{ fontSize: 12, color: "#666", marginBottom: 6 }}>
          Giá trung bình kho game
        </p>
        <p style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
          {formatVND(stats.averageGamePrice)}
        </p>
      </div> */}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* REVENUE CHART */}
        <div
          style={{
            background: "#111118",
            borderRadius: 10,
            padding: 20,
            border: "1px solid #1a1a2e",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 16,
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#fff",
                  marginBottom: 4,
                }}
              >
                Doanh thu ({new Date().getFullYear()})
              </h3>
              <p style={{ fontSize: 10, color: "#666" }}>
                Tổng năm:
                <span style={{ color: "#4caf50", fontWeight: 700 }}>
                  {formatVND(stats.revenue)}
                </span>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 9, color: "#555", marginBottom: 2 }}>
                Tháng cao nhất
              </p>
              <p style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>
                {formatYLabel(maxRevenue)}
              </p>
            </div>
          </div>

          {/* Chart body: Y-axis + bars */}
          <div style={{ display: "flex", gap: 0 }}>
            {/* Y-axis labels */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: 44,
                paddingRight: 6,
                height: CHART_H + 18,
                paddingBottom: 18,
                boxSizing: "border-box",
                flexShrink: 0,
              }}
            >
              {Array.from({ length: Y_TICKS + 1 }, (_, i) => Y_TICKS - i).map(
                (level) => (
                  <span
                    key={level}
                    style={{
                      fontSize: 9,
                      color: "#555",
                      textAlign: "right",
                      lineHeight: "14px",
                    }}
                  >
                    {formatYLabel(Math.round((displayMax * level) / Y_TICKS))}
                  </span>
                ),
              )}
            </div>

            {/* Chart area */}
            <div
              style={{ flex: 1, position: "relative", height: CHART_H + 18 }}
            >
              {/* Gridlines */}
              {Array.from({ length: Y_TICKS + 1 }, (_, i) => i).map((level) => (
                <div
                  key={level}
                  style={{
                    position: "absolute",
                    top: `${(level / Y_TICKS) * CHART_H}px`,
                    left: 0,
                    right: 0,
                    borderTop: `1px ${level === Y_TICKS ? "solid" : "dashed"} ${level === Y_TICKS ? "#2a2a3e" : "#18181f"}`,
                    pointerEvents: "none",
                    zIndex: 0,
                  }}
                />
              ))}

              {/* Bars */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  height: CHART_H,
                  alignItems: "flex-end",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {monthlyRevenue.map((item, i) => {
                  const heightPct =
                    displayMax > 0 ? (item.value / displayMax) * 100 : 0;
                  const isCurrent = i === currentMonthIdx;
                  const isHovered = hoveredBar === i;
                  const hasValue = item.value > 0;
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        height: "100%",
                        justifyContent: "flex-end",
                        position: "relative",
                      }}
                    >
                      {/* Tooltip */}
                      {isHovered && hasValue && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "calc(100% + 6px)",
                            left: "50%",
                            transform: "translateX(-50%)",
                            background: "#1e1e2e",
                            border: "1px solid #2a2a3e",
                            color: "#fff",
                            padding: "6px 10px",
                            borderRadius: 6,
                            fontSize: 10,
                            whiteSpace: "nowrap",
                            zIndex: 20,
                            boxShadow: "0 4px 16px rgba(0,0,0,0.6)",
                            lineHeight: 1.6,
                            textAlign: "center",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              color: "#4caf50",
                              fontSize: 11,
                            }}
                          >
                            {formatVND(item.value)}
                          </div>
                          <div style={{ color: "#888" }}>{item.count} đơn</div>
                        </div>
                      )}

                      {/* Bar */}
                      <div
                        onMouseEnter={() => setHoveredBar(i)}
                        onMouseLeave={() => setHoveredBar(null)}
                        style={{
                          width: "100%",
                          height: hasValue ? `${heightPct}%` : "2px",
                          minHeight: hasValue ? 4 : 0,
                          background:
                            isHovered || isCurrent
                              ? "linear-gradient(180deg, #4fc3f7 0%, var(--accent) 100%)"
                              : hasValue
                                ? "var(--accent)"
                                : "#1a1a2e",
                          borderRadius: hasValue ? "3px 3px 0 0" : "1px",
                          opacity: hasValue ? 1 : 0.4,
                          transition:
                            "height 0.4s cubic-bezier(0.4,0,0.2,1), background 0.2s",
                          cursor: hasValue ? "pointer" : "default",
                        }}
                      />
                    </div>
                  );
                })}
              </div>

              {/* Month labels */}
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  height: 18,
                  alignItems: "center",
                }}
              >
                {monthlyRevenue.map((item, i) => {
                  const isCurrent = i === currentMonthIdx;
                  return (
                    <div key={i} style={{ flex: 1, textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: 9,
                          color: isCurrent ? "#fff" : "#555",
                          fontWeight: isCurrent ? 700 : 400,
                        }}
                      >
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div
          style={{
            background: "#111118",
            borderRadius: 10,
            padding: 20,
            border: "1px solid #1a1a2e",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h3 style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
              Đơn hàng gần đây
            </h3>
            <button
              onClick={() => setActiveTab("orders")}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--accent)",
                fontSize: 11,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Xem tất cả →
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              maxHeight: 240,
              overflowY: "auto",
            }}
          >
            {recentOrders.map((o) => (
              <div
                key={o.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 10px",
                  borderRadius: 6,
                  background: "#0a0a10",
                  fontSize: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div
                    className={`status-dot ${
                      o.status === "Completed"
                        ? "active"
                        : o.status === "Cancelled"
                          ? "locked"
                          : o.status === "Refunded"
                            ? "pending"
                            : "pending"
                    }`}
                    style={{ gap: 0 }}
                  />
                  <span style={{ color: "#fff", fontWeight: 500 }}>
                    #{o.id}
                  </span>
                  <span style={{ color: "#666" }}>NSD #{o.userId}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ color: "#888", fontSize: 10 }}>
                    {o.orderDate
                      ? new Date(o.orderDate).toLocaleDateString("vi-VN", {
                          month: "short",
                          day: "numeric",
                        })
                      : "-"}
                  </span>
                  <span style={{ color: "#4caf50", fontWeight: 600 }}>
                    {formatVND(o.totalAmount || 0)}
                  </span>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <p
                style={{
                  color: "#666",
                  textAlign: "center",
                  padding: 12,
                  fontSize: 12,
                }}
              >
                Chưa có đơn hàng
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
