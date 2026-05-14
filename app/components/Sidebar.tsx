import Link from "next/link";

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Members", href: "/members" },
  { label: "Sabbath Ministries", href: "/ministries" },
  { label: "Events & Retreats", href: "/events" },
  { label: "Giving", href: "/giving" },
  { label: "Leaders", href: "/leaders" },
  { label: "Church Info", href: "/church-us" },
  { label: "Contact", href: "/contact" },
  { label: "Reports", href: "/reports" },
  { label: "Settings", href: "/settings" },
];

export function Sidebar() {
  return (
    <div className="flex h-full flex-col justify-between rounded-4xl border border-slate-200 bg-white p-6 shadow-xl">
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Seventh Day Church
          </p>
          <h2 className="text-2xl font-semibold text-slate-950">FaithOps HQ</h2>
          <p className="text-sm text-slate-600">
            Sabbath-centered planning for worship, outreach, and member care.
          </p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-950 transition hover:border-slate-300 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-950">Sabbath Tracker</p>
        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p>
            Next Sabbath:{" "}
            <span className="font-semibold text-slate-950">
              Saturday, 9:00 AM
            </span>
          </p>
          <p>
            Weekly Study:{" "}
            <span className="font-semibold text-slate-950">Bible Class</span>
          </p>
          <p>
            Attendance goal:{" "}
            <span className="font-semibold text-slate-950">120</span>
          </p>
        </div>
      </div>
    </div>
  );
}
