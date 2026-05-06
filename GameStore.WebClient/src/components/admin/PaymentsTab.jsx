// GameStore.WebClient/src/components/admin/PaymentsTab.jsx
import { useState, useEffect } from "react";
import { X, DollarSign, RefreshCw, Eye } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";
import { thStyle, sortFn, filterInputStyle } from "./adminStyles";
import { adminAPI } from "../../services/api";

function OrderDetailModal({ orderId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI
      .getOrderPayments(orderId)
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading)
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: "#111118",
            borderRadius: 12,
            padding: 30,
            color: "#888",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          Loading...
        </div>
      </div>
    );

  const order = data?.order;
  const payments = data?.payments || [];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#111118",
          borderRadius: 12,
          padding: 30,
          width: 600,
          maxHeight: "85vh",
          overflow: "auto",
          border: "1px solid #1a1a2e",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: 16,
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          📋 Order #{order?.id} Details
        </h3>

        {/* Order info */}
        <div
          style={{
            background: "#0a0a10",
            borderRadius: 8,
            padding: 14,
            marginBottom: 16,
            fontSize: 12,
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div>
              <span style={{ color: "#666" }}>User:</span>{" "}
              <span style={{ color: "#fff" }}>
                {order?.username} (#{order?.userId})
              </span>
            </div>
            <div>
              <span style={{ color: "#666" }}>Total:</span>{" "}
              <span style={{ color: "#4caf50", fontWeight: 600 }}>
                ${order?.totalAmount?.toFixed(2)}
              </span>
            </div>
            <div>
              <span style={{ color: "#666" }}>Status:</span>{" "}
              <span
                style={{
                  color: order?.status === "Completed" ? "#4caf50" : "#ffc107",
                  fontWeight: 600,
                }}
              >
                {order?.status}
              </span>
            </div>
            <div>
              <span style={{ color: "#666" }}>Date:</span>{" "}
              <span style={{ color: "#ccc" }}>
                {order?.orderDate
                  ? new Date(order.orderDate).toLocaleString()
                  : "-"}
              </span>
            </div>
            <div>
              <span style={{ color: "#666" }}>Method:</span>{" "}
              <span style={{ color: "#ccc" }}>{order?.paymentMethod}</span>
            </div>
          </div>
        </div>

        {/* Order items */}
        <h4
          style={{
            color: "#888",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          Items
        </h4>
        <div style={{ marginBottom: 16 }}>
          {order?.items?.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 10px",
                background: "#0a0a10",
                borderRadius: 6,
                marginBottom: 4,
                fontSize: 12,
              }}
            >
              <span style={{ color: "#fff" }}>
                {item.gameTitle}{" "}
                <span style={{ color: "#666" }}>×{item.quantity}</span>
              </span>
              <span style={{ color: "#4caf50", fontWeight: 600 }}>
                ${item.unitPrice?.toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Payments */}
        <h4
          style={{
            color: "#888",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1,
            marginBottom: 8,
          }}
        >
          Payment Records
        </h4>
        {payments.length === 0 ? (
          <p
            style={{
              color: "#666",
              fontSize: 12,
              textAlign: "center",
              padding: 12,
            }}
          >
            No payment records
          </p>
        ) : (
          payments.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#0a0a10",
                borderRadius: 6,
                padding: 10,
                marginBottom: 4,
                fontSize: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#fff" }}>
                  #{p.id} — {p.paymentMethod}
                </span>
                <span
                  style={{
                    color:
                      p.status === "Completed"
                        ? "#4caf50"
                        : p.status === "Refunded"
                          ? "#e94560"
                          : "#ffc107",
                    fontWeight: 600,
                  }}
                >
                  {p.status}
                </span>
              </div>
              <div style={{ color: "#666", fontSize: 10, marginTop: 4 }}>
                ${p.amount?.toFixed(2)} • {new Date(p.paidAt).toLocaleString()}
                {p.transactionId && <> • TXN: {p.transactionId}</>}
              </div>
              {p.note && (
                <div style={{ color: "#888", fontSize: 10, marginTop: 2 }}>
                  Note: {p.note}
                </div>
              )}
            </div>
          ))
        )}

        <div
          style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              background: "#2a2a2a",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentsTab() {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState({
    keyword: "",
    status: "",
    method: "",
    fromDate: "",
    toDate: "",
  });
  const [sort, setSort] = useState({ field: "paidAt", dir: "desc" });
  const [viewOrderId, setViewOrderId] = useState(null);

  const load = async () => {
    try {
      const params = { page, pageSize };
      if (search.keyword) params.keyword = search.keyword;
      if (search.status) params.status = search.status;
      if (search.method) params.method = search.method;
      if (search.fromDate) params.fromDate = search.fromDate;
      if (search.toDate) params.toDate = search.toDate;
      const res = await adminAPI.getPayments(params);
      setPayments(res.data.data || []);
      setTotal(res.data.totalCount || 0);
    } catch {
      setPayments([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [page, pageSize, search]);

  const handleRefund = async (p) => {
    const note = prompt("Refund note (optional):", "Admin refund");
    if (note === null) return;
    try {
      await adminAPI.refundPayment(p.id, { note });
      alert("Payment refunded successfully!");
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const sorted = sortFn(payments, sort.field, sort.dir);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const hasFilters =
    search.keyword ||
    search.status ||
    search.method ||
    search.fromDate ||
    search.toDate;

  const statusColor = (s) =>
    s === "Completed"
      ? "#4caf50"
      : s === "Refunded"
        ? "#e94560"
        : s === "Failed"
          ? "#ff5722"
          : "#ffc107";

  return (
    <div>
      <div
        style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
      >
        <input
          placeholder="Search ID, TXN, or username..."
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 200 }}
        />
        <select
          value={search.status}
          onChange={(e) => setSearch({ ...search, status: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">All Statuses</option>
          <option value="Completed">Completed</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          value={search.method}
          onChange={(e) => setSearch({ ...search, method: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">All Methods</option>
          <option value="Wallet">Wallet</option>
          <option value="CreditCard">Credit Card</option>
          <option value="PayPal">PayPal</option>
        </select>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#888",
            fontSize: 12,
          }}
        >
          From:{" "}
          <input
            type="date"
            value={search.fromDate}
            onChange={(e) => setSearch({ ...search, fromDate: e.target.value })}
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
          To:{" "}
          <input
            type="date"
            value={search.toDate}
            onChange={(e) => setSearch({ ...search, toDate: e.target.value })}
            style={filterInputStyle}
          />
        </div>
        {hasFilters && (
          <button
            onClick={() =>
              setSearch({
                keyword: "",
                status: "",
                method: "",
                fromDate: "",
                toDate: "",
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
            <X size={12} /> Clear
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
              <SortableHeader field="id" sort={sort} setSort={setSort}>
                #
              </SortableHeader>
              <SortableHeader field="orderId" sort={sort} setSort={setSort}>
                Order
              </SortableHeader>
              <SortableHeader field="username" sort={sort} setSort={setSort}>
                User
              </SortableHeader>
              <SortableHeader field="amount" sort={sort} setSort={setSort}>
                Amount
              </SortableHeader>
              <SortableHeader
                field="paymentMethod"
                sort={sort}
                setSort={setSort}
              >
                Method
              </SortableHeader>
              <SortableHeader field="status" sort={sort} setSort={setSort}>
                Status
              </SortableHeader>
              <SortableHeader field="paidAt" sort={sort} setSort={setSort}>
                Date
              </SortableHeader>
              <th style={{ ...thStyle, cursor: "default" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "9px 14px", color: "#555" }}>#{p.id}</td>
                <td style={{ padding: "9px 14px" }}>
                  <button
                    onClick={() => setViewOrderId(p.orderId)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--accent)",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: "underline",
                    }}
                  >
                    #{p.orderId}
                  </button>
                </td>
                <td style={{ padding: "9px 14px", color: "#fff" }}>
                  {p.username}{" "}
                  <span style={{ color: "#666" }}>#{p.userId}</span>
                </td>
                <td
                  style={{
                    padding: "9px 14px",
                    color: "#4caf50",
                    fontWeight: 600,
                  }}
                >
                  ${p.amount?.toFixed(2)}
                </td>
                <td style={{ padding: "9px 14px", color: "#ccc" }}>
                  {p.paymentMethod}
                </td>
                <td style={{ padding: "9px 14px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <div
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: statusColor(p.status),
                      }}
                    />
                    <span
                      style={{
                        color: statusColor(p.status),
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {p.status}
                    </span>
                  </span>
                </td>
                <td style={{ padding: "9px 14px", color: "#888" }}>
                  {new Date(p.paidAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "9px 14px", display: "flex", gap: 5 }}>
                  <button
                    onClick={() => setViewOrderId(p.orderId)}
                    style={{
                      padding: "4px 7px",
                      background: "#1a1a2e",
                      border: "none",
                      borderRadius: 4,
                      cursor: "pointer",
                    }}
                    title="View Order"
                  >
                    <Eye size={11} color="#4fc3f7" />
                  </button>
                  {p.status === "Completed" && (
                    <button
                      onClick={() => handleRefund(p)}
                      style={{
                        padding: "4px 7px",
                        background: "#1a1a2e",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                      title="Refund"
                    >
                      <RefreshCw size={11} color="#e94560" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {sorted.length === 0 && (
              <tr>
                <td
                  colSpan="8"
                  style={{ padding: 20, textAlign: "center", color: "#666" }}
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={total}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </div>

      {viewOrderId && (
        <OrderDetailModal
          orderId={viewOrderId}
          onClose={() => setViewOrderId(null)}
        />
      )}
    </div>
  );
}
