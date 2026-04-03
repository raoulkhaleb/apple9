import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "MEDIA_DIRECTOR")) {
    redirect("/");
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <AdminSidebar role={session.user.role} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
