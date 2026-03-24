interface JurisdictionSelectorProps {
  state: string;
  setState: (state: string) => void;
}

export default function JurisdictionSelector({ state, setState }: JurisdictionSelectorProps) {
  const jurisdictions = ['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

  return (
    <div>
      <label htmlFor="jurisdiction-select" className="block text-sm font-medium text-gray-700">
        Jurisdiction
      </label>
      <select
        id="jurisdiction-select"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {jurisdictions.map((jur) => (
          <option key={jur} value={jur}>
            {jur}
          </option>
        ))}
      </select>
    </div>
  );
}