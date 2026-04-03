import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = { title: "Finance" };

export default async function FinancePage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") notFound();

  const transactions = await prisma.transaction.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  const totals = {
    all: transactions.filter((t) => t.status === "COMPLETED").reduce((sum, t) => sum + t.amount, 0),
    collegeApp: transactions.filter((t) => t.status === "COMPLETED" && t.type === "COLLEGE_APP").reduce((sum, t) => sum + t.amount, 0),
    visa: transactions.filter((t) => t.status === "COMPLETED" && t.type === "VISA_SERVICE").reduce((sum, t) => sum + t.amount, 0),
  };

  return (
    <div>
      <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-8">Finance</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: "Total Revenue", value: totals.all },
          { label: "College App Fees", value: totals.collegeApp },
          { label: "Visa Service Fees", value: totals.visa },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent>
              <p className="text-sm font-dm text-muted mb-1">{s.label}</p>
              <p className="font-syne font-extrabold text-3xl text-brand">{formatCurrency(s.value)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent>
          <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-4">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-dm">
              <thead>
                <tr className="border-b border-black/10 text-left">
                  <th className="pb-3 font-medium text-muted">Student</th>
                  <th className="pb-3 font-medium text-muted">Type</th>
                  <th className="pb-3 font-medium text-muted">Amount</th>
                  <th className="pb-3 font-medium text-muted">Status</th>
                  <th className="pb-3 font-medium text-muted">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-3">
                      <p className="font-medium text-[#0a0a0a]">{tx.user.name ?? "—"}</p>
                      <p className="text-xs text-muted">{tx.user.email}</p>
                    </td>
                    <td className="py-3 text-muted">{tx.type.replace("_", " ")}</td>
                    <td className="py-3 font-medium text-[#0a0a0a]">{formatCurrency(tx.amount)}</td>
                    <td className="py-3">
                      <Badge
                        variant={
                          tx.status === "COMPLETED" ? "success" :
                          tx.status === "FAILED" ? "danger" :
                          tx.status === "REFUNDED" ? "warning" : "muted"
                        }
                      >
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-3 text-muted">{formatDate(tx.createdAt)}</td>
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
