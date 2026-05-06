import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import SortableHeader from "./SortableHeader";
import Pagination from "./Pagination";
import { thStyle, sortFn, filterInputStyle } from "./adminStyles";

export default function GamesTab({
  games, gamesTotal, gamesPage, setGamesPage,
  gamesPageSize, setGamesPageSize, gamesTotalPages,
  gameSearch, setGameSearch, genres,
  gameSort, setGameSort,
  onAdd, onEdit, onDelete,
}) {

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <input
          placeholder="Search by Title or Developer..."
          value={gameSearch.keyword}
          onChange={(e) => setGameSearch({ ...gameSearch, keyword: e.target.value })}
          style={{ ...filterInputStyle, flex: 1, maxWidth: 220 }}
        />
        <select
          value={gameSearch.genreId}
          onChange={(e) => setGameSearch({ ...gameSearch, genreId: e.target.value })}
          style={filterInputStyle}
        >
          <option value="">All Genres</option>
          {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontSize: 12 }}>
          Price: $
          <input
            type="number" min="0" step="1"
            value={gameSearch.minPrice}
            onChange={(e) => setGameSearch({ ...gameSearch, minPrice: e.target.value })}
            style={{ ...filterInputStyle, width: 60 }}
            placeholder="Min"
          />
          - $
          <input
            type="number" min="0" step="1"
            value={gameSearch.maxPrice}
            onChange={(e) => setGameSearch({ ...gameSearch, maxPrice: e.target.value })}
            style={{ ...filterInputStyle, width: 60 }}
            placeholder="Max"
          />
        </div>
        {(gameSearch.keyword || gameSearch.genreId || gameSearch.minPrice || gameSearch.maxPrice) && (
          <button
            onClick={() => setGameSearch({ keyword: "", genreId: "", minPrice: "", maxPrice: "" })}
            style={{
              padding: "7px 12px", background: "#2a2a2a", color: "#fff",
              border: "none", borderRadius: 6, fontSize: 12, cursor: "pointer",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}
          >
            <X size={12} /> Clear
          </button>
        )}
        <button
          onClick={onAdd}
          style={{
            display: "flex", alignItems: "center", gap: 5, padding: "7px 16px",
            background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6,
            fontSize: 12, fontWeight: 600, cursor: "pointer", marginLeft: "auto",
          }}
        >
          <Plus size={14} /> Add Game
        </button>
      </div>
      <div style={{ background: "#111118", borderRadius: 8, border: "1px solid #1a1a2e", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "#0a0a10" }}>
              <SortableHeader field="id" sort={gameSort} setSort={setGameSort}>#</SortableHeader>
              <SortableHeader field="title" sort={gameSort} setSort={setGameSort}>Title</SortableHeader>
              <SortableHeader field="developer" sort={gameSort} setSort={setGameSort}>Developer</SortableHeader>
              <th style={{ ...thStyle, cursor: "default" }}>Categories</th>
              <SortableHeader field="price" sort={gameSort} setSort={setGameSort}>Price</SortableHeader>
              <th style={thStyle}>Sale</th>
              <SortableHeader field="rating" sort={gameSort} setSort={setGameSort}>Rating</SortableHeader>
              <SortableHeader field="totalSales" sort={gameSort} setSort={setGameSort}>Sales</SortableHeader>
              <th style={{ ...thStyle, cursor: "default" }}></th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => (
              <tr key={game.id} style={{ borderBottom: "1px solid #1a1a1a" }}>
                <td style={{ padding: "9px 14px", color: "#555" }}>#{game.id}</td>
                <td style={{ padding: "9px 14px", color: "#fff", fontWeight: 500 }}>{game.title}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{game.developer?.substring(0, 18)}</td>
                <td style={{ padding: "9px 14px" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {game.gameGenres?.slice(0, 3).map(gg => (
                      <span key={gg.genreId} style={{ background: "#2a2a35", padding: "2px 6px", borderRadius: 4, fontSize: 10, color: "#ccc" }}>
                        {gg.genre?.name}
                      </span>
                    ))}
                    {game.gameGenres?.length > 3 && <span style={{ fontSize: 10, color: "#666" }}>+{game.gameGenres.length - 3}</span>}
                  </div>
                </td>
                <td style={{ padding: "9px 14px", color: "#4caf50", fontWeight: 600 }}>${game.price?.toFixed(2)}</td>
                <td style={{ padding: "9px 14px" }}>
                  {game.discountPrice ? (
                    <span style={{ background: "#0078f220", color: "#0078f2", padding: "2px 7px", borderRadius: 8, fontSize: 10, fontWeight: 600 }}>
                      -{Math.round((1 - game.discountPrice / game.price) * 100)}%
                    </span>
                  ) : (<span style={{ color: "#555" }}>-</span>)}
                </td>
                <td style={{ padding: "9px 14px" }}>⭐ {game.rating?.toFixed(1)}</td>
                <td style={{ padding: "9px 14px", color: "#888" }}>{game.totalSales?.toLocaleString()}</td>
                <td style={{ padding: "9px 14px", display: "flex", gap: 5 }}>
                  <button onClick={() => onEdit(game)} style={{ padding: "4px 7px", background: "#1a1a2e", border: "none", borderRadius: 4, cursor: "pointer" }}>
                    <Edit size={11} color="#0078f2" />
                  </button>
                  <button onClick={() => onDelete(game)} style={{ padding: "4px 7px", background: "#1a1a2e", border: "none", borderRadius: 4, cursor: "pointer" }}>
                    <Trash2 size={11} color="#e94560" />
                  </button>
                </td>
              </tr>
            ))}
            {games.length === 0 && (
              <tr><td colSpan="9" style={{ padding: 20, textAlign: "center", color: "#666" }}>No games found</td></tr>
            )}
          </tbody>
        </table>
        <Pagination
          page={gamesPage} totalPages={gamesTotalPages}
          totalItems={gamesTotal} pageSize={gamesPageSize}
          setPage={setGamesPage} setPageSize={setGamesPageSize}
        />
      </div>
    </div>
  );
}
