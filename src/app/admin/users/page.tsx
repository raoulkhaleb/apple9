import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import UserRoleSelect from "./UserRoleSelect";

export const metadata = { title: "Manage Users" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") notFound();

  const params = await searchParams;

  const users = await prisma.user.findMany({
    where: params.q
      ? {
          OR: [
            { name: { contains: params.q, mode: "insensitive" } },
            { email: { contains: params.q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { applications: true, visaRequests: true } },
    },
  });

  return (
    <div>
      <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-8">Users</h1>

      <Card>
        <CardContent>
          {/* Search */}
          <form className="mb-6">
            <input
              name="q"
              defaultValue={params.q ?? ""}
              placeholder="Search by name or email..."
              className="h-10 w-full max-w-xs rounded-lg border border-black/15 bg-white px-3 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </form>

          <div className="overflow-x-auto">
            <table className="w-full text-sm font-dm">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="pb-3 font-medium text-muted">Name</th>
                  <th className="pb-3 font-medium text-muted">Role</th>
                  <th className="pb-3 font-medium text-muted">Apps</th>
                  <th className="pb-3 font-medium text-muted">Visa</th>
                  <th className="pb-3 font-medium text-muted">Joined</th>
                  <th className="pb-3 font-medium text-muted">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3">
                      <p className="font-medium text-[#0a0a0a]">{user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{user.email}</p>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "dark"
                            : user.role === "MEDIA_DIRECTOR"
                            ? "warning"
                            : "muted"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted">{user._count.applications}</td>
                    <td className="py-3 text-muted">{user._count.visaRequests}</td>
                    <td className="py-3 text-muted">{formatDate(user.createdAt)}</td>
                    <td className="py-3">
                      <UserRoleSelect userId={user.id} currentRole={user.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
