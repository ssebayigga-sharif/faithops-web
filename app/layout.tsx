import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { AuthProvider } from "./contexts/AuthContext";
import { EventsProvider } from "./contexts/EventsContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "`FaithOps` - Seventh-day adventist Church",
  description:
    "Seventh-day church management system built with Next.js, Tailwind CSS, React Hook Form, and Zod.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50 text-slate-950">
        <AuthProvider>
          <EventsProvider>
            <Header />

            <div
              className="mx-auto relative min-h-[calc(100vh-128px)] 
            max-w-400 gap-6 px-4 pb-10 pt-30 lg:px-8 lg:pt-32"
            >
              <aside className="hidden lg:block">
                <div className="fixed left-0 top-32 h-[calc(100vh-128px)] w-72 overflow-y-auto border-r border-slate-200 bg-slate-50/95 px-4 py-6 backdrop-blur-sm">
                  <Sidebar />
                </div>
              </aside>

              <main className="flex-1 space-y-6 lg:ml-72">
                {children}
                <Footer />
              </main>
            </div>
          </EventsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
