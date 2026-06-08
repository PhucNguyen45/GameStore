// GameStore.WebClient/src/components/common/LanguageSwitcher.jsx
import { useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "vi", label: "VN", full: "Tiếng Việt" },
  { code: "en", label: "EN", full: "English" },
];

export default function LanguageSwitcher({ variant = "icon" }) {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const [animCode, setAnimCode] = useState(null);
  const animTimer = useRef(null);

  const switchLang = useCallback(
    (code) => {
      if (code === current) return;
      // Trigger CSS pulse animation on button
      setAnimCode(code);
      if (animTimer.current) clearTimeout(animTimer.current);
      animTimer.current = setTimeout(() => {
        i18n.changeLanguage(code);
        localStorage.setItem("i18nextLng", code);
        setAnimCode(null);
      }, 200);
    },
    [current, i18n]
  );

  const currentLang = languages.find((l) => l.code === current) || languages[0];

  // Pill/button shared styles
  const btnBase = {
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    letterSpacing: 0.5,
    overflow: "hidden",
    transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
  };

  if (variant === "full") {
    return (
      <div style={{ display: "flex", gap: 6 }}>
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLang(lang.code)}
            style={{
              ...btnBase,
              padding: "5px 12px",
              borderRadius: 6,
              fontSize: 12,
              background: current === lang.code ? "var(--accent)" : "#2a2a2a",
              color: current === lang.code ? "#fff" : "#888",
              transform:
                animCode === lang.code
                  ? "scale(0.92)"
                  : current === lang.code
                    ? "scale(1.05)"
                    : "scale(1)",
              boxShadow:
                current === lang.code
                  ? "0 0 12px rgba(0,120,242,0.3)"
                  : "none",
            }}
            title={lang.full}
            onMouseEnter={(e) => {
              if (current !== lang.code && animCode !== lang.code) {
                e.currentTarget.style.background = "#333";
                e.currentTarget.style.transform = "scale(1.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (current !== lang.code) {
                e.currentTarget.style.background = "#2a2a2a";
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        background: "#222",
        borderRadius: 8,
        padding: 3,
      }}
    >
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLang(lang.code)}
          style={{
            ...btnBase,
            padding: "3px 7px",
            borderRadius: 5,
            fontSize: 10,
            background:
              current === lang.code ? "var(--accent)" : "transparent",
            color: current === lang.code ? "#fff" : "#666",
            transform:
              animCode === lang.code
                ? "scale(0.92)"
                : current === lang.code
                  ? "scale(1.08)"
                  : "scale(1)",
            boxShadow:
              current === lang.code
                ? "0 0 8px rgba(0,120,242,0.25)"
                : "none",
          }}
          title={lang.full}
          onMouseEnter={(e) => {
            if (current !== lang.code && animCode !== lang.code) {
              e.currentTarget.style.background = "#2a2a2a";
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.color = "#aaa";
            }
          }}
          onMouseLeave={(e) => {
            if (current !== lang.code) {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.color = "#666";
            }
          }}
        >
          {lang.label}
        </button>
      ))}

      {/* Smooth crossfade language name */}
      <div
        style={{
          position: "relative",
          width: 52,
          height: 14,
          marginLeft: 2,
          overflow: "hidden",
        }}
      >
        <span
          key={current}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: 9,
            color: "#888",
            fontWeight: 500,
            whiteSpace: "nowrap",
            animation: "langFadeIn 0.3s ease-out",
          }}
        >
          {currentLang.full}
        </span>
      </div>
    </div>
  );
}
