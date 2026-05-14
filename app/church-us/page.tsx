export default function ChurchUsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Church Info
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              About FaithOps Church
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Discover our mission, values, and how we serve the Sabbath
              community together.
            </p>
          </div>
          <button className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            Learn more
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {[
          {
            title: "Our mission",
            summary:
              "To equip Sabbath worshippers with spiritual care, community support, and faith-driven service.",
          },
          {
            title: "Our values",
            summary:
              "Faith, fellowship, compassion, and Sabbath stewardship form the heart of every ministry.",
          },
          {
            title: "Our vision",
            summary:
              "A thriving church community shaped by discipleship, outreach, and intentional worship.",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              {card.title}
            </p>
            <p className="mt-4 text-lg font-semibold text-slate-950">
              {card.summary}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          What we offer
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">
              Worship services
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Weekly Sabbath services, prayer gatherings, and faith formation.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">
              Community ministries
            </p>
            <p className="mt-3 text-sm text-slate-600">
              Outreach, care teams, youth discipleship, and volunteer support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
