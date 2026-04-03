import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Message" };

export default async function MessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  const message = await prisma.message.findUnique({
    where: { id },
    include: {
      sender: { select: { id: true, name: true, email: true, role: true } },
      receiver: { select: { id: true, name: true, email: true } },
    },
  });

  if (!message) notFound();

  // Security: only sender, receiver, or admin can view
  const canView =
    message.senderId === session.user.id ||
    message.receiverId === session.user.id ||
    message.isAdminBroadcast ||
    session.user.role === "ADMIN";

  if (!canView) notFound();

  // Mark as read
  if (message.receiverId === session.user.id && !message.isRead) {
    await prisma.message.update({ where: { id }, data: { isRead: true } });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/messages" className="inline-flex items-center gap-2 text-sm font-dm text-muted hover:text-brand mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Messages
      </Link>

      <div className="bg-white rounded-2xl border border-black/10 p-8">
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="font-syne font-extrabold text-2xl text-[#0a0a0a] mb-2">{message.subject}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm font-dm text-muted">
              <span>
                From:{" "}
                <span className="text-[#0a0a0a] font-medium">
                  {message.isAdminBroadcast ? "Apple 9 Team" : (message.sender.name ?? message.sender.email)}
                </span>
              </span>
              {message.receiver && (
                <span>
                  To:{" "}
                  <span className="text-[#0a0a0a] font-medium">
                    {message.receiver.name ?? message.receiver.email}
                  </span>
                </span>
              )}
              <span>{formatDate(message.createdAt)}</span>
            </div>
          </div>
          {message.isAdminBroadcast && <Badge variant="dark">Announcement</Badge>}
        </div>

        <div className="prose prose-sm max-w-none font-dm text-[#0a0a0a] leading-relaxed">
          {message.body.split("\n").map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
