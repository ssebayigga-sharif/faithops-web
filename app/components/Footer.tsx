export function Footer() {
  return (
    <footer className="rounded-4xl border border-slate-800 bg-slate-950 px-6 py-10 text-slate-200 shadow-xl shadow-slate-950/20 sm:px-8">
      <div className="mx-auto grid max-w-400 gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-white">
            FaithOps Church Management
          </p>
          <p className="text-sm leading-6 text-slate-400">
            A Sabbath-first administrative dashboard for member care, ministry
            workflows, and weekend worship coordination.
          </p>
          <div className="space-y-2 text-sm text-slate-400">
            <p>
              Built for pastoral teams, volunteer leaders, and community
              coordinators.
            </p>
            <p>
              Designed to keep weekly Sabbath planning visible and accessible.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Quick links
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Member Directory</li>
            <li>Sabbath Schedule</li>
            <li>Giving Dashboard</li>
            <li>Event Calendar</li>
          </ul>
        </div>

        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Contact & support
          </p>
          <div className="space-y-2 text-sm text-slate-300">
            <p>support@faithops.org</p>
            <p>+1 (555) 012-3456</p>
            <p>
              7-day planning is our focus, even if the office operates weekdays.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 text-sm text-slate-300">
            <p className="font-semibold text-white">Outreach Tip</p>
            <p className="mt-2 text-slate-400">
              Use the Sabbath tracker to align volunteers, hospitality, and
              study ministries.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 FaithOps</span>
          <div className="flex flex-wrap gap-4">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
            <span>Release Notes</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
