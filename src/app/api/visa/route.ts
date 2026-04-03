export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const visaRequests = await prisma.visaRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ visaRequests });
}

const VisaRequestSchema = z.object({
  country: z.string().min(2),
  documentUrls: z.array(z.string()).min(1, "At least one document is required"),
  userNotes: z.string().max(1000).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = VisaRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const visaRequest = await prisma.visaRequest.create({
    data: {
      userId: session.user.id,
      country: parsed.data.country,
      documentUrls: parsed.data.documentUrls,
      userNotes: parsed.data.userNotes,
      status: "SUBMITTED",
      paymentStatus: "UNPAID",
    },
  });

  return NextResponse.json({ visaRequest }, { status: 201 });
}
