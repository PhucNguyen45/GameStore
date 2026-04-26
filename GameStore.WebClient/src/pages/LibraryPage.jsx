import { Library } from "lucide-react";
export default function LibraryPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        color: "#6b6b8e",
      }}
    >
      <Library size={48} />
      <h2 style={{ marginTop: 16 }}>My Library</h2>
      <p>Coming soon</p>
    </div>
  );
}
