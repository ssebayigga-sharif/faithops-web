"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";
import { useEvents } from "./contexts/EventsContext";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const { events, getAttendanceForEvent } = useEvents();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-950 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const totalEvents = events.length;
  const totalAttendance = events.reduce((acc, event) => {
    return (
      acc +
      getAttendanceForEvent(event.id).filter((a) => a.status === "present")
        .length
    );
  }, 0);

  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Welcome back, {user.name}
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Sabbath Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Overview of church activities, member engagement, and upcoming
              events.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950">
            {user.role === "admin" ? "Administrator" : "Member"}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-slate-100 p-3">
              <svg
                className="h-6 w-6 text-slate-950"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Total Members
              </p>
              <p className="text-2xl font-semibold text-slate-950">1,284</p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-slate-100 p-3">
              <svg
                className="h-6 w-6 text-slate-950"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Upcoming Events
              </p>
              <p className="text-2xl font-semibold text-slate-950">
                {totalEvents}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-slate-100 p-3">
              <svg
                className="h-6 w-6 text-slate-950"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Attendance Marked
              </p>
              <p className="text-2xl font-semibold text-slate-950">
                {totalAttendance}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-3xl bg-slate-100 p-3">
              <svg
                className="h-6 w-6 text-slate-950"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                Tithe This Month
              </p>
              <p className="text-2xl font-semibold text-slate-950">$18.9k</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Recent Events
          </p>
          <div className="mt-6 space-y-4">
            {events.slice(0, 3).map((event) => {
              const attendance = getAttendanceForEvent(event.id);
              const presentCount = attendance.filter(
                (a) => a.status === "present",
              ).length;

              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {event.title}
                    </p>
                    <p className="text-sm text-slate-600">{event.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-950">
                      {presentCount}
                    </p>
                    <p className="text-xs text-slate-500">attended</p>
                  </div>
                </div>
              );
            })}
            {events.length === 0 && (
              <p className="text-sm text-slate-500">No events yet</p>
            )}
          </div>
        </div>

        <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
            Quick Actions
          </p>
          <div className="mt-6 space-y-3">
            {user.role === "admin" && (
              <button
                onClick={() => router.push("/events")}
                className="w-full rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Create Event
              </button>
            )}
            <button
              onClick={() => router.push("/events")}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              View Events
            </button>
            <button
              onClick={() => router.push("/members")}
              className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              View Members
            </button>
            {user.role === "admin" && (
              <>
                <button
                  onClick={() => router.push("/reports")}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                >
                  View Reports
                </button>
                <button
                  onClick={() => router.push("/settings")}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
                >
                  Admin Settings
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
