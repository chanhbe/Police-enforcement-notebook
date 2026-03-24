import YearSelector from './YearSelector';
import JurisdictionSelector from './JurisdictionSelector';

interface FiltersProps {
  year: number;
  setYear: (year: number) => void;
  state: string;
  setState: (state: string) => void;
}

export default function Filters({ year, setYear, state, setState }: FiltersProps) {
  return (
    <div className="filter-section">
      <div className="filter-flex gap-4">
        <YearSelector year={year} setYear={setYear} />
        <JurisdictionSelector state={state} setState={setState} />
      </div>
    </div>
  );
}