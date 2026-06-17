// GameStore.WebClient/src/components/layout/MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.25,
};

export default function MainLayout() {
  const location = useLocation();

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={pageTransition}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
