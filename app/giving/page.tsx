export default function GivingPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Giving
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Offering and funds
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Track Sabbath donations, tithe progress, and fund distributions
              for ministries.
            </p>
          </div>
          <button className="rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            New gift entry
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            label: "Tithes",
            value: "$18.9k",
            accent: "bg-emerald-50 text-emerald-700",
          },
          {
            label: "Offering",
            value: "$7.2k",
            accent: "bg-sky-50 text-sky-700",
          },
          {
            label: "Outreach fund",
            value: "$4.1k",
            accent: "bg-violet-50 text-violet-700",
          },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-[2rem] p-6 shadow-sm ${card.accent}`}
          >
            <p className="text-sm uppercase tracking-[0.24em]">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Giving trend
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-950">Weekly giving</p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">$5.4k</p>
            <p className="mt-2 text-sm text-slate-600">
              Steady increase in Sabbath contributions.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-medium text-slate-950">
              Sabbath reserve
            </p>
            <p className="mt-3 text-2xl font-semibold text-slate-950">$13.8k</p>
            <p className="mt-2 text-sm text-slate-600">
              Available funds for ministry outreach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
