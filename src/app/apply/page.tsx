import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { MapPin, GraduationCap, Award, ArrowRight, Search } from "lucide-react";
import CollegeFilters from "./CollegeFilters";

export const metadata = { title: "Find Colleges" };

interface SearchParams {
  q?: string;
  country?: string;
  program?: string;
  minTuition?: string;
  maxTuition?: string;
  scholarship?: string;
}

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const colleges = await prisma.college.findMany({
    where: {
      active: true,
      ...(params.country && { country: params.country }),
      ...(params.scholarship === "true" && { scholarshipAvailable: true }),
      ...(params.minTuition || params.maxTuition
        ? {
            tuitionMin: { lte: params.maxTuition ? Number(params.maxTuition) : undefined },
            tuitionMax: { gte: params.minTuition ? Number(params.minTuition) : undefined },
          }
        : {}),
      ...(params.q && {
        OR: [
          { name: { contains: params.q, mode: "insensitive" } },
          { country: { contains: params.q, mode: "insensitive" } },
          { city: { contains: params.q, mode: "insensitive" } },
          { programs: { has: params.q } },
        ],
      }),
      ...(params.program && { programs: { has: params.program } }),
    },
    orderBy: [{ featured: "desc" }, { ranking: "asc" }, { name: "asc" }],
    take: 60,
  });

  const countries = await prisma.college.findMany({
    where: { active: true },
    select: { country: true },
    distinct: ["country"],
    orderBy: { country: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <p className="text-brand text-sm font-dm font-medium uppercase tracking-widest mb-2">College Directory</p>
        <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-[#0a0a0a] mb-3">
          Find Your College
        </h1>
        <p className="text-muted font-dm text-base max-w-xl">
          Browse {colleges.length}+ universities worldwide. Filter by location, programs, tuition, and scholarship availability.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <CollegeFilters countries={countries.map((c) => c.country)} />
        </aside>

        {/* Results */}
        <div className="flex-1">
          {colleges.length === 0 ? (
            <div className="bg-white rounded-xl border border-black/10 p-12 text-center">
              <Search className="w-12 h-12 text-muted mx-auto mb-4" />
              <h3 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-2">No colleges found</h3>
              <p className="text-sm font-dm text-muted">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {colleges.map((college) => (
                <Link key={college.id} href={`/apply/${college.id}`}>
                  <div className="group bg-white rounded-xl border border-black/10 hover:border-brand/30 transition-all overflow-hidden h-full flex flex-col cursor-pointer">
                    {/* Top color bar */}
                    <div className="h-1.5 bg-brand" />
                    <div className="p-5 flex flex-col flex-1 gap-3">
                      {college.featured && (
                        <Badge variant="default" className="w-fit text-xs">Featured</Badge>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-5 h-5 text-brand" />
                        </div>
                        <div>
                          <h3 className="font-syne font-extrabold text-base text-[#0a0a0a] leading-snug group-hover:text-brand transition-colors">
                            {college.name}
                          </h3>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-muted" />
                            <span className="text-xs font-dm text-muted">{college.city ? `${college.city}, ` : ""}{college.country}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs font-dm text-muted leading-relaxed flex-1 line-clamp-2">
                        {college.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {college.programs.slice(0, 3).map((p) => (
                          <span key={p} className="text-xs font-dm bg-brand-light/60 text-brand px-2 py-0.5 rounded-full">
                            {p}
                          </span>
                        ))}
                        {college.programs.length > 3 && (
                          <span className="text-xs font-dm text-muted">+{college.programs.length - 3}</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-black/5">
                        <div>
                          <p className="text-xs font-dm text-muted">Tuition</p>
                          <p className="text-sm font-dm font-medium text-[#0a0a0a]">
                            {formatCurrency(college.tuitionMin)} – {formatCurrency(college.tuitionMax)}/yr
                          </p>
                        </div>
                        {college.scholarshipAvailable && (
                          <Badge variant="success">
                            <Award className="w-3 h-3" />
                            Scholarship
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1 text-brand text-xs font-dm font-medium group-hover:gap-2 transition-all">
                        Apply Now — $3 <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
