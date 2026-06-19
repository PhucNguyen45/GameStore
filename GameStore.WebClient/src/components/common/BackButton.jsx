// GameStore.WebClient/src/components/common/BackButton.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ fallback = "/store", label }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className="back-btn"
    >
      <ArrowLeft size={14} />
      {label || "Quay lại"}
    </button>
  );
}
