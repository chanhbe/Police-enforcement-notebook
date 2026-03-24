interface StatCardProps {
  title: string;
  value: string | number;
}

export default function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="stat-card relative overflow-hidden">
      <div className="stat-card-bg-pattern absolute inset-0 opacity-10" />
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="stat-icon-bg p-3 rounded-xl bg-slate-100 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
            <path d="M2 11a1 1 0 011-1h3a1 1 0 110 2H4a1 1 0 01-1-1z" />
            <path d="M2 15a1 1 0 011-1h7a1 1 0 110 2H3a1 1 0 01-1-1z" />
            <path d="M2 7a1 1 0 011-1h11a1 1 0 110 2H3a1 1 0 01-1-1z" />
            <path d="M16 4.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM16 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          </svg>
        </div>
      </div>
    </div>
  );
}