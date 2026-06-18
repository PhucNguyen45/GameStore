// Format số VND với dấu phân cách hàng nghìn (.)
// Ví dụ: 34990 → "34.990₫", 9999000 → "9.999.000₫"

export function formatVND(value) {
  const num = Number(value || 0);
  if (isNaN(num)) return "0₫";
  return `${num.toLocaleString("vi-VN")}₫`;
}

export function formatVNDRaw(value) {
  const num = Number(value || 0);
  if (isNaN(num)) return "0";
  return num.toLocaleString("vi-VN");
}
