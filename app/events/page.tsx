"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useEvents } from "../contexts/EventsContext";
import { EventForm } from "../components/EventForm";

export default function EventsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();
  const { events, markAttendance, getAttendanceForEvent } = useEvents();

  const handleAttendance = (eventId: string, status: "present" | "absent") => {
    markAttendance(eventId, status);
  };

  const getUserAttendanceStatus = (eventId: string) => {
    if (!user) return null;
    const attendance = getAttendanceForEvent(eventId);
    const userAttendance = attendance.find((a) => a.userId === user.id);
    return userAttendance?.status || null;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-950 mb-2">
            Please log in
          </h2>
          <p className="text-slate-600">
            You need to be logged in to view events.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Events
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Sabbath event planner
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Schedule worship services, retreats, and ministry gatherings with
              clarity.
            </p>
          </div>
          {user.role === "admin" && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Create event
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {events.map((event) => {
          const userAttendance = getUserAttendanceStatus(event.id);
          const attendance = getAttendanceForEvent(event.id);

          return (
            <div
              key={event.id}
              className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                {event.date}
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-slate-950">
                {event.title}
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {event.details}
              </p>

              {user.role === "member" && (
                <div className="mt-6 space-y-3">
                  <p className="text-sm font-medium text-slate-950">
                    Mark Attendance:
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAttendance(event.id, "present")}
                      className={`flex-1 rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                        userAttendance === "present"
                          ? "bg-green-600 text-white"
                          : "bg-slate-100 text-slate-950 hover:bg-slate-200"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => handleAttendance(event.id, "absent")}
                      className={`flex-1 rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                        userAttendance === "absent"
                          ? "bg-red-600 text-white"
                          : "bg-slate-100 text-slate-950 hover:bg-slate-200"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                  {userAttendance && (
                    <p className="text-sm text-slate-600">
                      You marked yourself as {userAttendance}
                    </p>
                  )}
                </div>
              )}

              {user.role === "admin" && (
                <div className="mt-6 space-y-4">
                  {/* Admin can mark their own attendance */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-950">
                      Mark Your Attendance:
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAttendance(event.id, "present")}
                        className={`flex-1 rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                          userAttendance === "present"
                            ? "bg-green-600 text-white"
                            : "bg-slate-100 text-slate-950 hover:bg-slate-200"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => handleAttendance(event.id, "absent")}
                        className={`flex-1 rounded-3xl px-4 py-2 text-sm font-semibold transition ${
                          userAttendance === "absent"
                            ? "bg-red-600 text-white"
                            : "bg-slate-100 text-slate-950 hover:bg-slate-200"
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                    {userAttendance && (
                      <p className="text-sm text-slate-600">
                        You marked yourself as {userAttendance}
                      </p>
                    )}
                  </div>

                  {/* Admin can view all attendance */}
                  <div>
                    <p className="text-sm font-medium text-slate-950 mb-2">
                      Attendance ({attendance.length} responses):
                    </p>
                    <div className="space-y-2">
                      {attendance.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-slate-950">{att.userName}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              att.status === "present"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {att.status}
                          </span>
                        </div>
                      ))}
                      {attendance.length === 0 && (
                        <p className="text-sm text-slate-500">
                          No attendance marked yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCreateForm && <EventForm onClose={() => setShowCreateForm(false)} />}
    </div>
  );
}
