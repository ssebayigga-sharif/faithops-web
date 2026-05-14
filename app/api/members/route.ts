import { NextResponse } from "next/server";
import { z } from "zod";

const firebaseMembersUrl =
  "https://my-church-9abc5-default-rtdb.firebaseio.com/members.json";

const memberSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(3),
  birthday: z.string().min(1),
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
  emergencyContact: z.string().min(3),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const payload = memberSchema.parse(await request.json());
    const createdAt = new Date().toISOString();

    const response = await fetch(firebaseMembersUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        createdAt,
        updatedAt: createdAt,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Firebase did not accept the member details." },
        { status: response.status },
      );
    }

    const result = (await response.json()) as { name?: string };

    return NextResponse.json(
      {
        id: result.name,
        message: "Member details saved successfully.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Please check the member details and try again." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Could not save member details right now." },
      { status: 500 },
    );
  }
}
