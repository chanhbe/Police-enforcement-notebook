import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f0f2f5" }}>
      {!isHome && <Header />}
      <main style={{ flex: 1, padding: isHome ? 0 : "20px 24px 40px" }}>
        <Outlet />
      </main>
      {!isHome && <Footer />}
    </div>
  );
}