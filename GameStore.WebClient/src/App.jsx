// GameStore.WebClient/src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import LibraryPage from "./pages/LibraryPage";
import AdminPage from "./pages/AdminPage";
import GameDetailPage from "./pages/GameDetailPage";

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#16162a",
            color: "#fff",
            border: "1px solid #2a2a4a",
            borderRadius: 10,
            fontSize: 14,
          },
          success: { iconTheme: { primary: "#4caf50", secondary: "#fff" } },
          error: { iconTheme: { primary: "#e94560", secondary: "#fff" } },
        }}
      />
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/game/:id" element={<GameDetailPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}
