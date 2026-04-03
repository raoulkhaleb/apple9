export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateStatusSchema = z.object({
  visaRequestId: z.string().cuid(),
  status: z.enum(["SUBMITTED", "DOCUMENTS_REQUIRED", "PROCESSING", "APPROVED", "REJECTED", "ON_WAITLIST"]),
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

  const visaRequest = await prisma.visaRequest.update({
    where: { id: parsed.data.visaRequestId },
    data: {
      status: parsed.data.status,
      onWaitlist: parsed.data.status === "ON_WAITLIST",
    },
    select: { id: true, status: true },
  });

  return NextResponse.json({ visaRequest });
}
