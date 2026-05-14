export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Settings
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Application settings
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Configure Sabbath defaults, membership roles, notifications, and
              system preferences.
            </p>
          </div>
          <button className="rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Save settings
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Notification preferences
          </p>
          <div className="mt-6 space-y-4">
            {[
              "Weekly bulletin reminders",
              "Sabbath event alerts",
              "Volunteer coordination updates",
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
              >
                <p className="text-sm font-medium text-slate-950">{item}</p>
                <p className="mt-2 text-sm text-slate-600">
                  Enable or disable email and app notifications for this item.
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Ministry defaults
          </p>
          <div className="mt-6 grid gap-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">
                Default Sabbath start time
              </p>
              <p className="mt-2 text-sm text-slate-600">10:00 AM</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">
                Volunteer sign-up window
              </p>
              <p className="mt-2 text-sm text-slate-600">
                1 week before Sabbath
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
