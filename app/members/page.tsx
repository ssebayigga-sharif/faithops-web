import { MemberIntakeForm } from "../components/MemberIntakeForm";

export default function MembersPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Members
            </p>
            <h1 className="text-3xl font-semibold text-slate-950">
              Member details
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Store your contact information, care details, and Sabbath ministry
              interest with the church office.
            </p>
          </div>
          <div className="rounded-3xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-950">
            Member self-service
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <MemberIntakeForm />

        <aside className="space-y-6">
          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Saved securely
            </p>
            <h2 className="mt-3 text-xl font-semibold text-slate-950">
              Details go through a Next.js API route
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Submissions are validated by the app before being stored in the
              church members collection.
            </p>
          </div>
          <div className="rounded-4xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
              Care team
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Use accurate contact and emergency information so the church team
              can follow up well for events, ministry work, and pastoral care.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
