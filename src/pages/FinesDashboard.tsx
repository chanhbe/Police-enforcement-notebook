import { useMemo } from "react";
import finesData from "../data/clean/fines.json";
import BarChart from "../components/charts/BarChart";
import MultiLineChart from "../components/charts/MultiLineChart";
import HorizontalBar from "../components/charts/HorizontalBar";
import { useFilter } from "../hooks/useFilter";
import { FinesData } from "../types/fines";

const typedFinesData: FinesData[] = finesData as FinesData[];

const MAX_YEAR   = Math.max(...typedFinesData.map(d => d.year));
const ALL_YEARS  = Array.from(new Set(typedFinesData.map(d => d.year))).sort();
const ALL_STATES = ["All", ...Array.from(new Set(typedFinesData.map(d => d.jurisdiction))).sort()];

export default function FinesDashboard() {
  const { year, setYear, state, setState } = useFilter();
  const activeYear = ALL_YEARS.includes(year) ? year : MAX_YEAR;

  // Stat cards — chỉ năm được chọn
  const statsData = useMemo(() =>
    typedFinesData.filter(d =>
      d.year === activeYear &&
      (state === "All" || d.jurisdiction === state)
    ), [activeYear, state]);

  const totalFines   = statsData.reduce((s, d) => s + (d.fines   ?? 0), 0);
  const totalArrests = statsData.reduce((s, d) => s + (d.arrests ?? 0), 0);
  const totalCharges = statsData.reduce((s, d) => s + (d.charges ?? 0), 0);

  // Aggregate by year — cho BarChart và MultiLineChart
  const yearlyData = useMemo(() => {
    const allData = typedFinesData.filter(d =>
      state === "All" || d.jurisdiction === state
    );
    const map: Record<number, { year: number; fines: number; arrests: number; charges: number }> = {};
    allData.forEach(d => {
      if (!map[d.year]) map[d.year] = { year: d.year, fines: 0, arrests: 0, charges: 0 };
      map[d.year].fines   += d.fines   ?? 0;
      map[d.year].arrests += d.arrests ?? 0;
      map[d.year].charges += d.charges ?? 0;
    });
    return Object.values(map).sort((a, b) => a.year - b.year);
  }, [state]);

  // HorizontalBar — fines per jurisdiction, năm chọn
  const barData = useMemo(() =>
    typedFinesData
      .filter(d => d.year === activeYear)
      .map(d => ({ label: d.jurisdiction, value: d.fines ?? 0 }))
      .sort((a, b) => b.value - a.value),
    [activeYear]);

  const card: React.CSSProperties = {
    background: "#fff",
    border: "1px solid #e2e6ed",
    borderRadius: 10,
    padding: "16px 20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  };

  return (
    <div style={{ fontFamily: "'Inter',sans-serif", display: "flex", flexDirection: "column", gap: 14 }}>

      {/* ── Filter bar ──────────────────────────────────────── */}
      <div style={{ ...card, display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8a97a8" }}>
            Select jurisdiction
          </label>
          <select
            value={state} onChange={e => setState(e.target.value)}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", background: "#f8f9fb", border: "1px solid #e2e6ed", borderRadius: 6, color: "#0f1923", padding: "7px 10px", minWidth: 180, outline: "none", cursor: "pointer" }}
          >
            {ALL_STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label style={{ fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "#8a97a8" }}>
            Select year
          </label>
          <select
            value={activeYear} onChange={e => setYear(Number(e.target.value))}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", background: "#f8f9fb", border: "1px solid #e2e6ed", borderRadius: 6, color: "#0f1923", padding: "7px 10px", minWidth: 120, outline: "none", cursor: "pointer" }}
          >
            {ALL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        <button
          onClick={() => { setState("All"); setYear(MAX_YEAR); }}
          style={{ marginLeft: "auto", fontFamily: "'Inter',sans-serif", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "7px 18px", borderRadius: 6, border: "1px solid #e2e6ed", background: "#fff", color: "#4b5a6e", cursor: "pointer" }}
        >
          Reset View
        </button>
      </div>

      {/* ── Row 1: Stats sidebar + BarChart ─────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14 }}>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          {/* Main number — Total Fines */}
          <div style={{ ...card }}>
            <p style={{ fontSize: "1.9rem", fontWeight: 700, color: "#0f1923", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {totalFines.toLocaleString()}
            </p>
            <p style={{ fontSize: "0.78rem", color: "#4b5a6e", marginTop: 6 }}>
              Total fines issued, {activeYear}
            </p>
          </div>

          {/* Amber accent — arrests */}
          <div style={{ background: "#92400e", border: "none", borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              {totalArrests.toLocaleString()}
            </p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              Arrests
            </p>
          </div>

          {/* Charges */}
          <div style={{
            background: "#f8f9fb", border: "1px solid #e2e6ed", borderRadius: 8,
            padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: "0.8rem", color: "#4b5a6e" }}>Charges</span>
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f1923" }}>{totalCharges.toLocaleString()}</span>
          </div>

          {/* YoY change placeholder */}
          {yearlyData.length >= 2 && (() => {
            const prev = yearlyData[yearlyData.length - 2];
            const curr = yearlyData[yearlyData.length - 1];
            const pct  = prev.fines > 0 ? ((curr.fines - prev.fines) / prev.fines * 100) : 0;
            const up   = pct >= 0;
            return (
              <div style={{
                background: up ? "#f0fdf4" : "#fff1f2",
                border: `1px solid ${up ? "#bbf7d0" : "#fecdd3"}`,
                borderRadius: 8, padding: "8px 14px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: "0.78rem", color: "#4b5a6e" }}>YoY fines</span>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: up ? "#059669" : "#dc2626" }}>
                  {up ? "▲" : "▼"} {Math.abs(pct).toFixed(1)}%
                </span>
              </div>
            );
          })()}
        </div>

        {/* BarChart — fines trend */}
        <div style={{ ...card }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f1923", marginBottom: 14 }}>
            Fines trend over time
          </p>
          <BarChart data={yearlyData} dataKey="fines" />
        </div>
      </div>

      {/* ── Row 2: MultiLine + HorizontalBar ────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        <div style={{ ...card }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f1923", marginBottom: 14 }}>
            Fines vs Arrests vs Charges over time
          </p>
          <MultiLineChart data={yearlyData} keys={["fines", "arrests", "charges"]} />
        </div>

        <div style={{ ...card }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f1923", marginBottom: 14 }}>
            Fines per jurisdiction, {activeYear}
          </p>
          <HorizontalBar data={barData} />
        </div>
      </div>

    </div>
  );
}