import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Visa Request Submitted" };

export default function VisaSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-black/10 p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-brand" />
        </div>
        <h1 className="font-syne font-extrabold text-3xl text-[#0a0a0a] mb-3">Visa Request Received!</h1>
        <p className="text-sm font-dm text-muted mb-8">
          Your documents have been submitted and payment confirmed. A visa agent will review your case and contact you through your messages within 2-3 business days.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/messages">
            <Button className="w-full">Check Messages</Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
