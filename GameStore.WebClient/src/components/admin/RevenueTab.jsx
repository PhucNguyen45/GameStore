// GameStore.WebClient/src/components/admin/RevenueTab.jsx
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Download, TrendingUp, ShoppingBag, DollarSign, BarChart2 } from "lucide-react";
import * as XLSX from "xlsx";
import { adminAPI } from "../../services/api";
import { formatVND } from "../../utils/format";

// Xuất dữ liệu doanh thu ra file Excel (.xlsx) và tự động tải về
function exportExcel(rows, groupBy, year, totalRevenue, totalOrders, avgOrder) {
  const colLabel = groupBy === "year" ? "Năm" : "Tháng";

  // Dữ liệu từng dòng
  const sheetData = [
    [colLabel, "Doanh thu (VNĐ)", "Số đơn hoàn thành", "Trung bình / đơn (VNĐ)", "Tỷ lệ (%)"],
    ...rows.map((r) => [
      r.label,
      r.revenue,
      r.orders,
      r.avgOrder,
      totalRevenue > 0 ? +((r.revenue / totalRevenue) * 100).toFixed(2) : 0,
    ]),
    // Dòng tổng cộng
    ["Tổng", totalRevenue, totalOrders, avgOrder, 100],
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);

  // Độ rộng cột
  ws["!cols"] = [{ wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 12 }];

  const wb = XLSX.utils.book_new();
  const sheetName = groupBy === "year" ? "Theo năm" : `Năm ${year}`;
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  const filename = groupBy === "year"
    ? "doanh-thu-theo-nam.xlsx"
    : `doanh-thu-${year}.xlsx`;

  XLSX.writeFile(wb, filename);
}

