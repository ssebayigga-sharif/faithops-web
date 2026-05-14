export default function MinistriesPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Sabbath Ministries
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Ministry overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Manage worship teams, outreach groups, and Bible study ministries
              for Sabbath coordination.
            </p>
          </div>
          <button className="rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Add ministry team
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Worship Team",
            description: "Music, audio, and service flow coordination.",
          },
          {
            title: "Outreach Team",
            description: "Community evangelism and guest hospitality.",
          },
          {
            title: "Youth Ministry",
            description: "Sabbath youth discipleship and events.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              {item.title}
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-950">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-4xl border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Ministry readiness
        </p>
        <p className="mt-4 text-sm leading-6 text-slate-600">
          Track volunteer assignments, Sabbath meeting slots, and ministry
          readiness in one place.
        </p>
      </div>
    </div>
  );
}
