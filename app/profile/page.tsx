export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              User Profile
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Member profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              This profile page will house user details, Sabbath roles, ministry
              assignments, and access settings.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-950">
            Profile status: Active
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6 rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">
              Profile details
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Name
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  Sabbath Johnson
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Role
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  Volunteer
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Email
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  sabbath@faithops.org
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                  Phone
                </p>
                <p className="mt-2 text-lg font-semibold text-slate-950">
                  (555) 012-3456
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-lg font-semibold text-slate-950">
              Sabbath ministry details
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Assignments, availability, and Sabbath team contributions are
              displayed here to keep weekly plans aligned with the church
              calendar.
            </p>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Recent activity
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>Joined Sabbath outreach team</li>
              <li>Confirmed event attendance</li>
              <li>Updated volunteer availability</li>
            </ul>
          </div>
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Settings
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Manage notification preferences
              </button>
              <button className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
                Update ministry role
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
