import { useMemo } from "react";
import drugsData from "../data/clean/drugs.json";
import ComboChart from "../components/charts/ComboChart";
import MultiLineChart from "../components/charts/MultiLineChart";
import HorizontalBar from "../components/charts/HorizontalBar";
import { useFilter } from "../hooks/useFilter";
import { DrugsData } from "../types/drugs";

const typedDrugsData: DrugsData[] = drugsData as DrugsData[];

const MAX_YEAR   = Math.max(...typedDrugsData.map(d => d.year));
const ALL_YEARS  = Array.from(new Set(typedDrugsData.map(d => d.year))).sort();
const ALL_STATES = ["All", ...Array.from(new Set(typedDrugsData.map(d => d.jurisdiction))).sort()];

export default function DrugsDashboard() {
  const { year, setYear, state, setState } = useFilter();
  const activeYear = ALL_YEARS.includes(year) ? year : MAX_YEAR;

  // Tất cả data theo state — cho charts xu hướng
  const allFiltered = useMemo(() =>
    typedDrugsData.filter(d => state === "All" || d.jurisdiction === state),
    [state]);

  // Chỉ năm được chọn — cho stat cards
  const statsData = useMemo(() =>
    typedDrugsData.filter(d =>
      d.year === activeYear &&
      (state === "All" || d.jurisdiction === state)
    ), [activeYear, state]);

  const totalPositive = statsData.reduce((s, d) => s + (d.positive_drug_tests ?? 0), 0);
  const totalFines    = statsData.reduce((s, d) => s + (d.fines    ?? 0), 0);
  const totalArrests  = statsData.reduce((s, d) => s + (d.arrests  ?? 0), 0);
  const totalCharges  = statsData.reduce((s, d) => s + (d.charges  ?? 0), 0);
  const totalTests    = statsData.reduce((s, d) => s + (d.drug_tests_total ?? d.positive_drug_tests ?? 0), 0);
  const positivityPct = totalTests > 0
    ? (totalPositive / totalTests * 100).toFixed(1)
    : "—";

  // MultiLineChart: positive drug tests per jurisdiction qua các năm
  const lineData = useMemo(() => {
    const byYear: Record<number, Record<string, number>> = {};
    typedDrugsData.forEach(d => {
      if (!byYear[d.year]) byYear[d.year] = {};
      byYear[d.year][d.jurisdiction] = d.positive_drug_tests ?? 0;
    });
    return Object.entries(byYear)
      .map(([yr, vals]) => ({ year: Number(yr), ...vals }))
      .sort((a, b) => a.year - b.year);
  }, []);

  const lineKeys = state === "All"
    ? Array.from(new Set(typedDrugsData.map(d => d.jurisdiction))).sort()
    : [state];

  // HorizontalBar: positive tests per jurisdiction, năm chọn
  const barData = useMemo(() =>
    typedDrugsData
      .filter(d => d.year === activeYear)
      .map(d => ({ label: d.jurisdiction, value: d.positive_drug_tests ?? 0 }))
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

      {/* ── Row 1: Stats + ComboChart ────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 14 }}>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

          <div style={{ ...card }}>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "#0f1923", lineHeight: 1, letterSpacing: "-0.02em" }}>
              {totalPositive.toLocaleString()}
            </p>
            <p style={{ fontSize: "0.78rem", color: "#4b5a6e", marginTop: 6 }}>
              Positive drug tests, {activeYear}
            </p>
          </div>

          {/* Green accent — positivity rate */}
          <div style={{ background: "#065f46", border: "none", borderRadius: 10, padding: "14px 18px" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>
              {positivityPct}{positivityPct !== "—" ? "%" : ""}
            </p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
              Positive rate
            </p>
          </div>

          {([
            { label: "Fines",   value: totalFines,   color: "#d97706" },
            { label: "Arrests", value: totalArrests, color: "#dc2626" },
            { label: "Charges", value: totalCharges, color: "#0f1923" },
          ] as { label: string; value: number; color: string }[]).map(({ label, value, color }) => (
            <div key={label} style={{
              background: "#f8f9fb", border: "1px solid #e2e6ed", borderRadius: 8,
              padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: "0.8rem", color: "#4b5a6e" }}>{label}</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 700, color }}>{value.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* ComboChart */}
        <div style={{ ...card }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f1923", marginBottom: 14 }}>
            Drug tests conducted vs positive results
          </p>
          <ComboChart data={allFiltered} valueKey="positive_drug_tests" />
        </div>
      </div>

      {/* ── Row 2: MultiLine + HorizontalBar ────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={{ ...card }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f1923", marginBottom: 14 }}>
            Positive tests by jurisdiction
          </p>
          <MultiLineChart data={lineData} keys={lineKeys} />
        </div>

        <div style={{ ...card }}>
          <p style={{ fontSize: "0.9rem", fontWeight: 600, color: "#0f1923", marginBottom: 14 }}>
            Positive drug tests per jurisdiction, {activeYear}
          </p>
          <HorizontalBar data={barData} />
        </div>
      </div>

    </div>
  );
}