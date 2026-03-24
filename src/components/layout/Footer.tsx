export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-4">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Australian Government - Police Enforcement Dashboard</p>
      </div>
    </footer>
  );
}
