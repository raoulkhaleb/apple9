import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Calendar, MapPin, Award } from "lucide-react";
import ScholarshipApplyForm from "./ScholarshipApplyForm";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const s = await prisma.scholarshipProgram.findUnique({ where: { id }, select: { name: true } });
  return { title: s?.name ?? "Scholarship" };
}

export default async function ScholarshipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const scholarship = await prisma.scholarshipProgram.findUnique({ where: { id, active: true } });
  if (!scholarship) notFound();

  let existingApp = null;
  if (session) {
    existingApp = await prisma.scholarshipApplication.findUnique({
      where: { userId_scholarshipId: { userId: session.user.id, scholarshipId: id } },
      select: { id: true, status: true },
    });
  }

  const isOpen = scholarship.deadline > new Date();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-2xl border border-black/10 p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-14 h-14 bg-brand-light rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="w-7 h-7 text-brand" />
          </div>
          <div className="flex-1">
            <Badge variant={isOpen ? "success" : "muted"} className="mb-2">{isOpen ? "Open" : "Closed"}</Badge>
            <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-[#0a0a0a] mb-2">{scholarship.name}</h1>
            <p className="text-sm font-dm text-muted">{scholarship.provider}</p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm font-dm text-muted">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Deadline: {formatDate(scholarship.deadline)}
              </span>
              {scholarship.country && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {scholarship.country}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="font-syne font-extrabold text-3xl text-brand">
              {formatCurrency(scholarship.amount, scholarship.currency)}
            </p>
            <p className="text-xs font-dm text-muted">award value</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-3">About this Scholarship</h2>
              <p className="text-sm font-dm text-[#0a0a0a] leading-relaxed">{scholarship.description}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-3">Eligibility</h2>
              <p className="text-sm font-dm text-[#0a0a0a] leading-relaxed">{scholarship.eligibility}</p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent>
              <h3 className="font-syne font-extrabold text-lg text-[#0a0a0a] mb-4">Apply for this Scholarship</h3>
              {isOpen ? (
                <ScholarshipApplyForm
                  scholarshipId={id}
                  existingApp={existingApp}
                  isLoggedIn={!!session}
                />
              ) : (
                <p className="text-sm font-dm text-muted">This scholarship is no longer accepting applications.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
