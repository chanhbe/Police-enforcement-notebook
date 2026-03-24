import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home",       to: "/",      end: true },
  { label: "Breath",     to: "/breath" },
  { label: "Drug tests", to: "/drugs" },
  { label: "Fines",      to: "/fines" },
];

export default function Header() {
  return (
    <header className="main-header">
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 6, flexShrink: 0, overflow: "hidden",
            background: "linear-gradient(135deg,#1d4ed8,#0369a1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: "0.8rem", color: "#fff", letterSpacing: "0.03em",
          }}>AU</div>
          <div>
            <p style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.09em", textTransform: "uppercase" }}>
              Australian Government
            </p>
            <p style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
              Department of Infrastructure, Transport,<br />
              Regional Development, Communications and the Arts
            </p>
          </div>
        </div>

        <h1 style={{ fontWeight: 700, fontSize: "1.4rem", color: "#fff", letterSpacing: "-0.01em" }}>
          Road Safety Enforcement Dashboard
        </h1>

        {/* Decorative */}
        <svg width="100" height="44" style={{ opacity: 0.3 }}>
          <circle cx="88" cy="8" r="5" fill="#34d399" />
          <circle cx="96" cy="34" r="4" fill="#60a5fa" />
          <line x1="88" y1="8" x2="96" y2="34" stroke="#34d399" strokeWidth="1" strokeDasharray="3,3" />
        </svg>
      </div>

      {/* Nav */}
      <nav className="nav-tabs">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-tab${isActive ? " active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}