import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { MapPin, Globe, Award, Calendar, TrendingUp } from "lucide-react";
import ApplyButton from "./ApplyButton";

export async function generateMetadata({ params }: { params: Promise<{ collegeId: string }> }) {
  const { collegeId } = await params;
  const college = await prisma.college.findUnique({ where: { id: collegeId }, select: { name: true } });
  return { title: college?.name ?? "College" };
}

export default async function CollegeDetailPage({
  params,
}: {
  params: Promise<{ collegeId: string }>;
}) {
  const { collegeId } = await params;
  const session = await auth();

  const college = await prisma.college.findUnique({
    where: { id: collegeId, active: true },
  });

  if (!college) notFound();

  // Check if user already applied
  let existingApplication = null;
  if (session) {
    existingApplication = await prisma.application.findUnique({
      where: { userId_collegeId: { userId: session.user.id, collegeId } },
      select: { id: true, status: true, paymentStatus: true },
    });
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-black/10 p-8 mb-6">
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-16 h-16 bg-brand-light rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="font-syne font-extrabold text-2xl text-brand">
              {college.name[0]}
            </span>
          </div>
          <div className="flex-1">
            {college.featured && <Badge className="mb-2">Featured</Badge>}
            <h1 className="font-syne font-extrabold text-3xl sm:text-4xl text-[#0a0a0a] mb-2">
              {college.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-sm font-dm text-muted">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {college.city ? `${college.city}, ` : ""}{college.country}
              </span>
              {college.website && (
                <a
                  href={college.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-brand hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  Official Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent>
              <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-3">About</h2>
              <p className="text-sm font-dm text-[#0a0a0a] leading-relaxed">{college.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-3">Programs Offered</h2>
              <div className="flex flex-wrap gap-2">
                {college.programs.map((program) => (
                  <span
                    key={program}
                    className="text-sm font-dm bg-brand-light text-brand px-3 py-1 rounded-full"
                  >
                    {program}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Key info */}
          <Card>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs font-dm text-muted uppercase tracking-wider mb-1">Tuition (per year)</p>
                <p className="font-syne font-extrabold text-xl text-[#0a0a0a]">
                  {formatCurrency(college.tuitionMin)} – {formatCurrency(college.tuitionMax)}
                </p>
              </div>

              {college.ranking && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand" />
                  <div>
                    <p className="text-xs font-dm text-muted">World Ranking</p>
                    <p className="text-sm font-dm font-medium text-[#0a0a0a]">#{college.ranking}</p>
                  </div>
                </div>
              )}

              {college.acceptanceRate && (
                <div>
                  <p className="text-xs font-dm text-muted uppercase tracking-wider mb-1">Acceptance Rate</p>
                  <p className="text-sm font-dm font-medium text-[#0a0a0a]">{college.acceptanceRate}%</p>
                </div>
              )}

              {college.applicationDeadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand" />
                  <div>
                    <p className="text-xs font-dm text-muted">Application Deadline</p>
                    <p className="text-sm font-dm font-medium text-[#0a0a0a]">
                      {formatDate(college.applicationDeadline)}
                    </p>
                  </div>
                </div>
              )}

              {college.scholarshipAvailable && (
                <div className="flex items-center gap-2 p-3 bg-brand-light rounded-lg">
                  <Award className="w-4 h-4 text-brand flex-shrink-0" />
                  <p className="text-sm font-dm text-brand">Scholarships available at this institution</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Apply CTA */}
          <Card>
            <CardContent>
              <h3 className="font-syne font-extrabold text-lg text-[#0a0a0a] mb-2">Ready to Apply?</h3>
              <p className="text-xs font-dm text-muted mb-4">
                Submit your application for just $3. Our team will guide you through the rest.
              </p>
              <ApplyButton
                collegeId={collegeId}
                collegeName={college.name}
                existingApplication={existingApplication}
                isLoggedIn={!!session}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
