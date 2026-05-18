// GameStore.WebClient/src/pages/InvoicePage.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { orderAPI } from "../services/api";
import {
  CheckCircle2,
  Clock,
  XCircle,
  ArrowLeft,
  Download,
  Printer,
  Loader2,
  CreditCard,
  PackageCheck,
  Send,
} from "lucide-react";
import toast from "react-hot-toast";

export default function InvoicePage() {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getById(id);
        setOrder(res.data);
      } catch (err) {
        toast.error("Lỗi khi tải chi tiết Hóa đơn");
      } finally {
        setLoading(false);
      }
    };

    if (!order || order.status === "Pending") {
      fetchOrder();
    }

    // Poll for status updates every 5 seconds if pending
    const interval = setInterval(() => {
      if (order?.status === "Pending" || !order) {
        fetchOrder();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, order?.status]);

  if (loading) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", paddingTop: 100 }}
      >
        <Loader2 className="animate-spin" size={48} color="#e94560" />
        <p style={{ marginTop: 20 }}>Loading invoice...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", paddingTop: 100 }}
      >
        <h2>Không tìm thấy đơn hàng</h2>
        <Link to="/store" className="btn-primary" style={{ marginTop: 20 }}>
          Quay về cửa hàng
        </Link>
      </div>
    );
  }

  const steps = [
    { label: "Order Placed", icon: PackageCheck, completed: true },
    { label: "Payment Received", icon: CreditCard, completed: true },
    {
      label: "Admin Review",
      icon: Clock,
      completed: order.status !== "Pending" && order.status !== "Cancelled",
      active: order.status === "Pending",
    },
    {
      label: "Delivery (Email)",
      icon: Send,
      completed: order.status === "Completed" || order.status === "Approved",
      active: false,
    },
  ];

  return (
    <div className="container" style={{ paddingTop: 40, maxWidth: 800 }}>
      <Link
        to="/store"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "#6b6b8e",
          marginBottom: 30,
        }}
      >
        <ArrowLeft size={18} /> Trở về cửa hàng
      </Link>

      {/* Stepper Section */}
      <div
        style={{
          background: "#16162a",
          padding: "30px 40px",
          borderRadius: 20,
          border: "1px solid #2a2a4a",
          marginBottom: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
            }}
          >
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: step.completed
                  ? "#10b981"
                  : step.active
                    ? "#f59e0b"
                    : "#1a1a3e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                zIndex: 2,
                border: step.active ? "2px solid #f59e0b" : "none",
              }}
            >
              <step.icon
                size={24}
                color={step.completed || step.active ? "#fff" : "#6b6b8e"}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: step.completed || step.active ? "#fff" : "#6b6b8e",
                textAlign: "center",
              }}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <div
                style={{
                  position: "absolute",
                  top: 25,
                  left: "50%",
                  width: "100%",
                  height: 2,
                  background: step.completed ? "#10b981" : "#2a2a4a",
                  zIndex: 1,
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#16162a",
          borderRadius: 20,
          border: "1px solid #2a2a4a",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        {/* Status Header */}
        <div
          style={{
            background:
              order.status === "Completed" || order.status === "Approved"
                ? "#10b98122"
                : order.status === "Cancelled" || order.status === "Rejected"
                  ? "#ef444422"
                  : "#f59e0b22",
            padding: "30px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #2a2a4a",
          }}
        >
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              Hóa đơn số #{id}
            </h2>
            <p style={{ color: "#6b6b8e", fontSize: 14 }}>
              Đơn được đặt vào {new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              borderRadius: 50,
              background:
                order.status === "Completed" || order.status === "Approved"
                  ? "#10b981"
                  : order.status === "Cancelled" || order.status === "Rejected"
                    ? "#ef4444"
                    : "#f59e0b",
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {order.status === "Completed" || order.status === "Approved" ? (
              <CheckCircle2 size={20} />
            ) : order.status === "Cancelled" || order.status === "Rejected" ? (
              <XCircle size={20} />
            ) : (
              <Clock size={20} />
            )}
            {order.status === "Completed" || order.status === "Approved"
              ? "Đã duyệt"
              : order.status === "Cancelled" || order.status === "Rejected"
                ? "Bị hủy"
                : "Chờ Admin duyệt..."}
          </div>
        </div>

        <div style={{ padding: 40 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              marginBottom: 40,
            }}
          >
            <div>
              <h4
                style={{
                  color: "#6b6b8e",
                  textTransform: "uppercase",
                  fontSize: 12,
                  letterSpacing: 1,
                  marginBottom: 15,
                }}
              >
                Customer Info
              </h4>
              <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 5 }}>
                Email: {order.email || "N/A"}
              </p>
              <p style={{ color: "#e0e0e0" }}>
                Siis ==: {order.phone || "N/A"}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <h4
                style={{
                  color: "#6b6b8e",
                  textTransform: "uppercase",
                  fontSize: 12,
                  letterSpacing: 1,
                  marginBottom: 15,
                }}
              >
                Thông tin đơn hàng
              </h4>
              <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 5 }}>
                Status:{" "}
                <span
                  style={{
                    color:
                      order.status === "Completed" ||
                      order.status === "Approved"
                        ? "#10b981"
                        : "#f59e0b",
                  }}
                >
                  {order.status === "Completed" || order.status === "Approved"
                    ? "Đã thanh toán"
                    : "Đang xãc minh..."}
                </span>
              </p>
              <p style={{ color: "#e0e0e0" }}>
                Phương thức thanh toán: {order.paymentMethod}
              </p>
            </div>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: 30,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid #2a2a4a" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "15px 0",
                    color: "#6b6b8e",
                    fontWeight: 500,
                  }}
                >
                  Mô tả
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "15px 0",
                    color: "#6b6b8e",
                    fontWeight: 500,
                  }}
                >
                  Số luọng
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "15px 0",
                    color: "#6b6b8e",
                    fontWeight: 500,
                  }}
                >
                  Giá
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "15px 0",
                    color: "#6b6b8e",
                    fontWeight: 500,
                  }}
                >
                  Số lượng
                </th>
              </tr>
            </thead>
            <tbody>
              {(order.orderDetails || order.items).map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #2a2a4a" }}>
                  <td style={{ padding: "20px 0", fontWeight: 600 }}>
                    <div>{item.game?.title || item.title}</div>
                    {item.gameKeys && item.gameKeys.length > 0 && (
                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 13,
                          color: "#10b981",
                          background: "#10b98111",
                          padding: "4px 8px",
                          borderRadius: 4,
                          display: "inline-block",
                        }}
                      >
                        Key: {item.gameKeys.map((k) => k.keyCode).join(", ")}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: "20px 0", textAlign: "center" }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: "20px 0", textAlign: "right" }}>
                    ${(item.unitPrice || item.price).toFixed(2)}
                  </td>
                  <td style={{ padding: "20px 0", textAlign: "right" }}>
                    $
                    {((item.unitPrice || item.price) * item.quantity).toFixed(
                      2,
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 250 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span style={{ color: "#6b6b8e" }}>Subtotal</span>
                <span>{(order.totalAmount || order.total).toFixed(2)} VND</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 10,
                }}
              >
                <span style={{ color: "#6b6b8e" }}>Tax (0%)</span>
                <span>0.00 VND</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 15,
                  paddingTop: 15,
                  borderTop: "2px solid #2a2a4a",
                }}
              >
                <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
                <span
                  style={{ fontSize: 24, fontWeight: 800, color: "#e94560" }}
                >
                  ${(order.totalAmount || order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 50, display: "flex", gap: 15 }}>
            <button
              className="btn-outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
              }}
            >
              <Printer size={18} /> In hóa đơn
            </button>
            <button
              className="btn-outline"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 20px",
              }}
            >
              <Download size={18} /> Tải về file PDF
            </button>
          </div>

          {order.status === "Pending" && (
            <div
              style={{
                marginTop: 40,
                padding: 20,
                background: "#1a1a3e",
                borderRadius: 12,
                borderLeft: "4px solid #f59e0b",
                display: "flex",
                alignItems: "flex-start",
                gap: 15,
              }}
            >
              <Clock
                size={24}
                color="#f59e0b"
                style={{ flexShrink: 0, marginTop: 3 }}
              />
              <div>
                <p
                  style={{ fontWeight: 600, color: "#f59e0b", marginBottom: 5 }}
                >
                  Notice:
                </p>
                <p style={{ fontSize: 14, color: "#6b6b8e", lineHeight: 1.5 }}>
                  Đơn hàng của bạn hiện đang được quản trị viên của chúng tôi
                  xem xét. Quá trình này thường mất 30 phút đến 1 giờ. Nếu đơn
                  hàng bị từ chối, bạn sẽ được hoàn lại toàn bộ số tiền vào ví.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
