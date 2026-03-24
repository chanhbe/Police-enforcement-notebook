interface YearSelectorProps {
  year: number;
  setYear: (year: number) => void;
}

export default function YearSelector({ year, setYear }: YearSelectorProps) {
  return (
    <div>
      <label htmlFor="year-select" className="block text-sm font-medium text-gray-700">
        Year
      </label>
      <select
        id="year-select"
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {Array.from({ length: 15 }, (_, i) => 2010 + i).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  );
}