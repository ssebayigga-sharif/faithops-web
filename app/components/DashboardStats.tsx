const stats = [
  { label: "Active Members", value: "1,284", tone: "text-slate-950" },
  { label: "Sabbath Attendance", value: "98%", tone: "text-slate-950" },
  { label: "Offering Growth", value: "+14%", tone: "text-emerald-600" },
  { label: "Upcoming Events", value: "4", tone: "text-slate-950" },
];

export function DashboardStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.label}
          className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            {item.label}
          </p>
          <p className={`mt-4 text-3xl font-semibold ${item.tone}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
