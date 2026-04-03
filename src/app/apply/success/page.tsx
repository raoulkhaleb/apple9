import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Application Submitted" };

export default function ApplySuccessPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-black/10 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-brand" />
        </div>
        <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-3">Application Submitted!</h1>
        <p className="text-sm font-dm text-muted mb-8">
          Your application has been received and payment confirmed. Our team will review it and be in touch via your messages.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/apply">
            <Button className="w-full">Browse More Colleges</Button>
          </Link>
          <Link href="/messages">
            <Button variant="outline" className="w-full">Check Messages</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
