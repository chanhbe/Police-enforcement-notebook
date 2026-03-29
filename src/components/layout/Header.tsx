import { NavLink, useLocation } from "react-router-dom";

const NAV = [
  { label: "Home",       to: "/",       end: true  },
  { label: "Breath",     to: "/breath", end: false },
  { label: "Drug tests", to: "/drugs",  end: false },
  { label: "Fines",      to: "/fines",  end: false },
];

const TITLES: Record<string, string> = {
  "/":       "Road Safety in Australia",
  "/breath": "Random breath tests",
  "/drugs":  "Drug tests",
  "/fines":  "Traffic fines",
};

export default function Header() {
  const { pathname } = useLocation();
  const title = TITLES[pathname] ?? "Road Safety in Australia";

  return (
    <header style={{ background: "#1a2e4a" }}>
      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
      }}>
        {/* Gov logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 6, flexShrink: 0,
            background: "linear-gradient(135deg,#2563eb,#059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "0.7rem", fontWeight: 700, color: "#fff", letterSpacing: "0.05em",
          }}>AU</div>
          <div>
            <p style={{ fontSize: "0.62rem", color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Australian Government
            </p>
            <p style={{ fontSize: "0.68rem", color: "#cbd5e1", lineHeight: 1.4 }}>
              Department of Infrastructure, Transport,<br />
              Regional Development, Communications and the Arts
            </p>
          </div>
        </div>

        {/* Dynamic page title — centered */}
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 700, fontSize: "1.25rem",
          color: "#f1f5f9", letterSpacing: "-0.02em",
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          whiteSpace: "nowrap",
        }}>
          {title}
        </h1>
      </div>

      {/* Nav tabs */}
      <nav style={{ display: "flex", gap: 4, padding: "8px 24px" }}>
        {NAV.map(({ label, to, end }) => (
          <NavLink
            key={to} to={to} end={end}
            style={({ isActive }) => ({
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.82rem", fontWeight: 500,
              padding: "5px 16px", borderRadius: 6,
              textDecoration: "none",
              transition: "all 0.15s",
              border: "1px solid transparent",
              background: isActive ? "#2563eb" : "transparent",
              color: isActive ? "#fff" : "#94a3b8",
              borderColor: isActive ? "#2563eb" : "rgba(255,255,255,0.1)",
            })}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}