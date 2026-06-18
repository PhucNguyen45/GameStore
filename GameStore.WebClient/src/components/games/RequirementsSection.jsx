// GameStore.WebClient/src/components/games/RequirementsSection.jsx
import { Monitor, Cpu, HardDrive, Gamepad2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function RequirementsSection({ game }) {
  const { t } = useTranslation();

  const items = [
    { icon: Monitor, label: t("gameDetail.os"), value: game.minimumOS },
    { icon: Cpu, label: t("gameDetail.processor"), value: game.minimumProcessor },
    { icon: HardDrive, label: t("gameDetail.memory"), value: game.minimumMemory },
    { icon: Gamepad2, label: t("gameDetail.graphics"), value: game.minimumGraphics },
    { icon: HardDrive, label: t("gameDetail.storage"), value: game.minimumStorage },
  ].filter((r) => r.value);

  return (
    <div style={{ maxWidth: 700 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 30, letterSpacing: -0.5 }}>
        {t("gameDetail.tabRequirements")}
      </h2>
      <div style={{ background: "#1e1e1e", borderRadius: 8, padding: "30px 32px", border: "1px solid #333" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {items.map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Icon size={16} color="#666" />
              <span style={{ fontSize: 12, color: "#888", minWidth: 120, textTransform: "uppercase", letterSpacing: 1 }}>
                {label}
              </span>
              <span style={{ fontSize: 14, color: "#ccc" }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
