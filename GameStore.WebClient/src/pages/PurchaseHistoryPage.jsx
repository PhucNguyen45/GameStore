// GameStore.WebClient/src/pages/PurchaseHistoryPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { Eye, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

const statusConfig = {
  Pending: { color: "#ffc107", icon: Clock },
  Completed: { color: "#4caf50", icon: CheckCircle },
  Cancelled: { color: "#e94560", icon: XCircle },
  Refunded: { color: "#ff9800", icon: RefreshCw },
};

export default function PurchaseHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      orderAPI
        .getHistory()
        .then((res) => setOrders(res.data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user)
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Đăng nhập để xem lịch sử giao dịch.
      </div>
    );
  if (loading)
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        Đang tải...
      </div>
    );

  return (
    <div className="container" style={{ paddingTop: 30, maxWidth: 1000 }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 24 }}>
        Lịch sử giao dịch.
      </h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#888" }}>
          <Clock size={48} color="#444" />
          <p style={{ marginTop: 16 }}>You haven't placed any orders yet.</p>
          <Link
            to="/store"
            className="btn-primary"
            style={{ marginTop: 16, display: "inline-block" }}
          >
            Xem Game
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Clock;
            return (
              <div
                key={order.id}
                style={{
                  background: "#16162a",
                  borderRadius: 12,
                  border: "1px solid #2a2a4a",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "14px 20px",
                    borderBottom: "1px solid #2a2a4a",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span style={{ fontWeight: 600, color: "#fff" }}>
                      Order #{order.id}
                    </span>
                    <span style={{ fontSize: 12, color: "#888" }}>
                      {new Date(order.orderDate).toLocaleString()}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <StatusIcon
                      size={16}
                      color={statusConfig[order.status]?.color || "#888"}
                    />
                    <span
                      style={{
                        color: statusConfig[order.status]?.color || "#888",
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {order.status}
                    </span>
                    <Link
                      to={`/invoice/${order.id}`}
                      style={{
                        marginLeft: 12,
                        background: "#1a1a3e",
                        padding: "4px 10px",
                        borderRadius: 4,
                        color: "#4fc3f7",
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 12,
                      }}
                    >
                      <Eye size={14} /> Chi Tiết
                    </Link>
                  </div>
                </div>

                {/* Items */}
                <div style={{ padding: "12px 20px" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 13,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          color: "#888",
                          borderBottom: "1px solid #2a2a4a",
                        }}
                      >
                        <th style={{ textAlign: "left", padding: "6px 0" }}>
                          Game
                        </th>
                        <th style={{ textAlign: "center", padding: "6px 0" }}>
                          Số lượng
                        </th>
                        <th style={{ textAlign: "right", padding: "6px 0" }}>
                          Giá
                        </th>
                        <th style={{ textAlign: "right", padding: "6px 0" }}>
                          Tổng cộng
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item, idx) => (
                        <tr
                          key={idx}
                          style={{ borderBottom: "1px solid #1e1e2e" }}
                        >
                          <td style={{ padding: "8px 0", color: "#ddd" }}>
                            <Link
                              to={`/game/${item.gameId}`}
                              style={{ color: "#4fc3f7" }}
                            >
                              {item.gameTitle}
                            </Link>
                          </td>
                          <td style={{ textAlign: "center", color: "#ccc" }}>
                            {item.quantity}
                          </td>
                          <td style={{ textAlign: "right", color: "#ccc" }}>
                            ${item.unitPrice.toFixed(2)}
                          </td>
                          <td
                            style={{
                              textAlign: "right",
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          >
                            ${(item.unitPrice * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer */}
                <div
                  style={{
                    padding: "12px 20px",
                    borderTop: "1px solid #2a2a4a",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#0d0d14",
                  }}
                >
                  <span style={{ color: "#888", fontSize: 12 }}>
                    Phương thức thanh toán: {order.paymentMethod}
                  </span>
                  <span
                    style={{ fontWeight: 800, fontSize: 18, color: "#e94560" }}
                  >
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
