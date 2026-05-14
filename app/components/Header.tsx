"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const isSearchPage = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const hash = window.location.hash.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  return (
    hash === "#members" ||
    hash === "#dashboard" ||
    pathname === "/members" ||
    pathname === "/dashboard"
  );
};

export function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    setShowSearch(isSearchPage());

    const handleHashChange = () => {
      setShowSearch(isSearchPage());
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-400 flex-wrap items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-950 text-lg font-bold text-white">
            7
          </span>
          <div className="hidden flex-col sm:flex">
            <span className="text-xs uppercase tracking-[0.32em] text-slate-500">
              Seventh Day
            </span>
            <span className="text-lg font-semibold text-slate-950">
              FaithOps
            </span>
          </div>
        </Link>

        <div className="flex-1 min-w-55">
          {showSearch ? (
            <div className="relative hidden md:block">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search members, events, plans..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 pl-11 text-sm text-slate-950 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {user ? (
            <>
              <nav className="flex flex-wrap items-center gap-2">
                <Link
                  href="/"
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 transition hover:bg-slate-200"
                >
                  Dashboard
                </Link>
                <Link
                  href="/members"
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 transition hover:bg-slate-200"
                >
                  Members
                </Link>
                <Link
                  href="/events"
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 transition hover:bg-slate-200"
                >
                  Events
                </Link>
                <Link
                  href="/church-us"
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 transition hover:bg-slate-200"
                >
                  Church Info
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-900 transition hover:bg-slate-200"
                >
                  Contact
                </Link>
              </nav>
              <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950">
                {user.name} ({user.role})
              </div>
              <button
                onClick={handleLogout}
                className="rounded-none border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-none border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
