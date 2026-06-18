// GameStore.WebClient/src/components/admin/OrdersTab.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { formatVND } from "../../utils/format";
import SortableHeader from "./SortableHeader";
import Pagination from "../common/Pagination";
import { thStyle, filterInputStyle } from "./adminStyles";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { Eye, Check, XCircle, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

function OrderActionModal({ action, order, onClose, onConfirm, loading }) {
  const { t } = useTranslation();
  const isApprove = action === "approve";
  const accent = isApprove ? "#4caf50" : "#e94560";
  const accentBg = isApprove ? "#4caf5018" : "#e9456018";
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: 400, padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: accentBg, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <AlertTriangle size={20} color={accent} />
          </div>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#fff" }}>
            {isApprove ? t("admin.approveOrder") : t("admin.rejectOrder")}
          </h3>
        </div>
        <p style={{ margin: "0 0 6px", color: "#aaa", fontSize: 13 }}>
          {isApprove ? t("admin.approveDesc") : t("admin.rejectDesc")}
        </p>
        <p style={{ margin: "0 0 24px", color: "#666", fontSize: 12 }}>
          Đơn #{order.id} — {order.username || `NSD #${order.userId}`} —{" "}
          <span style={{ color: "#4caf50", fontWeight: 600 }}>{formatVND(order.totalAmount || 0)}</span>
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
            {t("common.cancel")}
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
            {loading ? t("admin.loading") : isApprove ? <><Check size={14} /> {t("admin.confirmApprove")}</> : <><XCircle size={14} /> {t("admin.confirmCancel")}</>}
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
  const { t } = useTranslation();
  const statusVN = { Pending: t("orders.statusPending"), Completed: t("orders.statusCompleted"), Cancelled: t("orders.statusCancelled"), Refunded: t("orders.statusRefunded") };

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
      toast.success(action === "approve" ? t("admin.orderApproved") : t("admin.orderCancelled"));
      setConfirmAction(null);
      loadOrders();
    } catch (e) {
      toast.error(e.response?.data?.message || (action === "approve" ? t("admin.approveFailed") : t("admin.cancelFailed")));
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
          placeholder={t("admin.searchOrders")}
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
          {t("admin.fromDate")}:{" "}
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
          {t("admin.toDate")}:{" "}
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
          <option value="">{t("admin.allStatuses")}</option>
          <option value="Pending">{t("orders.statusPending")}</option>
          <option value="Completed">{t("orders.statusCompleted")}</option>
          <option value="Cancelled">{t("orders.statusCancelled")}</option>
          <option value="Refunded">{t("orders.statusRefunded")}</option>
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
            <X size={12} /> {t("admin.clearFilter")}
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
                {t("admin.user")}
              </SortableHeader>
              <SortableHeader
                field="totalAmount"
                sort={orderSort}
                setSort={setOrderSort}
              >
                {t("admin.total")}
              </SortableHeader>
              <SortableHeader
                field="status"
                sort={orderSort}
                setSort={setOrderSort}
              >
                {t("admin.orderStatus")}
              </SortableHeader>
              <SortableHeader
                field="paymentMethod"
                sort={orderSort}
                setSort={setOrderSort}
              >
                {t("admin.paymentMethod")}
              </SortableHeader>
              <SortableHeader
                field="orderDate"
                sort={orderSort}
                setSort={setOrderSort}
              >
                {t("admin.orderDate")}
              </SortableHeader>
              <th style={thStyle}>{t("admin.viewInvoice")}</th>
              <th style={thStyle}>{t("admin.process")}</th>
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
                  {formatVND(o.totalAmount || 0)}
                </td>
                <td style={{ padding: "9px 14px" }}>
                  <span className={`badge ${
                    o.status === "Completed"
                      ? "badge-success"
                      : o.status === "Cancelled"
                        ? "badge-danger"
                        : o.status === "Refunded"
                          ? "badge-warning"
                          : "badge-accent"
                  }`}>
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
                    <Eye size={14} /> {t("admin.viewDetail")}
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
                        <Check size={13} /> {t("admin.approveAction")}
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
                        <XCircle size={13} /> {t("admin.cancelAction")}
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
                  {t("admin.noOrders")}
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
