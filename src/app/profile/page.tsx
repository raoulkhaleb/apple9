export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import ProfileEditForm from "./ProfileEditForm";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, image: true, role: true,
      phone: true, nationality: true, dateOfBirth: true, bio: true, createdAt: true,
      _count: { select: { applications: true, visaRequests: true, scholarshipApplications: true } },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a]">My Profile</h1>
          <p className="text-sm font-dm text-muted mt-1">Member since {formatDate(user.createdAt)}</p>
        </div>
        <Badge variant={user.role === "ADMIN" ? "dark" : user.role === "MEDIA_DIRECTOR" ? "warning" : "default"}>
          {user.role}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Applications", value: user._count.applications },
          { label: "Visa Requests", value: user._count.visaRequests },
          { label: "Scholarships", value: user._count.scholarshipApplications },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="text-center">
              <p className="font-syne font-extrabold text-3xl text-brand">{stat.value}</p>
              <p className="text-xs font-dm text-muted mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a]">Personal Information</h2>
        </CardHeader>
        <CardContent>
          <ProfileEditForm user={user} />
        </CardContent>
      </Card>
    </div>
  );
}
