export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Globe, Mail } from "lucide-react";
import AddPartnershipForm from "./AddPartnershipForm";

export const metadata = { title: "Media & Partners" };

export default async function AdminMediaPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN" && session?.user.role !== "MEDIA_DIRECTOR") notFound();

  const partnerships = await prisma.partnership.findMany({
    orderBy: { createdAt: "desc" },
  });

  const activeCount = partnerships.filter((p) => p.active).length;

  return (
    <div>
      <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-8">Media & Partnerships</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Partners", value: partnerships.length },
          { label: "Active", value: activeCount },
          { label: "Sponsors", value: partnerships.filter((p) => p.type === "SPONSOR").length },
          { label: "Universities", value: partnerships.filter((p) => p.type === "UNIVERSITY").length },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="text-center py-4">
              <p className="font-syne font-extrabold text-2xl text-brand">{s.value}</p>
              <p className="text-xs font-dm text-muted mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Partnership list */}
        <div className="xl:col-span-2">
          <Card>
            <CardContent>
              <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-4">All Partners</h2>
              {partnerships.length === 0 ? (
                <p className="text-sm font-dm text-muted">No partnerships yet. Add one below.</p>
              ) : (
                <div className="space-y-3">
                  {partnerships.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-4 p-3 rounded-xl border border-black/10"
                    >
                      <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="font-syne font-extrabold text-sm text-brand">
                          {p.name[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-dm font-medium text-sm text-[#0a0a0a]">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge variant="muted" className="text-xs">{p.type}</Badge>
                          {!p.active && <Badge variant="danger" className="text-xs">Inactive</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        {p.website && (
                          <a
                            href={p.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted hover:text-brand transition-colors"
                          >
                            <Globe className="w-4 h-4" />
                          </a>
                        )}
                        {p.contactEmail && (
                          <a
                            href={`mailto:${p.contactEmail}`}
                            className="text-muted hover:text-brand transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add partnership form */}
        <div>
          <Card>
            <CardContent>
              <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-4">Add Partner</h2>
              <AddPartnershipForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
