export default function LeadersPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Leaders
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Leadership hub
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Manage pastoral leadership, ministry heads, and team
              accountability.
            </p>
          </div>
          <button className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            Add leader
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          { name: "Pastor Emily", role: "Senior Pastor" },
          { name: "Aaron Johnson", role: "Youth Leader" },
          { name: "Maria Chen", role: "Worship Director" },
        ].map((leader) => (
          <div
            key={leader.name}
            className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              {leader.role}
            </p>
            <p className="mt-4 text-xl font-semibold text-slate-950">
              {leader.name}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Leadership notes
        </p>
        <ul className="mt-6 space-y-4 text-sm text-slate-600">
          <li>Align weekly worship planning with ministry leadership.</li>
          <li>Track outreach assignments and volunteer care roles.</li>
          <li>Schedule leadership coaching and team mentoring sessions.</li>
        </ul>
      </div>
    </div>
  );
}
