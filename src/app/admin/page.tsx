import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { DollarSign, Users, FileText, Plane } from "lucide-react";

export const metadata = { title: "Admin Overview" };

export default async function AdminPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") notFound();

  const [
    totalRevenue,
    colAppRevenue,
    visaRevenue,
    userCount,
    pendingApps,
    pendingVisa,
    recentTransactions,
  ] = await Promise.all([
    prisma.transaction.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { status: "COMPLETED", type: "COLLEGE_APP" }, _sum: { amount: true } }),
    prisma.transaction.aggregate({ where: { status: "COMPLETED", type: "VISA_SERVICE" }, _sum: { amount: true } }),
    prisma.user.count(),
    prisma.application.count({ where: { status: "PENDING", paymentStatus: "PAID" } }),
    prisma.visaRequest.count({ where: { status: { in: ["SUBMITTED", "PROCESSING"] } } }),
    prisma.transaction.findMany({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const stats = [
    {
      label: "Total Revenue",
      value: formatCurrency(totalRevenue._sum.amount ?? 0),
      icon: DollarSign,
      sub: "All time",
    },
    {
      label: "Total Students",
      value: userCount.toLocaleString(),
      icon: Users,
      sub: "Registered accounts",
    },
    {
      label: "Pending Applications",
      value: pendingApps,
      icon: FileText,
      sub: "Awaiting review",
    },
    {
      label: "Active Visa Requests",
      value: pendingVisa,
      icon: Plane,
      sub: "In processing",
    },
  ];

  return (
    <div>
      <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-start gap-4">
              <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center flex-shrink-0">
                <stat.icon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="font-syne font-extrabold text-2xl text-[#0a0a0a]">{stat.value}</p>
                <p className="text-sm font-dm text-[#0a0a0a] font-medium">{stat.label}</p>
                <p className="text-xs font-dm text-muted">{stat.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-4">Revenue Breakdown</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-black/5">
                <p className="text-sm font-dm text-[#0a0a0a]">College Applications ($3 each)</p>
                <p className="font-syne font-extrabold text-[#0a0a0a]">{formatCurrency(colAppRevenue._sum.amount ?? 0)}</p>
              </div>
              <div className="flex items-center justify-between py-2">
                <p className="text-sm font-dm text-[#0a0a0a]">Visa Services ($5 each)</p>
                <p className="font-syne font-extrabold text-[#0a0a0a]">{formatCurrency(visaRevenue._sum.amount ?? 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-4">Recent Transactions</h2>
            <div className="space-y-2">
              {recentTransactions.length === 0 ? (
                <p className="text-sm font-dm text-muted">No transactions yet.</p>
              ) : (
                recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between text-sm font-dm">
                    <div>
                      <p className="text-[#0a0a0a] font-medium">{tx.user.name ?? tx.user.email}</p>
                      <p className="text-xs text-muted">{tx.type.replace("_", " ")}</p>
                    </div>
                    <p className="text-brand font-medium">{formatCurrency(tx.amount)}</p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
