import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText, Shield, Clock, Users } from "lucide-react";
import VisaRequestForm from "./VisaRequestForm";

export const metadata = { title: "Visa Assistance" };

const features = [
  {
    icon: Shield,
    title: "No Physical Presence",
    description: "Complete your entire visa process online — upload documents, communicate with agents, all from home.",
  },
  {
    icon: Users,
    title: "Expert Agent Network",
    description: "Matched with experienced visa agents who know the requirements for your destination country.",
  },
  {
    icon: Clock,
    title: "Managed Waitlist",
    description: "Join our organised queue and know your position. We handle everything in order.",
  },
];

export default async function VisaPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/visa");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-brand text-sm font-dm font-medium uppercase tracking-widest mb-2">Visa Support</p>
        <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-[#0a0a0a] mb-3">
          Visa Assistance
        </h1>
        <p className="text-muted font-dm text-base max-w-xl">
          Get your student visa handled by expert agents. Upload your documents, join the queue, and we&apos;ll keep you updated every step of the way.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-xl border border-black/10 p-5 flex gap-4">
            <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center flex-shrink-0">
              <f.icon className="w-5 h-5 text-brand" />
            </div>
            <div>
              <h3 className="font-syne font-extrabold text-sm text-[#0a0a0a] mb-1">{f.title}</h3>
              <p className="text-xs font-dm text-muted leading-relaxed">{f.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-black/10 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand" />
              </div>
              <div>
                <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a]">Submit Visa Request</h2>
                <p className="text-xs font-dm text-muted">$5 processing fee — paid after document upload</p>
              </div>
            </div>
            <VisaRequestForm userId={session.user.id} />
          </div>
        </div>

        <div>
          <div className="bg-brand-dark rounded-2xl p-6 text-white">
            <h3 className="font-syne font-extrabold text-lg mb-4">Required Documents</h3>
            <ul className="space-y-2 text-sm font-dm text-white/70">
              {[
                "Valid passport (data page)",
                "Acceptance letter from institution",
                "Proof of funds / bank statement",
                "Passport-sized photographs",
                "Academic transcripts",
                "Health insurance certificate",
                "Visa application form (we provide)",
              ].map((doc) => (
                <li key={doc} className="flex items-start gap-2">
                  <span className="text-brand mt-0.5">•</span>
                  {doc}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-dm text-white/50">
              Requirements vary by country. Our agents will confirm exact documents needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
