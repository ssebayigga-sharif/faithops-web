"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const memberSchema = z.object({
  fullName: z.string().min(3, "Enter a valid name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  address: z.string().min(3, "Enter your home address"),
  birthday: z.string().min(1, "Enter your date of birth"),
  role: z.enum(["Member", "Volunteer", "Staff", "Visitor"]),
  sabbathInterest: z.enum([
    "Worship",
    "Youth",
    "Outreach",
    "Administration",
    "Media",
    "Hospitality",
  ]),
  preferredContact: z.enum(["Email", "Phone", "Text"]),
  emergencyContact: z.string().min(3, "Enter an emergency contact"),
  notes: z.string().optional(),
});

type MemberFormValues = z.infer<typeof memberSchema>;

export function MemberIntakeForm() {
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      birthday: "",
      role: "Member",
      sabbathInterest: "Worship",
      preferredContact: "Email",
      emergencyContact: "",
      notes: "",
    },
  });

  const onSubmit = async (data: MemberFormValues) => {
    setSubmitError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/members", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Could not save your member details.");
      }

      setSuccessMessage("Your member details have been saved.");
      reset();
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not save your member details.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-4xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div>
        <p className="text-base font-semibold text-slate-950">
          Your Member Details
        </p>
        <p className="mt-2 text-sm text-slate-600">
          Share your contact details, ministry interest, and care information.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            {...register("fullName")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Sabbath Johnson"
          />
          <p className="text-xs text-rose-600">{errors.fullName?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            {...register("email")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="sabbath@faithops.org"
          />
          <p className="text-xs text-rose-600">{errors.email?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Phone</label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="(555) 012-3456"
          />
          <p className="text-xs text-rose-600">{errors.phone?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Membership role
          </label>
          <select
            {...register("role")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          >
            <option>Member</option>
            <option>Volunteer</option>
            <option>Staff</option>
            <option>Visitor</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Home address
          </label>
          <input
            {...register("address")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Street, city, region"
          />
          <p className="text-xs text-rose-600">{errors.address?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Date of birth
          </label>
          <input
            type="date"
            {...register("birthday")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          />
          <p className="text-xs text-rose-600">{errors.birthday?.message}</p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Ministry interest
          </label>
          <select
            {...register("sabbathInterest")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          >
            <option>Worship</option>
            <option>Youth</option>
            <option>Outreach</option>
            <option>Administration</option>
            <option>Media</option>
            <option>Hospitality</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Preferred contact
          </label>
          <select
            {...register("preferredContact")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
          >
            <option>Email</option>
            <option>Phone</option>
            <option>Text</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Emergency contact
          </label>
          <input
            {...register("emergencyContact")}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Name and phone number"
          />
          <p className="text-xs text-rose-600">
            {errors.emergencyContact?.message}
          </p>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Notes</label>
          <textarea
            {...register("notes")}
            rows={4}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            placeholder="Anything the church team should know"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-3xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isSubmitting ? "Saving..." : "Save my details"}
      </button>

      {successMessage && (
        <p className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </p>
      )}

      {submitError && (
        <p className="rounded-3xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {submitError}
        </p>
      )}
    </form>
  );
}
