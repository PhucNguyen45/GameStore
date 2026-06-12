// GameStore.WebClient/src/components/games/gameDetailStyles.js
// Epic Games Store inspired button styles for game detail page

const btnBase = {
  padding: "12px 28px",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: 1.5,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  whiteSpace: "nowrap",
  transition: "all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)",
  position: "relative",
  overflow: "hidden",
  userSelect: "none",
  outline: "none",
};

export const epicPrimaryBtn = {
  ...btnBase,
  background: "#fff",
  color: "#000",
  textTransform: "uppercase",
  boxShadow: "0 2px 10px rgba(255,255,255,0.15)",
};

export const epicSecondaryBtn = {
  ...btnBase,
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.6)",
  textTransform: "uppercase",
};

export const epicWishlistBtn = {
  ...btnBase,
  padding: "12px",
  background: "transparent",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.6)",
  borderRadius: 4,
  minWidth: 44,
  justifyContent: "center",
};
