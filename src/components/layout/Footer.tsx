import Link from "next/link";
import { GraduationCap } from "lucide-react";

const footerLinks = {
  Platform: [
    { href: "/apply", label: "Find Colleges" },
    { href: "/scholarships", label: "Scholarships" },
    { href: "/visa", label: "Visa Help" },
    { href: "/flights", label: "Book Flight" },
    { href: "/ai-counseling", label: "AI Counselor" },
  ],
  Company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/partners", label: "Partners" },
    { href: "/blog", label: "Blog" },
  ],
  Legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Policy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-syne font-800 text-xl">Apple 9</span>
            </Link>
            <p className="text-white/60 text-sm font-dm leading-relaxed">
              Your all-in-one platform for finding colleges worldwide, navigating visas, and building your future.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-syne font-800 text-sm uppercase tracking-widest text-white/40 mb-4">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-dm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-dm text-white/40">
            &copy; {new Date().getFullYear()} Apple 9. All rights reserved.
          </p>
          <p className="text-sm font-dm text-white/40">
            Helping students reach their global potential
          </p>
        </div>
      </div>
    </footer>
  );
}
