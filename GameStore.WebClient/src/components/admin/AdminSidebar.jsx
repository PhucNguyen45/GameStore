import { Gamepad2, Users, Package, LayoutDashboard, Tag, Key, CreditCard, Shield } from "lucide-react";

const tabs = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "games", icon: Gamepad2, label: "Games" },
  { id: "categories", icon: Tag, label: "Categories" },
  { id: "gamekeys", icon: Key, label: "Game Keys" },
  { id: "users", icon: Users, label: "Users" },
  { id: "orders", icon: Package, label: "Orders" },
  { id: "payments", icon: CreditCard, label: "Payments" },
  { id: "staffroles", icon: Shield, label: "Staff & Roles" },
];

export { tabs };

export default function AdminSidebar({ user, activeTab, setActiveTab }) {
  return (
    <div style={{
      width: 200, background: "#0d0d14", borderRight: "1px solid #1a1a2e",
      padding: "20px 0", flexShrink: 0, height: "100vh", position: "sticky", top: 0,
    }}>
      <div style={{ padding: "0 16px", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6, background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>A</span>
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 12, color: "#fff" }}>Admin</div>
            <div style={{ fontSize: 10, color: "#666" }}>
              {user?.displayName || user?.username}
            </div>
          </div>
        </div>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "9px 16px",
              border: "none", cursor: "pointer", fontSize: 12, fontWeight: 500,
              background: activeTab === id ? "var(--accent)" : "transparent",
              color: activeTab === id ? "#fff" : "#888",
              textAlign: "left", transition: "all 0.15s", width: "100%",
            }}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
