// GameStore.WebClient/src/pages/InvoicePage.jsx
import { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { orderAPI, userAPI } from "../../services/api";
import { formatVND } from "../../utils/format";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  Printer,
  CreditCard,
  PackageCheck,
  Send,
  RefreshCw,
} from "lucide-react";
import { InvoiceSkeleton, BackButton } from "../../components/common";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";

export default function InvoicePage() {
  const { t } = useTranslation();
  const { updateUser } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getById(id);
        setOrder(res.data);
        // Refresh wallet balance if order is cancelled or refunded
        if (res.data?.status === "Cancelled" || res.data?.status === "Refunded" || res.data?.status === "Rejected") {
          userAPI.getProfile().then(({ data }) => {
            if (data.wallet !== undefined) {
              updateUser({ wallet: data.wallet });
            }
          }).catch(() => {});
        }
      } catch (err) {
        toast.error(t("invoice.loadError"));
      } finally {
        setLoading(false);
      }
    };

    if (!order || order.status === "Pending") {
      fetchOrder();
    }

    const interval = setInterval(() => {
      if (order?.status === "Pending" || !order) {
        fetchOrder();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, order?.status]);

  if (loading) return <InvoiceSkeleton />;

  if (!order) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", paddingTop: 100 }}
      >
        <h2>{t("invoice.notFound")}</h2>            <Link to="/store" className="btn btn-primary" style={{ marginTop: 20 }}>
          {t("invoice.goToStore")}
        </Link>
      </div>
    );
  }

  const isCancelled = order.status === "Cancelled" || order.status === "Rejected" || order.status === "Refunded";

  const steps = isCancelled
    ? [
        { label: t("invoice.stepPlaced"), icon: PackageCheck, completed: true },
        { label: t("invoice.stepPayment"), icon: CreditCard, completed: true },
        {
          label: t("orders.statusCancelled"),
          icon: XCircle,
          completed: true,
          cancelled: true,
        },
      ]
    : [
        { label: t("invoice.stepPlaced"), icon: PackageCheck, completed: true },
        { label: t("invoice.stepPayment"), icon: CreditCard, completed: true },
        {
          label: t("invoice.stepReview"),
          icon: Clock,
          completed: order.status !== "Pending",
          active: order.status === "Pending",
        },
        {
          label: t("invoice.stepDelivery"),
          icon: Send,
          completed: order.status === "Completed" || order.status === "Approved",
          active: false,
        },
      ];

  const getStatusBadge = () => {
    if (order.status === "Completed" || order.status === "Approved") {
      return { text: t("invoice.approved"), color: "#10b981", icon: CheckCircle2 };
    } else if (order.status === "Cancelled" || order.status === "Rejected") {
      return { text: t("orders.statusCancelled"), color: "#ef4444", icon: XCircle };
    } else if (order.status === "Refunded") {
      return { text: t("orders.statusRefunded"), color: "#ff9800", icon: RefreshCw };
    }
    return { text: t("invoice.waiting"), color: "#f59e0b", icon: Clock };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="container" style={{ paddingTop: 40, maxWidth: 800 }}>
      <BackButton fallback="/store" label={t("invoice.backToStore")} />
      <div className="invoice-stepper" style={{
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
        {steps.map((step, idx) => (            <div
            key={idx}
            className="step"
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
                background: step.cancelled
                  ? "#ef4444"
                  : step.completed
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
                color={step.cancelled || step.completed || step.active ? "#fff" : "#6b6b8e"}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: step.cancelled ? "#ef4444" : step.completed || step.active ? "#fff" : "#6b6b8e",
                textAlign: "center",
              }}
            >
              {step.label}
            </span>
            {idx < steps.length - 1 && (
              <div
                className="step-connector"
                style={{
                  position: "absolute",
                  top: 25,
                  left: "50%",
                  width: "100%",
                  height: 2,
                  background: step.cancelled ? "#ef4444" : step.completed ? "#10b981" : "#2a2a4a",
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
        <div
          style={{
            background: `${statusBadge.color}22`,
            padding: "30px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #2a2a4a",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
              {t("invoice.invoiceTitle", { id })}
            </h2>
            <p style={{ color: "#6b6b8e", fontSize: 14 }}>
              {t("invoice.orderDate", { date: new Date(order.orderDate).toLocaleDateString() })}
            </p>
            {order.recipientEmail && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 8,
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: "linear-gradient(135deg, #e9456033, #ffd70022)",
                  border: "1px solid #e9456055",
                  fontSize: 13,
                  color: "#ffd700",
                  fontWeight: 600,
                }}
              >
                🎁 Quà tặng cho {order.recipientEmail}
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 20px",
              borderRadius: 50,
              background: statusBadge.color,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            <statusBadge.icon size={20} />
            {statusBadge.text}
          </div>
        </div>

        <div style={{ padding: "clamp(20px, 4vw, 40px)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
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
                {t("invoice.customerInfo")}
              </h4>
              <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 5 }}>
                Email: {order.email || "N/A"}
              </p>
              <p style={{ color: "#e0e0e0" }}>{t("payment.phoneLabel")}: {order.phone || "N/A"}</p>
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
                {t("invoice.paymentDetails")}
              </h4>
              <p style={{ fontWeight: 600, fontSize: 16, marginBottom: 5 }}>
                {t("invoice.status")}{" "}
                <span
                  style={{
                    color: order.status === "Completed" || order.status === "Approved"
                      ? "#10b981" : order.status === "Cancelled" || order.status === "Rejected"
                        ? "#ef4444" : order.status === "Refunded"
                          ? "#ff9800" : "#f59e0b",
                  }}
                >
                  {order.status === "Completed" || order.status === "Approved"
                    ? t("invoice.paid")
                    : order.status === "Cancelled" || order.status === "Rejected"
                      ? t("orders.statusCancelled")
                      : order.status === "Refunded"
                        ? t("orders.statusRefunded")
                        : t("invoice.verifying")}
                </span>
              </p>
              <p style={{ color: "#e0e0e0" }}>
                {t("invoice.method", { method: order.paymentMethod })}
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
                <th style={{ textAlign: "left", padding: "15px 0", color: "#6b6b8e", fontWeight: 500 }}>
                  {t("invoice.description")}
                </th>
                <th style={{ textAlign: "center", padding: "15px 0", color: "#6b6b8e", fontWeight: 500 }}>
                  {t("invoice.qty")}
                </th>
                <th style={{ textAlign: "right", padding: "15px 0", color: "#6b6b8e", fontWeight: 500 }}>
                  {t("invoice.price")}
                </th>
                <th style={{ textAlign: "right", padding: "15px 0", color: "#6b6b8e", fontWeight: 500 }}>
                  {t("invoice.amount")}
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
                    {formatVND(item.unitPrice || item.price || 0)}
                  </td>
                  <td style={{ padding: "20px 0", textAlign: "right" }}>
                    {formatVND((item.unitPrice || item.price || 0) * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 250 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#6b6b8e" }}>{t("invoice.subtotal")}</span>
                <span>{formatVND(order.totalAmount || order.total || 0)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: "#6b6b8e" }}>{t("invoice.tax")}</span>
                <span>0₫</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 15, paddingTop: 15, borderTop: "2px solid #2a2a4a" }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{t("invoice.total")}</span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#e94560" }}>
                  {formatVND(order.totalAmount || order.total || 0)}
                </span>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 50, display: "flex", gap: 15, flexWrap: "wrap" }}>
            <button
              className="btn btn-outline"
            >
              <Printer size={18} /> {t("invoice.printInvoice")}
            </button>
            <button
              className="btn btn-outline"
            >
              <Download size={18} /> {t("invoice.downloadPdf")}
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
              <Clock size={24} color="#f59e0b" style={{ flexShrink: 0, marginTop: 3 }} />
              <div>
                <p style={{ fontWeight: 600, color: "#f59e0b", marginBottom: 5 }}>
                  {t("invoice.notice")}
                </p>
                <p style={{ fontSize: 14, color: "#6b6b8e", lineHeight: 1.5 }}>
                  {t("invoice.noticeText")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
