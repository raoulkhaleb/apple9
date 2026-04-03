import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const country = searchParams.get("country");
  const scholarship = searchParams.get("scholarship");
  const minTuition = searchParams.get("minTuition");
  const maxTuition = searchParams.get("maxTuition");

  const colleges = await prisma.college.findMany({
    where: {
      active: true,
      ...(country && { country }),
      ...(scholarship === "true" && { scholarshipAvailable: true }),
      ...((minTuition || maxTuition) && {
        tuitionMin: { lte: maxTuition ? Number(maxTuition) : undefined },
        tuitionMax: { gte: minTuition ? Number(minTuition) : undefined },
      }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { country: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: [{ featured: "desc" }, { ranking: "asc" }, { name: "asc" }],
    take: 60,
  });

  return NextResponse.json({ colleges });
}

const CollegeSchema = z.object({
  name: z.string().min(2),
  country: z.string().min(2),
  city: z.string().optional(),
  programs: z.array(z.string()).min(1),
  tuitionMin: z.number().positive(),
  tuitionMax: z.number().positive(),
  scholarshipAvailable: z.boolean().default(false),
  description: z.string().min(10),
  website: z.string().url().optional(),
  ranking: z.number().int().positive().optional(),
  acceptanceRate: z.number().min(0).max(100).optional(),
  featured: z.boolean().default(false),
});

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = CollegeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const college = await prisma.college.create({ data: parsed.data });
  return NextResponse.json({ college }, { status: 201 });
}
