import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import StorePage from "./pages/StorePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import LibraryPage from "./pages/LibraryPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/library" element={<LibraryPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
