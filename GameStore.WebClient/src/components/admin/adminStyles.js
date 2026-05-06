// Shared styles and sort utilities for admin components

export const thStyle = {
  textAlign: "left", padding: "12px 14px", color: "#888",
  textTransform: "uppercase", fontSize: 10, fontWeight: 700, letterSpacing: 1,
  borderBottom: "2px solid #1a1a2e", cursor: "pointer", userSelect: "none",
  transition: "color 0.2s",
};

export const inputStyle = {
  width: "100%", padding: "8px 12px", background: "#0a0a10",
  border: "1px solid #1a1a2e", borderRadius: 6, color: "#fff",
  fontSize: 13, outline: "none",
};

export const filterInputStyle = {
  padding: "7px 12px", background: "#111118", border: "1px solid #1a1a2e",
  borderRadius: 6, color: "#fff", fontSize: 12, outline: "none",
};

export const sortFn = (data, field, dir) =>
  [...data].sort((a, b) => {
    let va = a[field], vb = b[field];
    if (typeof va === "string") va = va.toLowerCase();
    if (typeof vb === "string") vb = vb.toLowerCase();
    if (va == null) return 1;
    if (vb == null) return -1;
    return dir === "asc" ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });

export const toggleSort = (field, current, setter) =>
  setter({ field, dir: current.field === field && current.dir === "asc" ? "desc" : "asc" });

export const actionBtnStyle = {
  background: "none", border: "none", cursor: "pointer",
  padding: 4, borderRadius: 4, display: "inline-flex",
  alignItems: "center", justifyContent: "center"
};
