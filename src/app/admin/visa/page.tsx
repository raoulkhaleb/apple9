export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import VisaStatusSelect from "./VisaStatusSelect";

export const metadata = { title: "Visa Requests" };

export default async function AdminVisaPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") notFound();

  const visaRequests = await prisma.visaRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div>
      <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-8">Visa Requests</h1>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-dm">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="pb-3 font-medium text-muted">Student</th>
                  <th className="pb-3 font-medium text-muted">Country</th>
                  <th className="pb-3 font-medium text-muted">Docs</th>
                  <th className="pb-3 font-medium text-muted">Payment</th>
                  <th className="pb-3 font-medium text-muted">Status</th>
                  <th className="pb-3 font-medium text-muted">Date</th>
                  <th className="pb-3 font-medium text-muted">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {visaRequests.map((vr) => (
                  <tr key={vr.id}>
                    <td className="py-3">
                      <p className="font-medium text-[#0a0a0a]">{vr.user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{vr.user.email}</p>
                    </td>
                    <td className="py-3 text-[#0a0a0a]">{vr.country}</td>
                    <td className="py-3 text-muted">{vr.documentUrls.length} file(s)</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          vr.paymentStatus === "PAID"
                            ? "success"
                            : vr.paymentStatus === "FAILED"
                            ? "danger"
                            : "muted"
                        }
                      >
                        {vr.paymentStatus}
                      </Badge>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          vr.status === "APPROVED"
                            ? "success"
                            : vr.status === "REJECTED"
                            ? "danger"
                            : vr.status === "PROCESSING"
                            ? "warning"
                            : "muted"
                        }
                      >
                        {vr.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted">{formatDate(vr.createdAt)}</td>
                    <td className="py-3">
                      <VisaStatusSelect visaRequestId={vr.id} currentStatus={vr.status} />
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
