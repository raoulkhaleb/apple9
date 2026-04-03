import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const PartnershipSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["UNIVERSITY", "AIRLINE", "EMBASSY", "SPONSOR", "MEDIA"]),
  contactEmail: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN" && session?.user.role !== "MEDIA_DIRECTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = PartnershipSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const partnership = await prisma.partnership.create({
    data: {
      name: parsed.data.name,
      type: parsed.data.type,
      contactEmail: parsed.data.contactEmail || null,
      website: parsed.data.website || null,
      description: parsed.data.description || null,
    },
  });

  return NextResponse.json({ partnership }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (session?.user.role !== "ADMIN" && session?.user.role !== "MEDIA_DIRECTOR") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const partnerships = await prisma.partnership.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ partnerships });
}
