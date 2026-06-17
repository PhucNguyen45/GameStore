// GameStore.WebClient/src/components/games/GameNotFound.jsx
import { Link } from "react-router-dom";
import { Gamepad2 } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GameNotFound() {
  const { t } = useTranslation();
  return (
    <div style={{ textAlign: "center", padding: 100, background: "#121212", minHeight: "100vh", color: "#888" }}>
      <Gamepad2 size={64} />
      <h2 style={{ marginTop: 16, color: "#fff" }}>{t("gameDetail.notFound")}</h2>
      <Link to="/store" style={{ color: "#fff", marginTop: 12, display: "inline-block", textDecoration: "underline" }}>
        {t("gameDetail.backToStore")}
      </Link>
    </div>
  );
}
