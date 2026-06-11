// GameStore.WebClient/src/components/admin/Pagination.jsx
import { useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  setPage,
  setPageSize,
  variant = "admin",
}) {
  if (!totalPages || totalPages < 1) totalPages = 1;

  // Page numbers: always show first 2, ellipsis, last 2
  // e.g. 1 2 ... 8 9  (for 9+ pages)
  //      1 2 3 4     (for ≤4 pages)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [];
    const siblingCount = 1; // number of siblings on each side
    const left = Math.max(2, page - siblingCount);
    const right = Math.min(totalPages - 1, page + siblingCount);

    // Always show first page
    pages.push(1);

    // Ellipsis after first page if gap > 1
    if (left > 2) {
      pages.push("...");
    }

    // Sibling pages around current page
    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    // Ellipsis before last page if gap > 1
    if (right < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [page, totalPages]);

  const isStore = variant === "store";
  const from = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, totalItems);

  const btnSize = isStore ? { minWidth: 34, height: 34, fontSize: 13 } : { minWidth: 30, height: 30, fontSize: 12 };
  const btnBase = {
    ...btnSize,
    padding: "0 8px",
    background: "#1a1a2e",
    color: "#fff",
    border: "1px solid #1a1a2e",
    borderRadius: 6,
    cursor: "pointer",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
  };
  const disabledStyle = { opacity: 0.4, cursor: "not-allowed" };
  const activeStyle = {
    background: "var(--accent)",
    border: "1px solid var(--accent)",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isStore ? "center" : "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        padding: isStore ? "12px 0" : "12px 14px",
        borderTop: isStore ? "none" : "1px solid #1a1a2e",
        background: isStore ? "transparent" : "#0d0d14",
      }}
    >
      {/* Left: info + page size (hidden in store variant) */}
      {!isStore && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#888",
            fontSize: 12,
          }}
        >
          <span>
            {totalItems > 0 ? (
              <>
                Hiển thị <strong style={{ color: "#fff" }}>{from}</strong>–
                <strong style={{ color: "#fff" }}>{to}</strong> trong{" "}
                <strong style={{ color: "#fff" }}>{totalItems}</strong>
              </>
            ) : (
              <>Không có dữ liệu</>
            )}
          </span>
          {setPageSize && (
            <>
              <span style={{ color: "#444" }}>|</span>
              <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                Hàng mỗi trang:
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    padding: "4px 8px",
                    background: "#111118",
                    color: "#fff",
                    border: "1px solid #1a1a2e",
                    borderRadius: 4,
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  {[10, 20, 50, 100].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}
        </div>
      )}

      {/* Right: page controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          style={{ ...btnBase, ...(page === 1 ? disabledStyle : {}) }}
          title="Trang đầu"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ ...btnBase, ...(page === 1 ? disabledStyle : {}) }}
          title="Trang trước"
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span key={`e-${idx}`} style={{ color: "#666", padding: "0 4px" }}>
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{ ...btnBase, ...(p === page ? activeStyle : {}) }}
            >
              {p}
            </button>
          ),
        )}

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{ ...btnBase, ...(page === totalPages ? disabledStyle : {}) }}
          title="Trang tiếp"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          style={{ ...btnBase, ...(page === totalPages ? disabledStyle : {}) }}
          title="Trang cuối"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
