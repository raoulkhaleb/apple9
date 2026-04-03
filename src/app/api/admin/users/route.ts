import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateRoleSchema = z.object({
  userId: z.string().cuid(),
  role: z.enum(["STUDENT", "ADMIN", "MEDIA_DIRECTOR"]),
});

export async function PATCH(req: Request) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = UpdateRoleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  // Prevent self-demotion
  if (parsed.data.userId === session.user.id) {
    return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: parsed.data.userId },
    data: { role: parsed.data.role },
    select: { id: true, role: true },
  });

  return NextResponse.json({ user });
}
