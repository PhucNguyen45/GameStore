// GameStore.WebClient/src/components/common/Pagination.jsx
import { useState, useMemo, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const btnBase = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 4,
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  transition: "all 0.15s ease",
  userSelect: "none",
  outline: "none",
  whiteSpace: "nowrap",
};

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  setPage,
  setPageSize,
  variant = "admin",
}) {
  const { t } = useTranslation();
  const [showJump, setShowJump] = useState(false);
  const [jumpValue, setJumpValue] = useState("");
  const jumpRef = useRef(null);
  const isStore = variant === "store";

  if (!totalPages || totalPages < 1) totalPages = 1;

  // Clamp page
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  // Sliding window page numbers
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const siblingCount = 1;
    const left = Math.max(2, page - siblingCount);
    const right = Math.min(totalPages - 1, page + siblingCount);

    pages.push(1);

    if (left > 2) pages.push("\u2026");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("\u2026");

    pages.push(totalPages);
    return pages;
  }, [page, totalPages]);

  // Jump to page
  const handleJump = (e) => {
    e.preventDefault();
    const p = parseInt(jumpValue, 10);
    if (p >= 1 && p <= totalPages) {
      setPage(p);
    }
    setShowJump(false);
    setJumpValue("");
  };

  // Ellipsis click → jump ±5
  const handleEllipsisClick = (idx) => {
    const total = totalPages;
    const leftEllipsisIdx = pageNumbers.indexOf("\u2026");
    const rightEllipsisIdx = pageNumbers.lastIndexOf("\u2026");

    if (leftEllipsisIdx === rightEllipsisIdx) {
      if (page <= Math.ceil(total / 2)) {
        setPage(Math.min(page + 5, total - 1));
      } else {
        setPage(Math.max(page - 5, 2));
      }
    } else if (idx === leftEllipsisIdx) {
      setPage(Math.max(page - 5, 2));
    } else if (idx === rightEllipsisIdx) {
      setPage(Math.min(page + 5, total - 1));
    }
  };

  // Close jump input on outside click
  useEffect(() => {
    if (!showJump) return;
    const handleClick = (e) => {
      if (jumpRef.current && !jumpRef.current.contains(e.target)) {
        setShowJump(false);
        setJumpValue("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showJump]);

  // ── Style helpers ──
  const btnSize = isStore
    ? { minWidth: 38, height: 38, fontSize: 13 }
    : { minWidth: 34, height: 34, fontSize: 12 };
  const iconSize = isStore ? 16 : 14;

  // Hover style set (applied via JS on mouse enter)
  const btnHover = {
    background: isStore ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.1)",
    color: "#fff",
    transform: "translateY(-1px)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  };

  // Active (current) page
  const btnActive = {
    background: isStore ? "#e94560" : "var(--accent, #e94560)",
    color: "#fff",
    border: isStore ? "1px solid #e94560" : "1px solid var(--accent, #e94560)",
    boxShadow: isStore
      ? "0 0 20px rgba(233,69,96,0.3)"
      : "0 0 16px rgba(233,69,96,0.25)",
    cursor: "default",
    transform: "none",
  };

  // Disabled style
  const btnDisabled = {
    opacity: 0.3,
    cursor: "not-allowed",
    transform: "none",
    boxShadow: "none",
  };

  // Build normal (default) style for a regular page-number button
  const getNormalStyle = (extras = {}) => ({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    border: isStore ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.15s ease",
    userSelect: "none",
    outline: "none",
    whiteSpace: "nowrap",
    ...btnSize,
    padding: "0 10px",
    background: isStore ? "rgba(255,255,255,0.06)" : "#15152a",
    color: "#bbb",
    transform: "none",
    boxShadow: "none",
    ...extras,
  });

  // ── Unified hover / leave handler for all page-nav buttons ──
  const handleMouseEnter = (e, isDisabled) => {
    if (!isDisabled) Object.assign(e.currentTarget.style, btnHover);
  };
  const handleMouseLeave = (e, isDisabled) => {
    if (!isDisabled) {
      // Reset button to its baseline (remove transform, boxShadow etc.)
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.background = isStore
        ? "rgba(255,255,255,0.06)"
        : "#15152a";
      e.currentTarget.style.color = "#bbb";
    }
  };
  const handleFocus = (e, isDisabled) => {
    if (!isDisabled)
      e.currentTarget.style.boxShadow = "0 0 0 2px rgba(233,69,96,0.4)";
  };
  const handleBlur = (e, isDisabled) => {
    if (!isDisabled) e.currentTarget.style.boxShadow = "none";
  };

  return (
    <nav aria-label="Pagination Navigation">
      <div
        style={{
          display: "flex",
          flexDirection: isStore ? "column" : "row",
          justifyContent: isStore ? "center" : "space-between",
          alignItems: "center",
          gap: 12,
          padding: isStore ? "16px 0" : "14px 16px",
          borderTop: isStore ? "none" : "1px solid rgba(255,255,255,0.05)",
          background: isStore ? "transparent" : "rgba(0,0,0,0.2)",
          flexWrap: "wrap",
        }}
      >
        {/* ── LEFT: Info + page size (admin only) ── */}
        {!isStore && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              color: "#777",
              fontSize: 12,
              flexWrap: "wrap",
            }}
          >
            <span>
              {totalItems > 0 ? (
                <>
                  {t("pagination.showing")}{" "}
                  <strong style={{ color: "#ccc", fontWeight: 700 }}>
                    {(page - 1) * pageSize + 1}
                  </strong>
                  {" \u2013 "}
                  <strong style={{ color: "#ccc", fontWeight: 700 }}>
                    {Math.min(page * pageSize, totalItems)}
                  </strong>{" "}
                  {t("pagination.of")}{" "}
                  <strong style={{ color: "#ccc", fontWeight: 700 }}>
                    {totalItems}
                  </strong>
                </>
              ) : (
                <>{t("pagination.noData")}</>
              )}
            </span>

            {setPageSize && (
              <label
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#666",
                }}
              >
                <span style={{ color: "#555" }}>|</span>
                {t("pagination.perPage")}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  style={{
                    padding: "4px 28px 4px 10px",
                    background: "#0d0d1a",
                    color: "#ccc",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 6,
                    fontSize: 12,
                    outline: "none",
                    cursor: "pointer",
                    appearance: "none",
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 8px center",
                  }}
                >
                  {[10, 20, 50, 100].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>
        )}

        {/* ── RIGHT: Page buttons ── */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 4 }}
          role="group"
          aria-label="Page navigation buttons"
        >
          {/* First page */}
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            aria-label="Go to first page"
            style={getNormalStyle({
              minWidth: isStore ? 38 : 32,
              height: isStore ? 38 : 32,
              padding: 0,
              ...(page === 1 ? btnDisabled : {}),
            })}
            onMouseEnter={(e) => handleMouseEnter(e, page === 1)}
            onMouseLeave={(e) => handleMouseLeave(e, page === 1)}
            onFocus={(e) => handleFocus(e, page === 1)}
            onBlur={(e) => handleBlur(e, page === 1)}
          >
            <ChevronsLeft size={iconSize - 2} />
          </button>

          {/* Previous */}
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Go to previous page"
            style={getNormalStyle({
              minWidth: isStore ? 38 : 32,
              height: isStore ? 38 : 32,
              padding: 0,
              marginRight: 4,
              ...(page === 1 ? btnDisabled : {}),
            })}
            onMouseEnter={(e) => handleMouseEnter(e, page === 1)}
            onMouseLeave={(e) => handleMouseLeave(e, page === 1)}
            onFocus={(e) => handleFocus(e, page === 1)}
            onBlur={(e) => handleBlur(e, page === 1)}
          >
            <ChevronLeft size={iconSize} />
          </button>

          {/* Page numbers / ellipsis */}
          {pageNumbers.map((p, idx) =>
            p === "\u2026" ? (
              <button
                key={`e-${idx}`}
                onClick={() => handleEllipsisClick(idx)}
                aria-label="Jump 5 pages"
                title="Jump 5 pages"
                style={{
                  ...btnBase,
                  ...btnSize,
                  minWidth: isStore ? 38 : 32,
                  height: isStore ? 38 : 32,
                  padding: "0 4px",
                  background: "transparent",
                  color: "#555",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 400,
                  letterSpacing: 2,
                  transition: "all 0.15s",
                  borderRadius: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#888";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#555";
                }}
              >
                {"\u2026"}
              </button>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                aria-current={p === page ? "page" : undefined}
                aria-label={`Page ${p}`}
                style={{
                  ...btnBase,
                  ...btnSize,
                  minWidth: isStore ? 38 : 34,
                  height: isStore ? 38 : 34,
                  padding: 0,
                  ...(p === page ? btnActive : getNormalStyle()),
                  fontWeight: p === page ? 700 : 500,
                }}
                onMouseEnter={(e) => {
                  if (p !== page) Object.assign(e.currentTarget.style, btnHover);
                }}
                onMouseLeave={(e) => {
                  if (p !== page) {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.background = isStore
                      ? "rgba(255,255,255,0.06)"
                      : "#15152a";
                    e.currentTarget.style.color = "#bbb";
                  }
                }}
                onFocus={(e) => {
                  if (p !== page)
                    e.currentTarget.style.boxShadow = "0 0 0 2px rgba(233,69,96,0.4)";
                }}
                onBlur={(e) => {
                  if (p !== page) e.currentTarget.style.boxShadow = "none";
                }}
              >
                {p}
              </button>
            ),
          )}

          {/* Next */}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Go to next page"
            style={getNormalStyle({
              minWidth: isStore ? 38 : 32,
              height: isStore ? 38 : 32,
              padding: 0,
              marginLeft: 4,
              ...(page === totalPages ? btnDisabled : {}),
            })}
            onMouseEnter={(e) => handleMouseEnter(e, page === totalPages)}
            onMouseLeave={(e) => handleMouseLeave(e, page === totalPages)}
            onFocus={(e) => handleFocus(e, page === totalPages)}
            onBlur={(e) => handleBlur(e, page === totalPages)}
          >
            <ChevronRight size={iconSize} />
          </button>

          {/* Last page */}
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            aria-label="Go to last page"
            style={getNormalStyle({
              minWidth: isStore ? 38 : 32,
              height: isStore ? 38 : 32,
              padding: 0,
              ...(page === totalPages ? btnDisabled : {}),
            })}
            onMouseEnter={(e) => handleMouseEnter(e, page === totalPages)}
            onMouseLeave={(e) => handleMouseLeave(e, page === totalPages)}
            onFocus={(e) => handleFocus(e, page === totalPages)}
            onBlur={(e) => handleBlur(e, page === totalPages)}
          >
            <ChevronsRight size={iconSize - 2} />
          </button>

          {/* ── Jump to page (shown when many pages) ── */}
          {totalPages > 7 && (
            <div ref={jumpRef} style={{ position: "relative", marginLeft: 8 }}>
              {showJump ? (
                <form
                  onSubmit={handleJump}
                  style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                >
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={jumpValue}
                    onChange={(e) => setJumpValue(e.target.value)}
                    autoFocus
                    placeholder="Page"
                    aria-label="Enter page number to jump to"
                    style={{
                      width: 56,
                      padding: "4px 8px",
                      background: "#0d0d1a",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 6,
                      fontSize: 12,
                      outline: "none",
                      textAlign: "center",
                      transition: "border-color 0.15s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent, #e94560)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.15)";
                    }}
                  />
                  <button
                    type="submit"
                    aria-label="Go to page"
                    style={{
                      ...btnBase,
                      ...btnSize,
                      minWidth: 30,
                      height: isStore ? 36 : 30,
                      padding: "0 8px",
                      background: "var(--accent, #e94560)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 12,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.85";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    <ArrowRight size={12} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowJump(true)}
                  aria-label="Jump to specific page"
                  title="Jump to page"
                  style={{
                    ...btnBase,
                    ...btnSize,
                    minWidth: isStore ? 38 : 32,
                    height: isStore ? 38 : 32,
                    padding: "0 6px",
                    background: "transparent",
                    color: "#555",
                    border: "1px dashed rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.color = "#888";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.color = "#555";
                  }}
                >
                  Go
                </button>
              )}
            </div>
          )}
        </div>


      </div>
    </nav>
  );
}
