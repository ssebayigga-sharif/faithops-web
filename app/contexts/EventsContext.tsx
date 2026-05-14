"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export interface Event {
  id: string;
  title: string;
  date: string;
  details: string;
  createdBy: string;
  createdAt: string;
}

export interface Attendance {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  status: "present" | "absent";
  markedAt: string;
}

interface EventsContextType {
  events: Event[];
  attendance: Attendance[];
  createEvent: (event: Omit<Event, "id" | "createdAt">) => void;
  markAttendance: (eventId: string, status: "present" | "absent") => void;
  getAttendanceForEvent: (eventId: string) => Attendance[];
  getUserAttendance: (userId: string) => Attendance[];
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

// Mock initial data
const initialEvents: Event[] = [
  {
    id: "1",
    title: "Saturday Worship Outreach",
    date: "Sat, May 18",
    details: "Hospitality and evangelism team coordination.",
    createdBy: "1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Youth Sabbath Retreat",
    date: "Fri, May 24",
    details: "Youth leaders training and group fellowship.",
    createdBy: "1",
    createdAt: new Date().toISOString(),
  },
];

const initialAttendance: Attendance[] = [
  {
    id: "1",
    eventId: "1",
    userId: "2",
    userName: "John Member",
    status: "present",
    markedAt: new Date().toISOString(),
  },
];

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [attendance, setAttendance] = useState<Attendance[]>(initialAttendance);
  const { user } = useAuth();

  useEffect(() => {
    // Load from localStorage
    const storedEvents = localStorage.getItem("faithops-events");
    const storedAttendance = localStorage.getItem("faithops-attendance");

    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    if (storedAttendance) {
      setAttendance(JSON.parse(storedAttendance));
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("faithops-events", JSON.stringify(events));
    localStorage.setItem("faithops-attendance", JSON.stringify(attendance));
  }, [events, attendance]);

  const createEvent = (eventData: Omit<Event, "id" | "createdAt">) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const markAttendance = (eventId: string, status: "present" | "absent") => {
    if (!user) return;

    const existingAttendance = attendance.find(
      (a) => a.eventId === eventId && a.userId === user.id,
    );

    if (existingAttendance) {
      // Update existing
      setAttendance((prev) =>
        prev.map((a) =>
          a.id === existingAttendance.id
            ? { ...a, status, markedAt: new Date().toISOString() }
            : a,
        ),
      );
    } else {
      // Create new
      const newAttendance: Attendance = {
        id: Date.now().toString(),
        eventId,
        userId: user.id,
        userName: user.name,
        status,
        markedAt: new Date().toISOString(),
      };
      setAttendance((prev) => [...prev, newAttendance]);
    }
  };

  const getAttendanceForEvent = (eventId: string) => {
    return attendance.filter((a) => a.eventId === eventId);
  };

  const getUserAttendance = (userId: string) => {
    return attendance.filter((a) => a.userId === userId);
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        attendance,
        createEvent,
        markAttendance,
        getAttendanceForEvent,
        getUserAttendance,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}
