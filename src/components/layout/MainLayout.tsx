import { Outlet } from "react-router-dom";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      <Header />
      <main style={{ flex: 1, padding: "20px 24px 40px" }}>
        <Outlet />
      </main>
      <footer className="site-footer">
        © {new Date().getFullYear()} Australian Government — Police Enforcement Dashboard
      </footer>
    </div>
  );
}