// Chart cột SVG — hiển thị doanh thu mỗi kỳ bằng thanh bar
function BarChart({ rows, groupBy }) {
  const [hovered, setHovered] = useState(null);
  const CHART_H = 180;
  const maxVal = Math.max(...rows.map((r) => r.revenue), 1);

  const formatLabel = (v) =>
    v >= 1_000_000_000
      ? `${(v / 1_000_000_000).toFixed(1)}tỷ`
      : v >= 1_000_000
        ? `${(v / 1_000_000).toFixed(1)}tr`
        : v >= 1_000
          ? `${(v / 1_000).toFixed(0)}k`
          : `${v}`;

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: groupBy === "year" ? 20 : 6, height: CHART_H + 28, padding: "0 8px" }}>
        {rows.map((r, i) => {
          const barH = maxVal > 0 ? Math.max(4, (r.revenue / maxVal) * CHART_H) : 4;
          const isHovered = hovered === i;
          return (
            <div
              key={r.label}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: groupBy === "year" ? 50 : 22, cursor: "pointer" }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {isHovered && (
                <div style={{
                  position: "absolute", background: "#1a1a2e", border: "1px solid var(--accent)",
                  borderRadius: 6, padding: "6px 10px", fontSize: 11, color: "#fff",
                  pointerEvents: "none", zIndex: 10, whiteSpace: "nowrap",
                  bottom: 34, left: "50%", transform: "translateX(-50%)",
                }}>
                  <div style={{ color: "var(--accent)", fontWeight: 700 }}>{r.label}</div>
                  <div>Doanh thu: <strong>{formatVND(r.revenue)}</strong></div>
                  <div>Đơn hàng: <strong>{r.orders}</strong></div>
                  {r.orders > 0 && <div>TB: <strong>{formatVND(r.avgOrder)}</strong></div>}
                </div>
              )}
              <div style={{ fontSize: 9, color: isHovered ? "var(--accent)" : "#666", marginBottom: 2 }}>
                {r.revenue > 0 ? formatLabel(r.revenue) : ""}
              </div>
              <div
                style={{
                  width: "100%", height: barH,
                  background: isHovered ? "var(--accent)" : r.revenue > 0 ? "#1a3a5c" : "#111",
                  borderRadius: "3px 3px 0 0",
                  transition: "background 0.15s, height 0.2s",
                  border: isHovered ? "1px solid var(--accent)" : "none",
                }}
              />
              <div style={{ fontSize: 9, color: "#666", marginTop: 4, textAlign: "center" }}>{r.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RevenueTab() {
  const currentYear = new Date().getFullYear();
  const [groupBy, setGroupBy] = useState("month"); // "month" | "year"
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gọi API lấy doanh thu theo chế độ đang chọn (tháng hoặc năm)
  const load = async () => {
    setLoading(true);
    try {
      const params = { groupBy };
      if (groupBy === "month") params.year = year;
      const res = await adminAPI.getRevenue(params);
      setData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Không tải được dữ liệu doanh thu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [groupBy, year]);

  // Danh sách năm hiển thị trong dropdown (năm hiện tại ± 3 năm)
  const yearOptions = Array.from({ length: 6 }, (_, i) => currentYear - 3 + i);

  const rows = data?.rows || [];
  const totalRevenue = data?.totalRevenue || 0;
  const totalOrders = data?.totalOrders || 0;
  const avgOrder = data?.avgOrder || 0;
  // Năm có dữ liệu từ API (chỉ khi chế độ tháng)
  const availableYears = data?.availableYears || yearOptions;

  const statCards = [
    { icon: DollarSign, label: groupBy === "year" ? "Tổng doanh thu" : `Doanh thu ${year}`, value: formatVND(totalRevenue), color: "var(--accent)" },
    { icon: ShoppingBag, label: "Tổng đơn hoàn thành", value: totalOrders.toLocaleString("vi-VN"), color: "#4caf50" },
    { icon: TrendingUp, label: "Trung bình / đơn", value: formatVND(avgOrder), color: "#ffc107" },
  ];

  const btnStyle = (active) => ({
    padding: "7px 16px", border: "1px solid #1a1a2e", borderRadius: 6,
    cursor: "pointer", fontSize: 12, fontWeight: 600,
    background: active ? "var(--accent)" : "#111118", color: "#fff",
  });

  const selectStyle = {
    padding: "7px 12px", background: "#111118", border: "1px solid #2a2a35",
    borderRadius: 6, color: "#fff", fontSize: 12, cursor: "pointer", outline: "none",
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 4 }}>
          <button style={btnStyle(groupBy === "month")} onClick={() => setGroupBy("month")}>
            Theo tháng
          </button>
          <button style={btnStyle(groupBy === "year")} onClick={() => setGroupBy("year")}>
            Theo năm
          </button>
        </div>

        {/* Chọn năm — chỉ hiển thị khi đang xem theo tháng */}
        {groupBy === "month" && (
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={selectStyle}>
            {(availableYears.length ? availableYears : yearOptions).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}

        <button
          onClick={() => exportExcel(rows, groupBy, year, totalRevenue, totalOrders, avgOrder)}
          disabled={rows.length === 0 || totalRevenue === 0}
          style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            padding: "7px 16px", background: "#1a3a1a", border: "1px solid #4caf50",
            borderRadius: 6, color: "#4caf50", fontSize: 12, fontWeight: 600,
            cursor: (rows.length === 0 || totalRevenue === 0) ? "not-allowed" : "pointer",
            opacity: (rows.length === 0 || totalRevenue === 0) ? 0.4 : 1,
          }}
        >
          <Download size={13} /> Xuất Excel
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}>
        {statCards.map((c) => (
          <div key={c.label} style={{
            background: "#111118", borderRadius: 10, padding: "16px 20px",
            border: "1px solid #1a1a2e", display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 8,
              background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <c.icon size={18} color={c.color} />
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{loading ? "..." : c.value}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div style={{ background: "#111118", borderRadius: 10, padding: "20px 16px", border: "1px solid #1a1a2e", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <BarChart2 size={14} color="var(--accent)" />
          <span style={{ color: "#fff", fontWeight: 600, fontSize: 13 }}>
            {groupBy === "year" ? "Doanh thu theo từng năm" : `Doanh thu từng tháng — ${year}`}
          </span>
        </div>
        {loading ? (
          <div style={{ height: 208, display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
            Đang tải...
          </div>
        ) : rows.every((r) => r.revenue === 0) ? (
          <div style={{ height: 208, display: "flex", alignItems: "center", justifyContent: "center", color: "#555" }}>
            Không có dữ liệu doanh thu cho kỳ này
          </div>
        ) : (
          <BarChart rows={rows} groupBy={groupBy} />
        )}
      </div>

      {/* Detail table */}
      <div style={{ background: "#111118", borderRadius: 10, border: "1px solid #1a1a2e", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a0a10" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "#666", fontWeight: 600, fontSize: 11 }}>
                {groupBy === "year" ? "Năm" : "Tháng"}
              </th>
              <th style={{ padding: "10px 16px", textAlign: "right", color: "#666", fontWeight: 600, fontSize: 11 }}>Doanh thu</th>
              <th style={{ padding: "10px 16px", textAlign: "right", color: "#666", fontWeight: 600, fontSize: 11 }}>Số đơn</th>
              <th style={{ padding: "10px 16px", textAlign: "right", color: "#666", fontWeight: 600, fontSize: 11 }}>TB / đơn</th>
              <th style={{ padding: "10px 16px", textAlign: "right", color: "#666", fontWeight: 600, fontSize: 11 }}>Tỷ lệ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "9px 16px", color: "#ccc", fontWeight: 600 }}>{r.label}</td>
                <td style={{ padding: "9px 16px", textAlign: "right", color: r.revenue > 0 ? "var(--accent)" : "#444", fontWeight: r.revenue > 0 ? 700 : 400 }}>
                  {r.revenue > 0 ? formatVND(r.revenue) : "—"}
                </td>
                <td style={{ padding: "9px 16px", textAlign: "right", color: r.orders > 0 ? "#4caf50" : "#444" }}>
                  {r.orders > 0 ? r.orders.toLocaleString("vi-VN") : "—"}
                </td>
                <td style={{ padding: "9px 16px", textAlign: "right", color: "#888" }}>
                  {r.avgOrder > 0 ? formatVND(r.avgOrder) : "—"}
                </td>
                <td style={{ padding: "9px 16px", textAlign: "right" }}>
                  {totalRevenue > 0 && r.revenue > 0 ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                      <div style={{ width: 60, height: 4, background: "#1a1a2e", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ width: `${(r.revenue / totalRevenue) * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 2 }} />
                      </div>
                      <span style={{ color: "#888", fontSize: 10, minWidth: 32, textAlign: "right" }}>
                        {((r.revenue / totalRevenue) * 100).toFixed(1)}%
                      </span>
                    </div>
                  ) : (
                    <span style={{ color: "#444" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
            {/* Dòng tổng cộng */}
            {rows.length > 0 && (
              <tr style={{ background: "#0a0a10", borderTop: "1px solid #2a2a2a" }}>
                <td style={{ padding: "10px 16px", color: "#fff", fontWeight: 700 }}>Tổng</td>
                <td style={{ padding: "10px 16px", textAlign: "right", color: "var(--accent)", fontWeight: 800 }}>
                  {formatVND(totalRevenue)}
                </td>
                <td style={{ padding: "10px 16px", textAlign: "right", color: "#4caf50", fontWeight: 700 }}>
                  {totalOrders.toLocaleString("vi-VN")}
                </td>
                <td style={{ padding: "10px 16px", textAlign: "right", color: "#888", fontWeight: 600 }}>
                  {formatVND(avgOrder)}
                </td>
                <td style={{ padding: "10px 16px", textAlign: "right", color: "#888" }}>100%</td>
              </tr>
            )}
            {rows.length === 0 && (
              <tr>
                <td colSpan="5" style={{ padding: 24, textAlign: "center", color: "#555" }}>
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
