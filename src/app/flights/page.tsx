import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import KiwiWidget from "./KiwiWidget";
import FlightEnquiryForm from "./FlightEnquiryForm";

export const metadata = { title: "Book My Flight" };

export default async function FlightsPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/flights");

  const kiwiAffiliateId = process.env.NEXT_PUBLIC_KIWI_AFFILIATE_ID;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-brand text-sm font-dm font-medium uppercase tracking-widest mb-2">Travel</p>
        <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-[#0a0a0a] mb-3">Book My Flight</h1>
        <p className="text-muted font-dm text-base max-w-xl">
          Find and book affordable flights to your university destination. Compare hundreds of airlines instantly.
        </p>
      </div>

      {kiwiAffiliateId ? (
        <>
          <div className="bg-white rounded-2xl border border-black/10 p-6 mb-10">
            <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-4">Search Flights</h2>
            <KiwiWidget affiliateId={kiwiAffiliateId} />
          </div>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-black/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-page text-sm font-dm text-muted">or use our enquiry form</span>
            </div>
          </div>
        </>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-black/10 p-8">
          <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-2">Flight Enquiry</h2>
          <p className="text-sm font-dm text-muted mb-6">
            Tell us where you&apos;re going and we&apos;ll help you find the best options.
          </p>
          <FlightEnquiryForm userId={session.user.id} />
        </div>

        <div className="bg-brand-dark rounded-2xl p-8 text-white">
          <h3 className="font-syne font-extrabold text-xl mb-4">Travel Tips for Students</h3>
          <ul className="space-y-3">
            {[
              "Book at least 8-12 weeks before your start date for best prices",
              "Check if your university has a term-start discount with airlines",
              "Consider flying into nearby airports for cheaper fares",
              "Most countries allow up to 2 checked bags on student visas — verify your allowance",
              "Travel insurance is required by many universities",
              "Join student fare programmes (Student Universe, STA Travel)",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm font-dm text-white/70">
                <span className="text-brand mt-0.5 flex-shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
