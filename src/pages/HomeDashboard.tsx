import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

/* ── Scroll-reveal hook ────────────────────────────────────────
   Trả về ref + boolean isVisible. Khi element vào viewport,
   isVisible = true và không bao giờ reset lại (one-shot).
──────────────────────────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ── Animated section wrapper ──────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "left" | "right";
}) {
  const { ref, visible } = useReveal();

  const translate = direction === "up"
    ? "translateY(32px)"
    : direction === "left"
    ? "translateX(-32px)"
    : "translateX(32px)";

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : translate,
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Hover button ───────────────────────────────────────────── */
function CTAButton({
  label,
  to,
  primary = false,
  navigate,
}: {
  label: string;
  to: string;
  primary?: boolean;
  navigate: (to: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => navigate(to)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Inter',sans-serif",
        fontSize: "0.88rem",
        fontWeight: 600,
        padding: "11px 26px",
        borderRadius: 8,
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: primary ? "none" : "1px solid rgba(255,255,255,0.25)",
        background: primary
          ? hovered ? "#1d4ed8" : "#2563eb"
          : hovered ? "rgba(255,255,255,0.12)" : "transparent",
        color: "#fff",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered && primary ? "0 8px 20px rgba(37,99,235,0.4)" : "none",
      }}
    >
      {label}
    </button>
  );
}

