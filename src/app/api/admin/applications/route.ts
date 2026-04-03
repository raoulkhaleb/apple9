export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateStatusSchema = z.object({
  applicationId: z.string().cuid(),
  status: z.enum(["PENDING", "UNDER_REVIEW", "ACCEPTED", "REJECTED", "WAITLISTED"]),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = UpdateStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const application = await prisma.application.update({
    where: { id: parsed.data.applicationId },
    data: { status: parsed.data.status },
    select: { id: true, status: true },
  });

  return NextResponse.json({ application });
}

export async function GET() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
      college: { select: { name: true, country: true } },
    },
  });

  return NextResponse.json({ applications });
}
