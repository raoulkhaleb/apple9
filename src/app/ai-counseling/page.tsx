import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChatWidget from "./ChatWidget";
import ContactCounselorForm from "./ContactCounselorForm";

export const metadata = { title: "AI Counselor" };

export default async function AICounselingPage() {
  const session = await auth();
  if (!session) redirect("/login?callbackUrl=/ai-counseling");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-brand text-sm font-dm font-medium uppercase tracking-widest mb-2">AI-Powered Help</p>
        <h1 className="font-syne font-extrabold text-4xl sm:text-5xl text-[#0a0a0a] mb-3">
          Your AI College Counselor
        </h1>
        <p className="text-muted font-dm text-base max-w-xl">
          Get instant answers about college admissions, student visas, scholarships, and life abroad — powered by Claude AI.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chat — takes 2/3 */}
        <div className="xl:col-span-2">
          <ChatWidget userName={session.user.name ?? "Student"} />
        </div>

        {/* Contact counselor form */}
        <div>
          <div className="bg-white rounded-2xl border border-black/10 p-6 mb-5">
            <h2 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-2">Talk to a Human</h2>
            <p className="text-sm font-dm text-muted mb-5">
              Need personalised advice? Our counselors are here. Send a message and we&apos;ll get back to you.
            </p>
            <ContactCounselorForm />
          </div>

          <div className="bg-brand-dark rounded-2xl p-6 text-white">
            <h3 className="font-syne font-extrabold text-lg mb-3">What to ask</h3>
            <ul className="space-y-2">
              {[
                "Which universities accept a 3.5 GPA in Computer Science?",
                "What documents do I need for a UK student visa?",
                "How do I write a strong personal statement?",
                "Are there scholarships for African students in Germany?",
                "What is the cost of living in Toronto as a student?",
              ].map((q) => (
                <li key={q} className="text-xs font-dm text-white/70 flex items-start gap-2">
                  <span className="text-brand flex-shrink-0">→</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
