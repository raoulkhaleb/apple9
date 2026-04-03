export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import BroadcastForm from "./BroadcastForm";

export const metadata = { title: "Broadcast Messages" };

export default async function AdminMessagesPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") notFound();

  const broadcasts = await prisma.message.findMany({
    where: { isAdminBroadcast: true },
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, subject: true, body: true, createdAt: true },
  });

  const userCount = await prisma.user.count();

  return (
    <div>
      <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-8">Broadcast Messages</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-2">Send Announcement</h2>
            <p className="text-sm font-dm text-muted mb-5">
              This message will appear in all {userCount} users&apos; inboxes.
            </p>
            <BroadcastForm />
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-4">Past Broadcasts</h2>
            {broadcasts.length === 0 ? (
              <p className="text-sm font-dm text-muted">No broadcasts sent yet.</p>
            ) : (
              <div className="space-y-3">
                {broadcasts.map((b) => (
                  <div key={b.id} className="p-3 rounded-xl bg-brand-light/20 border border-black/5">
                    <p className="text-sm font-dm font-medium text-[#0a0a0a]">{b.subject}</p>
                    <p className="text-xs font-dm text-muted mt-1 line-clamp-2">{b.body}</p>
                    <p className="text-xs font-dm text-muted mt-1">{formatDate(b.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
