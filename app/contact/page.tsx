export default function ContactPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Contact
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Get in touch
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Reach out to the church office, pastoral team, or ministry
              coordinators.
            </p>
          </div>
          <button className="rounded-3xl border border-slate-200 bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
            Send message
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {[
          {
            label: "Church office",
            value: "office@faithops.org",
            detail: "Mon-Fri, 9am - 5pm",
          },
          {
            label: "Pastoral care",
            value: "pastor@faithops.org",
            detail: "Emergency and counseling support",
          },
          {
            label: "Volunteer team",
            value: "volunteers@faithops.org",
            detail: "Ministry coordination and outreach.",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
          >
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              {item.label}
            </p>
            <p className="mt-4 text-xl font-semibold text-slate-950">
              {item.value}
            </p>
            <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Visit the church
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">Address</p>
            <p className="mt-3 text-sm text-slate-600">
              123 Sabbath Way, Harmony City, ST 45123
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-semibold text-slate-950">Phone</p>
            <p className="mt-3 text-sm text-slate-600">(555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
