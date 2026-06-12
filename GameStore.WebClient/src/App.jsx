// GameStore.WebClient/src/App.jsx
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import MainLayout from "./components/layout/MainLayout";
import StorePage from "./pages/StorePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CartPage from "./pages/CartPage";
import LibraryPage from "./pages/LibraryPage";
import AdminPage from "./pages/AdminPage";
import GameDetailPage from "./pages/GameDetailPage";
import PaymentPage from "./pages/PaymentPage";
import InvoicePage from "./pages/InvoicePage";
import WishlistPage from "./pages/WishlistPage";
import PurchaseHistoryPage from "./pages/PurchaseHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

export default function App() {
  const location = useLocation();

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#16162a",
            color: "#fff",
            border: "1px solid #2a2a4a",
            borderRadius: 10,
            fontSize: 14,
            padding: "12px 18px",
            minWidth: 280,
            maxWidth: 420,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          },
          success: {
            iconTheme: { primary: "#4caf50", secondary: "#fff" },
            style: {
              border: "1px solid rgba(76,175,80,0.3)",
              background: "linear-gradient(135deg, #16162a 0%, #1a2e1a 100%)",
            },
          },
          error: {
            iconTheme: { primary: "#e94560", secondary: "#fff" },
            style: {
              border: "1px solid rgba(233,69,96,0.3)",
              background: "linear-gradient(135deg, #16162a 0%, #2e1a1a 100%)",
            },
          },
          loading: {
            style: {
              border: "1px solid rgba(255,255,255,0.1)",
              background: "linear-gradient(135deg, #16162a 0%, #1a1a2e 100%)",
            },
          },
        }}
      />
      <AuthProvider>
        <ErrorBoundary>
          <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/store" replace />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/library" element={<LibraryPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/game/:id" element={<GameDetailPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/invoice/:id" element={<InvoicePage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/orders" element={<PurchaseHistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Route>
          </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </AuthProvider>
    </>
  );
}
