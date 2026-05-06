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
}) {
  if (!totalPages || totalPages < 1) totalPages = 1;

  // Compute page numbers with ellipsis (max 5 visible numbers)
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      if (end - start < maxVisible - 1)
        start = Math.max(1, end - maxVisible + 1);
      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  }, [page, totalPages]);

  const from = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, totalItems);

  const btnBase = {
    minWidth: 30,
    height: 30,
    padding: "0 8px",
    background: "#1a1a2e",
    color: "#fff",
    border: "1px solid #1a1a2e",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 12,
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
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
        padding: "12px 14px",
        borderTop: "1px solid #1a1a2e",
        background: "#0d0d14",
      }}
    >
      {/* Left: info + page size */}
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
              Showing <strong style={{ color: "#fff" }}>{from}</strong>–
              <strong style={{ color: "#fff" }}>{to}</strong> of{" "}
              <strong style={{ color: "#fff" }}>{totalItems}</strong>
            </>
          ) : (
            <>No records</>
          )}
        </span>
        {setPageSize && (
          <>
            <span style={{ color: "#444" }}>|</span>
            <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
              Rows per page:
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

      {/* Right: page controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={() => setPage(1)}
          disabled={page === 1}
          style={{ ...btnBase, ...(page === 1 ? disabledStyle : {}) }}
          title="First page"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{ ...btnBase, ...(page === 1 ? disabledStyle : {}) }}
          title="Previous page"
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
          title="Next page"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          style={{ ...btnBase, ...(page === totalPages ? disabledStyle : {}) }}
          title="Last page"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
