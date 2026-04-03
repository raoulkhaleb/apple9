export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { receiverId: session.user.id },
        { isAdminBroadcast: true },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      sender: { select: { name: true, email: true, role: true } },
    },
  });

  return NextResponse.json({ messages });
}

const MessageSchema = z.object({
  subject: z.string().min(2).max(200),
  body: z.string().min(5).max(5000),
  toAdmin: z.boolean().optional(),
  broadcast: z.boolean().optional(),
  receiverId: z.string().cuid().optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = MessageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const { subject, body: msgBody, toAdmin, broadcast, receiverId } = parsed.data;

  // Only admins can broadcast
  if (broadcast && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let targetReceiverId: string | null = null;

  if (broadcast) {
    // Admin broadcast — receiverId = null, isAdminBroadcast = true
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        receiverId: null,
        subject,
        body: msgBody,
        isAdminBroadcast: true,
      },
    });
    return NextResponse.json({ message }, { status: 201 });
  }

  if (toAdmin) {
    // Find any admin to receive
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });
    targetReceiverId = admin?.id ?? null;
  } else if (receiverId) {
    targetReceiverId = receiverId;
  }

  const message = await prisma.message.create({
    data: {
      senderId: session.user.id,
      receiverId: targetReceiverId,
      subject,
      body: msgBody,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
