// GameStore.WebClient/src/components/admin/GameFormModal.jsx
import { useState } from "react";
import { gameAPI } from "../../services/api";
import { inputStyle } from "./adminStyles";

export default function GameFormModal({ game, genres, onClose, onSave }) {
  const [form, setForm] = useState({
    title: game?.title || "",
    description: game?.description || "",
    price: game?.price || 0,
    discountPrice: game?.discountPrice || "",
    developer: game?.developer || "",
    publisher: game?.publisher || "",
    releaseDate: game?.releaseDate
      ? new Date(game.releaseDate).toISOString().split("T")[0]
      : "",
    coverImageUrl: game?.coverImageUrl || "",
    trailerUrl: game?.trailerUrl || "",
    minimumOS: game?.minimumOS || "",
    minimumProcessor: game?.minimumProcessor || "",
    minimumMemory: game?.minimumMemory || "",
    minimumGraphics: game?.minimumGraphics || "",
    minimumStorage: game?.minimumStorage || "",
    genreIds: game?.gameGenres?.map((g) => g.genreId) || [],
  });
  const [saving, setSaving] = useState(false);

  const toggleGenre = (id) => {
    setForm((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(id)
        ? prev.genreIds.filter((gId) => gId !== id)
        : [...prev.genreIds, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        discountPrice: form.discountPrice
          ? parseFloat(form.discountPrice)
          : null,
        releaseDate: form.releaseDate
          ? new Date(form.releaseDate).toISOString()
          : null,
      };
      if (game) await gameAPI.update(game.id, data);
      else await gameAPI.create(data);
      onSave();
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#111118",
          borderRadius: 12,
          padding: 30,
          width: 600,
          maxHeight: "90vh",
          overflow: "auto",
          border: "1px solid #1a1a2e",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: 20,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {game ? "✏️ Edit Game" : "➕ Add New Game"}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <input
              placeholder="Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price *"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={inputStyle}
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Discount Price"
              value={form.discountPrice}
              onChange={(e) =>
                setForm({ ...form, discountPrice: e.target.value })
              }
              style={inputStyle}
            />
            <input
              type="date"
              placeholder="Release Date"
              value={form.releaseDate}
              onChange={(e) =>
                setForm({ ...form, releaseDate: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="Developer"
              value={form.developer}
              onChange={(e) => setForm({ ...form, developer: e.target.value })}
              style={inputStyle}
            />
            <input
              placeholder="Publisher"
              value={form.publisher}
              onChange={(e) => setForm({ ...form, publisher: e.target.value })}
              style={inputStyle}
            />
          </div>
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
          />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <input
              placeholder="Cover Image URL"
              value={form.coverImageUrl}
              onChange={(e) =>
                setForm({ ...form, coverImageUrl: e.target.value })
              }
              style={inputStyle}
            />
            <input
              placeholder="Trailer URL"
              value={form.trailerUrl}
              onChange={(e) => setForm({ ...form, trailerUrl: e.target.value })}
              style={inputStyle}
            />
          </div>
          <fieldset
            style={{
              border: "1px solid #1a1a2e",
              borderRadius: 6,
              padding: 12,
            }}
          >
            <legend style={{ color: "#888", fontSize: 12, padding: "0 8px" }}>
              System Requirements
            </legend>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <input
                placeholder="OS"
                value={form.minimumOS}
                onChange={(e) =>
                  setForm({ ...form, minimumOS: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Processor"
                value={form.minimumProcessor}
                onChange={(e) =>
                  setForm({ ...form, minimumProcessor: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Memory"
                value={form.minimumMemory}
                onChange={(e) =>
                  setForm({ ...form, minimumMemory: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Graphics"
                value={form.minimumGraphics}
                onChange={(e) =>
                  setForm({ ...form, minimumGraphics: e.target.value })
                }
                style={inputStyle}
              />
              <input
                placeholder="Storage"
                value={form.minimumStorage}
                onChange={(e) =>
                  setForm({ ...form, minimumStorage: e.target.value })
                }
                style={{ ...inputStyle, gridColumn: "1 / -1" }}
              />
            </div>
          </fieldset>
          <fieldset
            style={{
              border: "1px solid #1a1a2e",
              borderRadius: 6,
              padding: 12,
            }}
          >
            <legend style={{ color: "#888", fontSize: 12, padding: "0 8px" }}>
              Categories (Genres)
            </legend>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {genres &&
                genres.map((g) => (
                  <label
                    key={g.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      color: "#ccc",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={form.genreIds.includes(g.id)}
                      onChange={() => toggleGenre(g.id)}
                      style={{ accentColor: "var(--accent)" }}
                    />
                    {g.name}
                  </label>
                ))}
            </div>
          </fieldset>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "8px 20px",
                background: "#2a2a2a",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "8px 20px",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {saving ? "Saving..." : game ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
