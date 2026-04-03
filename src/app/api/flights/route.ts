export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const FlightSchema = z.object({
  origin: z.string().min(2),
  destination: z.string().min(2),
  departDate: z.string().min(1),
  returnDate: z.string().optional(),
  passengers: z.coerce.number().int().min(1).max(10).default(1),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = FlightSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { origin, destination, departDate, returnDate, passengers } = parsed.data;

  const booking = await prisma.flightBooking.create({
    data: {
      userId: session.user.id,
      origin,
      destination,
      departDate: new Date(departDate),
      returnDate: returnDate ? new Date(returnDate) : null,
      passengers,
      status: "ENQUIRY",
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.flightBooking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
