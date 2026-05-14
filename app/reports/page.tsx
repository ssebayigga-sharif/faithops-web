export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Reports
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Leadership reports
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Review Sabbath attendance, giving analysis, and ministry impact
              reports.
            </p>
          </div>
          <button className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            Download report
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Attendance",
            summary: "98% participation across Sabbath services.",
          },
          { title: "Giving", summary: "14% growth in regular offerings." },
          { title: "Outreach", summary: "4 new ministry contacts this week." },
        ].map((report) => (
          <div
            key={report.title}
            className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              {report.title}
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-950">
              {report.summary}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Recent report activity
        </p>
        <ul className="mt-6 space-y-4 text-sm text-slate-600">
          <li>Published weekly Sabbath attendance summary</li>
          <li>Shared giving overview with leadership team</li>
          <li>Prepared outreach follow-up and guest care notes</li>
        </ul>
      </div>
    </div>
  );
}
