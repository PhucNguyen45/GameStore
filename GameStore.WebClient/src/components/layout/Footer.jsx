// GameStore.WebClient/src/components/layout/Footer.jsx
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid #222",
        padding: "40px 0",
        marginTop: 60,
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 40,
          fontSize: 13,
          color: "#777",
        }}
      >
        <div>
          <h4
            style={{
              color: "#aaa",
              marginBottom: 12,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("footer.resources")}
          </h4>
          <p style={{ marginBottom: 6 }}>{t("footer.support")}</p>
          <p style={{ marginBottom: 6 }}>{t("footer.faq")}</p>
          <p style={{ marginBottom: 6 }}>{t("footer.community")}</p>
        </div>
        <div>
          <h4
            style={{
              color: "#aaa",
              marginBottom: 12,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("footer.company")}
          </h4>
          <p style={{ marginBottom: 6 }}>{t("footer.about")}</p>
          <p style={{ marginBottom: 6 }}>{t("footer.careers")}</p>
          <p style={{ marginBottom: 6 }}>{t("footer.news")}</p>
        </div>
        <div>
          <h4
            style={{
              color: "#aaa",
              marginBottom: 12,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("footer.legal")}
          </h4>
          <p style={{ marginBottom: 6 }}>{t("footer.terms")}</p>
          <p style={{ marginBottom: 6 }}>{t("footer.privacy")}</p>
          <p style={{ marginBottom: 6 }}>{t("footer.cookies")}</p>
        </div>
        <div>
          <h4
            style={{
              color: "#aaa",
              marginBottom: 12,
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {t("footer.follow")}
          </h4>
          <p style={{ marginBottom: 6 }}>Twitter</p>
          <p style={{ marginBottom: 6 }}>Facebook</p>
          <p style={{ marginBottom: 6 }}>YouTube</p>
        </div>
      </div>
      <div
        className="container"
        style={{
          marginTop: 40,
          paddingTop: 20,
          borderTop: "1px solid #222",
          textAlign: "center",
          fontSize: 11,
          color: "#555",
        }}
      >
        {t("footer.copyright", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
