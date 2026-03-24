import { useState } from "react";

export function useFilter() {
  const [year, setYear] = useState(2024);
  const [state, setState] = useState("All");

  return { year, setYear, state, setState };
}