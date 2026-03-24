import { useMemo, useState } from "react";
import breathData from "../data/clean/breath.json";
import ComboChart from "../components/charts/ComboChart";
import MultiLineChart from "../components/charts/MultiLineChart";
import HorizontalBar from "../components/charts/HorizontalBar";
import { BreathData } from "../types/breath";

const raw: BreathData[] = breathData as BreathData[];
const ALL_JURISDICTIONS = ["All", ...Array.from(new Set(raw.map(d => d.jurisdiction))).sort()];
const ALL_YEARS         = Array.from(new Set(raw.map(d => d.year))).sort((a, b) => a - b);
const DEFAULT_YEAR      = ALL_YEARS[ALL_YEARS.length - 1];

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e6ea",
  borderRadius: 10, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", padding: "16px 18px",
};

export default function BreathDashboard() {
  const [year,  setYear]  = useState<number>(DEFAULT_YEAR);
  const [state, setState] = useState<string>("All");

  // Stat cards = exact year + jurisdiction
  const statsData = useMemo(() =>
    raw.filter(d => d.year === year && (state === "All" || d.jurisdiction === state)),
    [year, state]);

  const totalTests    = statsData.reduce((s, d) => s + d.breath_tests_total,    0);
  const totalPositive = statsData.reduce((s, d) => s + d.positive_breath_tests, 0);
  const totalFines    = statsData.reduce((s, d) => s + ((d as any).fines    ?? 0), 0);
  const totalArrests  = statsData.reduce((s, d) => s + ((d as any).arrests  ?? 0), 0);
  const totalCharges  = statsData.reduce((s, d) => s + ((d as any).charges  ?? 0), 0);
  const positivityPct = totalTests > 0 ? (totalPositive / totalTests * 100).toFixed(1) + "%" : "—";

  // ComboChart = all years up to selected, filtered by state
  const comboData = useMemo(() =>
    raw.filter(d => d.year <= year && (state === "All" || d.jurisdiction === state)),
    [year, state]);

  // MultiLine = positive rate % per jurisdiction, all years
  const jurisdictionKeys = state === "All"
    ? Array.from(new Set(raw.map(d => d.jurisdiction))).sort()
    : [state];

  const multiLineData = useMemo(() => {
    const byYear: Record<number, any> = {};
    raw.forEach(d => {
      if (!byYear[d.year]) byYear[d.year] = { year: d.year };
      byYear[d.year][d.jurisdiction + "_t"] = (byYear[d.year][d.jurisdiction + "_t"] ?? 0) + d.breath_tests_total;
      byYear[d.year][d.jurisdiction + "_p"] = (byYear[d.year][d.jurisdiction + "_p"] ?? 0) + d.positive_breath_tests;
    });
    return Object.values(byYear).sort((a: any, b: any) => a.year - b.year).map((row: any) => {
      const out: any = { year: row.year };
      jurisdictionKeys.forEach(k => {
        const t = row[k + "_t"] ?? 0;
        const p = row[k + "_p"] ?? 0;
        out[k] = t > 0 ? parseFloat((p / t * 100).toFixed(2)) : 0;
      });
      return out;
    });
  }, [state]);

  // HorizontalBar = tests per jurisdiction for selected year only
  const hbarData = useMemo(() => {
    const byState: Record<string, number> = {};
    raw.filter(d => d.year === year).forEach(d => {
      byState[d.jurisdiction] = (byState[d.jurisdiction] ?? 0) + d.breath_tests_total;
    });
    return Object.entries(byState).map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [year]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

      {/* Filter bar */}
      <div className="filter-bar">
        <div>
          <label>Select jurisdiction</label>
          <select value={state} onChange={e => setState(e.target.value)}>
            {ALL_JURISDICTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label>Select year</label>
          <select value={year} onChange={e => setYear(Number(e.target.value))}>
            {ALL_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <button className="btn-reset" onClick={() => { setState("All"); setYear(DEFAULT_YEAR); }}>
          Reset View
        </button>
      </div>

      {/* Row 1: Sidebar + ComboChart */}
      <div style={{ display: "grid", gridTemplateColumns: "210px 1fr", gap: 14 }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Big number */}
          <div style={card}>
            <p style={{ fontSize: "2rem", fontWeight: 700, color: "#111827", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {totalTests.toLocaleString()}
            </p>
            <p style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 6, lineHeight: 1.4 }}>
              Random breath tests<br />conducted, {year}
            </p>
          </div>

          {/* Positivity % */}
          <div style={{ background: "#1a2b4a", borderRadius: 8, padding: "12px 14px" }}>
            <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{positivityPct}</p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: 5 }}>Positive breath tests</p>
          </div>

          {/* Mini stats */}
          {([
            { label: "Fines",   value: totalFines   },
            { label: "Arrests", value: totalArrests },
            { label: "Charges", value: totalCharges },
          ] as {label:string;value:number}[]).map(({ label, value }) => (
            <div key={label} style={{ ...card, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>{label}</span>
              <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>
                {value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>

        <div style={card}>
          <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 12, color: "#111827" }}>
            Breath tests conducted vs positive results
          </p>
          <ComboChart data={comboData} valueKey="breath_tests_total" />
        </div>
      </div>

      {/* Row 2: MultiLine + HBar */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div style={card}>
          <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 12, color: "#111827" }}>
            Positive results by jurisdiction
          </p>
          <MultiLineChart data={multiLineData} keys={jurisdictionKeys} />
        </div>
        <div style={card}>
          <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 12, color: "#111827" }}>
            Breath tests per jurisdiction, {year}
          </p>
          <HorizontalBar data={hbarData} />
        </div>
      </div>

    </div>
  );
}