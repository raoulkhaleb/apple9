import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import ApplicationStatusSelect from "./ApplicationStatusSelect";

export const metadata = { title: "Applications" };

export default async function AdminApplicationsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") notFound();

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
      college: { select: { name: true, country: true } },
    },
  });

  return (
    <div>
      <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-8">College Applications</h1>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-dm">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="pb-3 font-medium text-muted">Student</th>
                  <th className="pb-3 font-medium text-muted">College</th>
                  <th className="pb-3 font-medium text-muted">Payment</th>
                  <th className="pb-3 font-medium text-muted">Status</th>
                  <th className="pb-3 font-medium text-muted">Date</th>
                  <th className="pb-3 font-medium text-muted">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td className="py-3">
                      <p className="font-medium text-[#0a0a0a]">{app.user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{app.user.email}</p>
                    </td>
                    <td className="py-3">
                      <p className="font-medium text-[#0a0a0a]">{app.college.name}</p>
                      <p className="text-xs text-muted">{app.college.country}</p>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          app.paymentStatus === "PAID"
                            ? "success"
                            : app.paymentStatus === "FAILED"
                            ? "danger"
                            : "muted"
                        }
                      >
                        {app.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          app.status === "ACCEPTED"
                            ? "success"
                            : app.status === "REJECTED"
                            ? "danger"
                            : app.status === "WAITLISTED"
                            ? "warning"
                            : "muted"
                        }
                      >
                        {app.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted">{formatDate(app.createdAt)}</td>
                    <td className="py-3">
                      <ApplicationStatusSelect applicationId={app.id} currentStatus={app.status} />
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
