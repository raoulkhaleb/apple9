import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const scholarships = await prisma.scholarshipProgram.findMany({
    where: { active: true },
    orderBy: { deadline: "asc" },
  });
  return NextResponse.json({ scholarships });
}

const ApplySchema = z.object({
  scholarshipId: z.string().cuid(),
  essay: z.string().min(100).max(2000),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = ApplySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { scholarshipId, essay } = parsed.data;

  const scholarship = await prisma.scholarshipProgram.findUnique({
    where: { id: scholarshipId, active: true },
  });
  if (!scholarship) return NextResponse.json({ error: "Scholarship not found" }, { status: 404 });
  if (scholarship.deadline <= new Date()) {
    return NextResponse.json({ error: "Application deadline has passed" }, { status: 400 });
  }

  try {
    const application = await prisma.scholarshipApplication.create({
      data: { userId: session.user.id, scholarshipId, essay },
    });
    return NextResponse.json({ application }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "You have already applied for this scholarship" }, { status: 409 });
  }
}
