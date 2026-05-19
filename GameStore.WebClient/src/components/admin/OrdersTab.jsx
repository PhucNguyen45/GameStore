// GameStore.WebClient/src/components/admin/OrdersTab.jsx
import { useState } from "react";
import { X } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";
import { thStyle, sortFn, filterInputStyle } from "./adminStyles";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { Eye, Check, XCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

function OrderActionModal({ action, order, onClose, onConfirm, loading }) {
  const isApprove = action === "approve";
  const accent = isApprove ? "#4caf50" : "#e94560";
  const accentBg = isApprove ? "#4caf5018" : "#e9456018";
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
    }}>
      <div style={{
        background: "#111118", borderRadius: 12, padding: "28px 32px",
        width: 400, border: "1px solid #1a1a2e", boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: accentBg, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AlertTriangle size={20} color={accent} />
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>
            {isApprove ? "Duyệt đơn hàng?" : "Hủy đơn hàng?"}
          </h3>
        </div>
        <p style={{ margin: "0 0 6px", color: "#aaa", fontSize: 13 }}>
          {isApprove
            ? "Xác nhận duyệt và gửi key game cho khách hàng."
            : "Đơn hàng sẽ bị hủy và hoàn tiền vào ví người dùng (nếu có)."}
        </p>
        <p style={{ margin: "0 0 24px", color: "#666", fontSize: 12 }}>
          Đơn #{order.id} — {order.username || `NSD #${order.userId}`} —{" "}
          <span style={{ color: "#4caf50", fontWeight: 600 }}>${order.totalAmount?.toFixed(2)}</span>
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "9px 20px", background: "transparent",
              border: "1px solid #333", color: "#ccc", borderRadius: 6,
              cursor: "pointer", fontSize: 13,
            }}
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "9px 20px", background: accent,
              border: "none", color: "#fff", borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer", fontSize: 13,
              fontWeight: 600, opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {loading ? "Đang xử lý..." : isApprove ? <><Check size={14} /> Xác nhận duyệt</> : <><XCircle size={14} /> Xác nhận hủy</>}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersTab({
  orders,
  ordersTotal,
  ordersPage,
  setOrdersPage,
  ordersPageSize,
  setOrdersPageSize,
  ordersTotalPages,
  orderSearch,
  setOrderSearch,
  orderSort,
  setOrderSort,
  loadOrders,
  loadDashboard,
  activeTab,
}) {
  const statusVN = { Pending: "Chờ xử lý", Completed: "Hoàn thành", Cancelled: "Đã hủy", Refunded: "Hoàn tiền" };

  const [confirmAction, setConfirmAction] = useState(null); // { action: "approve"|"cancel", order }
  const [actionLoading, setActionLoading] = useState(false);

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    const { action, order } = confirmAction;
    try {
      await api.put(`/admin/orders/${order.id}/status`, {
        status: action === "approve" ? "Completed" : "Cancelled",
      });
      toast.success(action === "approve" ? "Đơn hàng đã duyệt & gửi key!" : "Đã hủy đơn hàng!");
      setConfirmAction(null);
      loadOrders();
    } catch (e) {
      toast.error(e.response?.data?.message || (action === "approve" ? "Duyệt thất bại" : "Hủy đơn thất bại"));
    } finally {
      setActionLoading(false);
    }
  };

  const hasFilters =
    orderSearch.keyword ||
    orderSearch.fromDate ||
    orderSearch.toDate ||
    orderSearch.status;

  return (
    <div>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <input
          placeholder="Tìm tên người dùng hoặc mã đơn..."
          value={orderSearch.keyword}
          onChange={(e) =>
            setOrderSearch({ ...orderSearch, keyword: e.target.value })
          }
          style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#888",
            fontSize: 12,
          }}
        >
          Từ ngày:{" "}
          <input
            type="date"
            value={orderSearch.fromDate}
            onChange={(e) =>
              setOrderSearch({ ...orderSearch, fromDate: e.target.value })
            }
            style={filterInputStyle}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#888",
            fontSize: 12,
          }}
        >
          Đến ngày:{" "}
          <input
            type="date"
            value={orderSearch.toDate}
            onChange={(e) =>
              setOrderSearch({ ...orderSearch, toDate: e.target.value })
            }
            style={filterInputStyle}
          />
        </div>
        <select
          value={orderSearch.status}
          onChange={(e) =>
            setOrderSearch({ ...orderSearch, status: e.target.value })
          }
          style={filterInputStyle}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Chờ xử lý</option>
          <option value="Completed">Hoàn thành</option>
          <option value="Cancelled">Đã hủy</option>
          <option value="Refunded">Hoàn tiền</option>
        </select>
        {hasFilters && (
          <button
            onClick={() =>
              setOrderSearch({
                keyword: "",
                fromDate: "",
                toDate: "",
                status: "",
              })
            }
            style={{
              padding: "7px 12px",
              background: "#2a2a2a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              fontSize: 12,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <X size={12} /> Xóa lọc
          </button>
        )}
      </div>
      <div
        style={{
          background: "#111118",
          borderRadius: 8,
          border: "1px solid #1a1a2e",
          overflow: "hidden",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
        >
          <thead>
            <tr style={{ background: "#0a0a10" }}>
              <SortableHeader
                field="id"
                sort={orderSort}
                setSort={setOrderSort}
              >
                #
              </SortableHeader>
              <SortableHeader
                field="userId"
                sort={orderSort}
                setSort={setOrderSort}
              >
                Người dùng
              </SortableHeader>
              <SortableHeader
                field="totalAmount"
                sort={orderSort}
                setSort={setOrderSort}
              >
                Tổng tiền
              </SortableHeader>
              <SortableHeader
                field="status"
                sort={orderSort}
                setSort={setOrderSort}
              >
                Trạng thái
              </SortableHeader>
              <SortableHeader
                field="paymentMethod"
                sort={orderSort}
                setSort={setOrderSort}
              >
                Phương thức
              </SortableHeader>
              <SortableHeader
                field="orderDate"
                sort={orderSort}
                setSort={setOrderSort}
              >
                Ngày đặt
              </SortableHeader>
              <th style={thStyle}>Xem</th>
              <th style={thStyle}>Xử lý</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "9px 14px", color: "#555" }}>#{o.id}</td>
                <td style={{ padding: "9px 14px", color: "#fff" }}>
                  {o.username
                    ? `${o.username} (#${o.userId})`
                    : `NSD #${o.userId}`}
                </td>
                <td
                  style={{
                    padding: "9px 14px",
                    color: "#4caf50",
                    fontWeight: 600,
                  }}
                >
                  ${o.totalAmount?.toFixed(2)}
                </td>
                <td style={{ padding: "9px 14px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 700,
                      background:
                        o.status === "Completed"
                          ? "#10b98122"
                          : o.status === "Cancelled"
                            ? "#ef444422"
                            : o.status === "Refunded"
                              ? "#f59e0b22"
                              : "#3b82f622",
                      color:
                        o.status === "Completed"
                          ? "#10b981"
                          : o.status === "Cancelled"
                            ? "#ef4444"
                            : o.status === "Refunded"
                              ? "#f59e0b"
                              : "#3b82f6",
                      border: "1px solid currentColor",
                    }}
                  >
                    {statusVN[o.status] || o.status}
                  </span>
                </td>
                <td style={{ padding: "9px 14px", color: "#888" }}>
                  {o.paymentMethod || "Ví"}
                </td>
                <td style={{ padding: "9px 14px", color: "#888" }}>
                  {o.orderDate
                    ? new Date(o.orderDate).toLocaleDateString()
                    : "-"}
                </td>
                <td style={{ padding: "9px 14px" }}>
                  <Link
                    to={`/invoice/${o.id}`}
                    target="_blank"
                    style={{
                      color: "#2196f3",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      textDecoration: "none",
                    }}
                  >
                    <Eye size={14} /> Chi tiết
                  </Link>
                </td>
                <td style={{ padding: "9px 14px" }}>
                  {o.status === "Pending" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => setConfirmAction({ action: "approve", order: o })}
                        style={{
                          background: "#4caf50",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                        }}
                      >
                        <Check size={13} /> Duyệt
                      </button>
                      <button
                        onClick={() => setConfirmAction({ action: "cancel", order: o })}
                        style={{
                          background: "#e94560",
                          color: "#fff",
                          border: "none",
                          borderRadius: 4,
                          padding: "4px 8px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 12,
                        }}
                      >
                        <XCircle size={13} /> Hủy
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  style={{ padding: 20, textAlign: "center", color: "#666" }}
                >
                  Không tìm thấy đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={ordersPage}
          totalPages={ordersTotalPages}
          totalItems={ordersTotal}
          pageSize={ordersPageSize}
          setPage={setOrdersPage}
          setPageSize={setOrdersPageSize}
        />
      </div>
      {confirmAction && (
        <OrderActionModal
          action={confirmAction.action}
          order={confirmAction.order}
          onClose={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
          loading={actionLoading}
        />
      )}
    </div>
  );
}
