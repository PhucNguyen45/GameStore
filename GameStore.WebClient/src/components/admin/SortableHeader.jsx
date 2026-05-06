// GameStore.WebClient/src/components/admin/SortableHeader.jsx
import { ArrowUp, ArrowDown } from "lucide-react";
import { thStyle, toggleSort } from "./adminStyles";

function SortIcon({ field, current }) {
  if (field !== current.field) return null;
  return current.dir === "asc" ? (
    <ArrowUp size={10} color="var(--accent)" />
  ) : (
    <ArrowDown size={10} color="var(--accent)" />
  );
}

export default function SortableHeader({ field, sort, setSort, children }) {
  return (
    <th
      onClick={() => toggleSort(field, sort, setSort)}
      style={{ ...thStyle, color: sort.field === field ? "#fff" : "#888" }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {children} <SortIcon field={field} current={sort} />
      </span>
    </th>
  );
}