/* ── Explore card (section 5) ───────────────────────────────── */
function ExploreCard({
  label, desc, to, color, navigate,
}: {
  label: string; desc: string; to: string; color: string; navigate: (t: string) => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={() => navigate(to)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: "'Inter',sans-serif",
        background: hovered ? color : "rgba(255,255,255,0.06)",
        border: `1px solid ${hovered ? color : "rgba(255,255,255,0.15)"}`,
        borderRadius: 12,
        padding: "24px 28px",
        textAlign: "left",
        cursor: "pointer",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 28px ${color}55` : "none",
        flex: "1 1 180px",
      }}
    >
      <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#f1f5f9", marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: "0.78rem", color: hovered ? "rgba(255,255,255,0.85)" : "#94a3b8", lineHeight: 1.5 }}>{desc}</p>
      <p style={{ fontSize: "0.8rem", fontWeight: 600, color: hovered ? "#fff" : "#60a5fa", marginTop: 12 }}>
        Explore →
      </p>
    </button>
  );
}

/* ════════════════════════════════════════════════════════════
   DATA
════════════════════════════════════════════════════════════ */
const insights = [
  {
    number: "01", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe",
    title: "Enforcement is increasing",
    body: "Mobile phone fines have increased significantly since 2012, largely due to automated detection technologies rolled out across major states.",
  },
  {
    number: "02", color: "#059669", bg: "#f0fdf4", border: "#bbf7d0",
    title: "Alcohol testing is widespread, but uneven",
    body: "Random breath testing remains widespread across Australia, but positivity rates vary significantly across states — suggesting different risk profiles and enforcement intensities.",
  },
  {
    number: "03", color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    title: "Drug trends are shifting",
    body: "Drug detection trends show a clear shift from cannabis to methamphetamine over time, reflecting broader changes in substance use patterns on Australian roads.",
  },
];

const datasets = [
  { icon: "🫁", label: "Breath Tests",  desc: "Random breath test volumes and positive rates" },
  { icon: "💊", label: "Drug Tests",    desc: "Roadside drug detection tests by jurisdiction" },
  { icon: "💰", label: "Traffic Fines", desc: "Fines, arrests, and charges issued by state" },
];

const team = [
  { name: "Mai Minh Phuong Anh", id: "104997232" },
  { name: "Nguyen Ba Chanh",     id: "104813299" },
];

/* ════════════════════════════════════════════════════════════
   COMPONENT
════════════════════════════════════════════════════════════ */
export default function HomeDashboard() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column" }}>

      {/* ══════════════════════════════════════════════════
          (1) HERO
      ══════════════════════════════════════════════════ */}
      <section style={{
        background: "linear-gradient(135deg, #0f1e33 0%, #1a2e4a 50%, #1e3a5f 100%)",
        padding: "88px 48px 80px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Deco blobs */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(37,99,235,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -100, left: -60, width: 340, height: 340, borderRadius: "50%", background: "rgba(5,150,105,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "30%", right: "15%", width: 180, height: 180, borderRadius: "50%", background: "rgba(217,119,6,0.05)", pointerEvents: "none" }} />

        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <span style={{
            display: "inline-block", marginBottom: 24,
            fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em",
            textTransform: "uppercase", color: "#60a5fa",
            background: "rgba(37,99,235,0.18)", border: "1px solid rgba(96,165,250,0.3)",
            padding: "5px 16px", borderRadius: 20,
          }}>
            Australia · 2008–2024
          </span>

          <h1 style={{
            fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
            fontWeight: 800, color: "#f1f5f9",
            lineHeight: 1.12, letterSpacing: "-0.03em",
            margin: "0 0 20px",
          }}>
            Road Safety in Australia
          </h1>

          <p style={{
            fontSize: "1.05rem", color: "#94a3b8",
            lineHeight: 1.75, maxWidth: 540,
            margin: "0 auto 40px", fontWeight: 300,
          }}>
            Over{" "}
            <strong style={{ color: "#60a5fa", fontWeight: 600 }}>16 years</strong>{" "}
            of enforcement data reveals a deeper story behind fines, alcohol, and drug use on Australian roads.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          (2) WHY THIS MATTERS
      ══════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "64px 48px", borderBottom: "1px solid #e2e6ed" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#2563eb", marginBottom: 10 }}>
              Why this matters
            </p>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 700, color: "#0f1923", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.25 }}>
              Road safety affects every Australian
            </h2>
            <p style={{ fontSize: "1rem", color: "#4b5a6e", lineHeight: 1.85, maxWidth: 680 }}>
              Road safety is a critical issue affecting millions of Australians every year.
              While enforcement efforts — such as fines, breath testing, and drug detection — have scaled up
              considerably over the past decade, understanding <em>who</em> and <em>why</em> violations occur
              is key to improving policy and saving lives.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 40 }}>
            {[
              { value: "16", unit: "years",    label: "of continuous enforcement data" },
              { value: "3",  unit: "datasets", label: "covering fines, breath & drug tests" },
              { value: "8",  unit: "states",   label: "and territories tracked" },
            ].map(({ value, unit, label }, i) => (
              <Reveal key={unit} delay={i * 100} direction="up">
                <div style={{ textAlign: "center", padding: "24px 16px", background: "#f8f9fb", borderRadius: 10, border: "1px solid #e2e6ed" }}>
                  <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "#1a2e4a", lineHeight: 1, letterSpacing: "-0.03em" }}>
                    {value}<span style={{ fontSize: "1rem", color: "#2563eb", marginLeft: 6 }}>{unit}</span>
                  </p>
                  <p style={{ fontSize: "0.78rem", color: "#8a97a8", marginTop: 8 }}>{label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          (3) DATA SOURCE
      ══════════════════════════════════════════════════ */}
      <section style={{ background: "#f8f9fb", padding: "64px 48px", borderBottom: "1px solid #e2e6ed" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#059669", marginBottom: 10 }}>
              Data source
            </p>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 700, color: "#0f1923", letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.25 }}>
              Official government data
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#4b5a6e", lineHeight: 1.8, marginBottom: 28 }}>
              This project uses official data published by the{" "}
              <strong style={{ color: "#0f1923" }}>Bureau of Infrastructure and Transport Research Economics (BITRE)</strong>,
              covering the period from <strong style={{ color: "#0f1923" }}>2008 to 2024</strong>.
            </p>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {datasets.map(({ icon, label, desc }, i) => (
              <Reveal key={label} delay={i * 100} direction="up">
                <div style={{ background: "#fff", border: "1px solid #e2e6ed", borderRadius: 10, padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <span style={{ fontSize: "1.8rem" }}>{icon}</span>
                  <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f1923", marginTop: 10, marginBottom: 4 }}>{label}</p>
                  <p style={{ fontSize: "0.78rem", color: "#8a97a8", lineHeight: 1.5 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div style={{ marginTop: 20, padding: "12px 16px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span>🔗</span>
              <p style={{ fontSize: "0.8rem", color: "#1d4ed8" }}>
                Source: <strong>BITRE</strong> — Bureau of Infrastructure and Transport Research Economics, Australian Government
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          (4) KEY INSIGHTS
      ══════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "64px 48px", borderBottom: "1px solid #e2e6ed" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#d97706", marginBottom: 10 }}>
              Key insights
            </p>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 700, color: "#0f1923", letterSpacing: "-0.02em", marginBottom: 8, lineHeight: 1.25 }}>
              What the data tells us
            </h2>
            <p style={{ fontSize: "0.9rem", color: "#8a97a8", marginBottom: 36 }}>
              Three patterns emerge across 16 years of road enforcement data.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {insights.map(({ number, title, body, color, bg, border }, i) => (
              <Reveal key={number} delay={i * 120} direction="left">
                <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <span style={{
                    flexShrink: 0, width: 36, height: 36, borderRadius: 8,
                    background: color, color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 800,
                  }}>
                    {number}
                  </span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f1923", marginBottom: 6 }}>{title}</p>
                    <p style={{ fontSize: "0.85rem", color: "#4b5a6e", lineHeight: 1.7 }}>{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          (5) CALL TO ACTION
      ══════════════════════════════════════════════════ */}
      <section style={{ background: "#1a2e4a", padding: "72px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#60a5fa", marginBottom: 12 }}>
              Explore the data
            </p>
            <h2 style={{ fontSize: "1.65rem", fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 12 }}>
              Discover the full story
            </h2>
            <p style={{ fontSize: "0.95rem", color: "#94a3b8", lineHeight: 1.7, maxWidth: 480, margin: "0 auto 40px" }}>
              Explore the dashboards to discover trends across states, jurisdictions, and time periods.
            </p>
          </Reveal>

          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: "Breath Dashboard", to: "/breath", color: "#059669", desc: "Breath test volumes & positive rates" },
              { label: "Drugs Dashboard",  to: "/drugs",  color: "#d97706", desc: "Drug detection trends & shifts" },
              { label: "Fines Dashboard",  to: "/fines",  color: "#2563eb", desc: "Fines, arrests & charges by state" },
            ].map(props => (
              <Reveal key={props.to} delay={100}>
                <ExploreCard {...props} navigate={navigate} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          (6) TEAM
      ══════════════════════════════════════════════════ */}
      <section style={{ background: "#f8f9fb", padding: "48px 48px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8a97a8", marginBottom: 24, textAlign: "center" }}>
              Project team
            </p>
          </Reveal>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {team.map(({ name, id }, i) => (
              <Reveal key={id} delay={i * 100} direction="up">
                <div style={{ background: "#fff", border: "1px solid #e2e6ed", borderRadius: 12, padding: "20px 32px", textAlign: "center", minWidth: 220, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: "linear-gradient(135deg,#2563eb,#059669)",
                    margin: "0 auto 12px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1rem", fontWeight: 700, color: "#fff",
                  }}>
                    {name.split(" ").pop()![0]}
                  </div>
                  <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f1923", marginBottom: 4 }}>{name}</p>
                  <p style={{ fontSize: "0.75rem", color: "#8a97a8" }}>Student ID: {id}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p style={{ textAlign: "center", fontSize: "0.72rem", color: "#b0bac6", marginTop: 36 }}>
              © {new Date().getFullYear()} · Data sourced from BITRE · Australian Government
            </p>
          </Reveal>
        </div>
      </section>

    </div>
  );
}