import { useState } from "react";
import { X } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";
import { thStyle, sortFn, filterInputStyle } from "./adminStyles";
import api from "../../services/api";

export default function OrdersTab({
  orders, ordersTotal, ordersPage, setOrdersPage,
  ordersPageSize, setOrdersPageSize, ordersTotalPages,
  orderSearch, setOrderSearch, orderSort, setOrderSort,
  loadOrders, loadDashboard, activeTab,
}) {

  const hasFilters = orderSearch.keyword || orderSearch.fromDate
    || orderSearch.toDate || orderSearch.status;

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Search Username or Order ID"
          value={orderSearch.keyword}
          onChange={(e) => setOrderSearch({ ...orderSearch, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontSize: 12 }}>
          From: <input type="date" value={orderSearch.fromDate}
            onChange={(e) => setOrderSearch({ ...orderSearch, fromDate: e.target.value })}
            style={filterInputStyle} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontSize: 12 }}>
          To: <input type="date" value={orderSearch.toDate}
            onChange={(e) => setOrderSearch({ ...orderSearch, toDate: e.target.value })}
            style={filterInputStyle} />
        </div>
        <select
          value={orderSearch.status}
          onChange={(e) => setOrderSearch({ ...orderSearch, status: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Refunded">Refunded</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => setOrderSearch({ keyword: "", fromDate: "", toDate: "", status: "" })}
            style={{
              padding: "7px 12px", background: "#2a2a2a", color: "#fff",
              border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>
      <div style={{ background: "#111118", borderRadius: 8, border: "1px solid #1a1a2e", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a0a10" }}>
              <SortableHeader field="id" sort={orderSort} setSort={setOrderSort}>#</SortableHeader>
              <SortableHeader field="userId" sort={orderSort} setSort={setOrderSort}>User</SortableHeader>
              <SortableHeader field="totalAmount" sort={orderSort} setSort={setOrderSort}>Total</SortableHeader>
              <SortableHeader field="status" sort={orderSort} setSort={setOrderSort}>Status</SortableHeader>
              <SortableHeader field="paymentMethod" sort={orderSort} setSort={setOrderSort}>Method</SortableHeader>
              <SortableHeader field="orderDate" sort={orderSort} setSort={setOrderSort}>Date</SortableHeader>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "9px 14px", color: "#555" }}>#{o.id}</td>
                <td style={{ padding: "9px 14px", color: "#fff" }}>
                  {o.username ? `${o.username} (#${o.userId})` : `User #${o.userId}`}
                </td>
                <td style={{ padding: "9px 14px", color: "#4caf50", fontWeight: 600 }}>
                  ${o.totalAmount?.toFixed(2)}
                </td>
                <td style={{ padding: "9px 14px" }}>
                  <select
                    value={o.status}
                    onChange={async (e) => {
                      try {
                        await api.put(`/admin/orders/${o.id}/status`, { status: e.target.value });
                        await loadOrders();
                        if (activeTab === "dashboard") loadDashboard();
                      } catch {
                        alert("Failed to update status");
                      }
                    }}
                    style={{
                      padding: "4px 8px", borderRadius: 6, fontSize: 11, background: "#0a0a10",
                      color: o.status === "Completed" ? "#4caf50"
                        : o.status === "Cancelled" ? "#e94560"
                        : o.status === "Refunded" ? "#ff9800" : "#2196f3",
                      border: "1px solid #1a1a2e", cursor: "pointer", outline: "none", fontWeight: 600,
                    }}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{o.paymentMethod || "Wallet"}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>
                  {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "-"}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{ padding: 20, textAlign: "center", color: "#666" }}>No orders found</td></tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={ordersPage} totalPages={ordersTotalPages}
          totalItems={ordersTotal} pageSize={ordersPageSize}
          setPage={setOrdersPage} setPageSize={setOrdersPageSize}
        />
      </div>
    </div>
  );
}
