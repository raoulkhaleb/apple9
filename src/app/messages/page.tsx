export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatRelativeTime, truncate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pencil, Inbox, Send } from "lucide-react";

export const metadata = { title: "Messages" };

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  const params = await searchParams;
  const tab = params.tab ?? "inbox";

  const inbox = await prisma.message.findMany({
    where: {
      OR: [
        { receiverId: session.user.id },
        { isAdminBroadcast: true },
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { sender: { select: { name: true, email: true, role: true } } },
  });

  const sent = await prisma.message.findMany({
    where: { senderId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { receiver: { select: { name: true, email: true } } },
  });

  const unreadCount = inbox.filter((m) => !m.isRead && m.receiverId === session.user.id).length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a]">Messages</h1>
          {unreadCount > 0 && (
            <p className="text-sm font-dm text-brand mt-1">{unreadCount} unread</p>
          )}
        </div>
        <Link href="/messages/compose">
          <Button className="gap-2">
            <Pencil className="w-4 h-4" />
            Compose
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-brand-light/30 rounded-xl p-1 w-fit">
        {[
          { key: "inbox", label: "Inbox", icon: Inbox, count: unreadCount },
          { key: "sent", label: "Sent", icon: Send, count: 0 },
        ].map(({ key, label, icon: Icon, count }) => (
          <Link key={key} href={`/messages?tab=${key}`}>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-dm font-medium transition-colors ${
                tab === key
                  ? "bg-white text-[#0a0a0a] shadow-sm"
                  : "text-muted hover:text-[#0a0a0a]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count > 0 && (
                <span className="bg-brand text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
          </Link>
        ))}
      </div>

      {/* Message list */}
      <div className="space-y-2">
        {tab === "inbox" && (
          inbox.length === 0 ? (
            <EmptyState label="No messages yet" />
          ) : (
            inbox.map((msg) => (
              <Link key={msg.id} href={`/messages/${msg.id}`}>
                <div className={`bg-white rounded-xl border transition-colors hover:border-brand/30 p-4 cursor-pointer flex gap-4 items-start ${!msg.isRead && msg.receiverId === session.user.id ? "border-brand/20 bg-brand-light/10" : "border-black/10"}`}>
                  <div className="w-9 h-9 bg-brand-light rounded-full flex items-center justify-center flex-shrink-0 text-brand font-syne font-extrabold text-sm">
                    {msg.isAdminBroadcast ? "A9" : (msg.sender.name?.[0] ?? "?")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-dm font-medium text-[#0a0a0a]">
                        {msg.isAdminBroadcast ? "Apple 9 Team" : (msg.sender.name ?? msg.sender.email)}
                      </p>
                      <span className="text-xs font-dm text-muted whitespace-nowrap">{formatRelativeTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-sm font-dm text-[#0a0a0a] truncate">{msg.subject}</p>
                    <p className="text-xs font-dm text-muted truncate mt-0.5">{truncate(msg.body, 80)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {msg.isAdminBroadcast && <Badge variant="dark" className="text-xs">Announcement</Badge>}
                    {!msg.isRead && msg.receiverId === session.user.id && (
                      <span className="w-2 h-2 bg-brand rounded-full" />
                    )}
                  </div>
                </div>
              </Link>
            ))
          )
        )}

        {tab === "sent" && (
          sent.length === 0 ? (
            <EmptyState label="No sent messages" />
          ) : (
            sent.map((msg) => (
              <Link key={msg.id} href={`/messages/${msg.id}`}>
                <div className="bg-white rounded-xl border border-black/10 hover:border-brand/30 transition-colors p-4 cursor-pointer flex gap-4 items-start">
                  <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 text-muted font-syne font-extrabold text-sm">
                    {msg.receiver?.name?.[0] ?? "A"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-dm font-medium text-[#0a0a0a]">
                        To: {msg.receiver?.name ?? "Admin"}
                      </p>
                      <span className="text-xs font-dm text-muted whitespace-nowrap">{formatRelativeTime(msg.createdAt)}</span>
                    </div>
                    <p className="text-sm font-dm text-[#0a0a0a] truncate">{msg.subject}</p>
                    <p className="text-xs font-dm text-muted truncate mt-0.5">{truncate(msg.body, 80)}</p>
                  </div>
                </div>
              </Link>
            ))
          )
        )}
      </div>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-xl border border-black/10 p-12 text-center">
      <Inbox className="w-10 h-10 text-muted mx-auto mb-3" />
      <p className="font-syne font-extrabold text-lg text-[#0a0a0a]">{label}</p>
      <p className="text-sm font-dm text-muted mt-1">Your inbox is empty.</p>
    </div>
  );
}
