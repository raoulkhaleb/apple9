import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Calendar, MapPin, Award } from "lucide-react";

export const metadata = { title: "Scholarships" };

export default async function ScholarshipsPage() {
  const scholarships = await prisma.scholarshipProgram.findMany({
    where: { active: true },
    orderBy: { deadline: "asc" },
    include: { _count: { select: { applications: true } } },
  });

  const now = new Date();
  const upcoming = scholarships.filter((s) => s.deadline > now);
  const past = scholarships.filter((s) => s.deadline <= now);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-brand text-sm font-dm font-medium uppercase tracking-widest mb-2">Financial Aid</p>
        <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-[#0a0a0a] mb-3">
          Scholarships & Bursaries
        </h1>
        <p className="text-muted font-dm text-base max-w-xl">
          Discover funding opportunities from governments, institutions, and organisations worldwide.
        </p>
      </div>

      {upcoming.length > 0 && (
        <section className="mb-12">
          <h2 className="font-syne font-extrabold text-2xl text-[#0a0a0a] mb-6">Open Applications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {upcoming.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} open />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="font-syne font-extrabold text-2xl text-[#0a0a0a] mb-6 text-muted">
            Closed / Past Deadlines
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 opacity-60">
            {past.map((s) => (
              <ScholarshipCard key={s.id} scholarship={s} open={false} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ScholarshipCard({
  scholarship,
  open,
}: {
  scholarship: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    deadline: Date;
    country: string | null;
    provider: string;
    description: string;
    _count: { applications: number };
  };
  open: boolean;
}) {
  return (
    <Link href={`/scholarships/${scholarship.id}`}>
      <div className="group bg-white rounded-xl border border-black/10 hover:border-brand/30 transition-all p-6 h-full flex flex-col gap-4 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center">
            <Award className="w-5 h-5 text-brand" />
          </div>
          <Badge variant={open ? "success" : "muted"}>{open ? "Open" : "Closed"}</Badge>
        </div>

        <div className="flex-1">
          <h3 className="font-syne font-extrabold text-base text-[#0a0a0a] group-hover:text-brand transition-colors mb-1">
            {scholarship.name}
          </h3>
          <p className="text-xs font-dm text-muted mb-3">{scholarship.provider}</p>
          <p className="text-xs font-dm text-[#0a0a0a] leading-relaxed line-clamp-2">
            {scholarship.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 pt-3 border-t border-black/5">
          <div className="flex items-center gap-1.5">
            <span className="font-syne font-extrabold text-lg text-brand">
              {formatCurrency(scholarship.amount, scholarship.currency)}
            </span>
          </div>
          {scholarship.country && (
            <div className="flex items-center gap-1 text-xs font-dm text-muted">
              <MapPin className="w-3 h-3" />
              {scholarship.country}
            </div>
          )}
          <div className="flex items-center gap-1 text-xs font-dm text-muted">
            <Calendar className="w-3 h-3" />
            {formatDate(scholarship.deadline)}
          </div>
        </div>
      </div>
    </Link>
  );
}
