import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  GraduationCap,
  Globe,
  FileText,
  Plane,
  Bot,
  Mail,
  ArrowRight,
  Star,
  CheckCircle,
} from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "Find Colleges",
    description: "Browse thousands of universities worldwide filtered by program, tuition, and scholarship availability.",
    href: "/apply",
  },
  {
    icon: Star,
    title: "Scholarships",
    description: "Discover and apply for scholarships and bursary programs that match your profile.",
    href: "/scholarships",
  },
  {
    icon: FileText,
    title: "Visa Assistance",
    description: "Submit visa documents online and get matched with expert agents — no physical presence needed.",
    href: "/visa",
  },
  {
    icon: Plane,
    title: "Book Flights",
    description: "Find affordable flights to your destination. Compare options and book with ease.",
    href: "/flights",
  },
  {
    icon: Bot,
    title: "AI Counselor",
    description: "Chat with our AI-powered counselor for instant answers on admissions, visas, and studying abroad.",
    href: "/ai-counseling",
  },
  {
    icon: Mail,
    title: "Direct Support",
    description: "Message our human counselors and receive personalised guidance directly through the platform.",
    href: "/ai-counseling",
  },
];

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Sign up and tell us about your academic background, interests, and destination preferences.",
  },
  {
    number: "02",
    title: "Explore & Apply",
    description: "Browse matched colleges, compare programs, and submit your applications with expert support.",
  },
  {
    number: "03",
    title: "Handle Visas & Travel",
    description: "Upload visa documents, get partner-agent support, find scholarships, and book your flights.",
  },
];

const stats = [
  { value: "2,400+", label: "Universities" },
  { value: "120+", label: "Countries" },
  { value: "18,000+", label: "Students Helped" },
  { value: "94%", label: "Visa Success Rate" },
];

const testimonials = [
  {
    name: "Amara Osei",
    country: "Ghana → Canada",
    text: "Apple 9 made the entire process seamless. From finding the right university to sorting my study permit — everything was handled in one place.",
    program: "BSc Computer Science, University of Toronto",
  },
  {
    name: "Fatima Al-Rashid",
    country: "Jordan → UK",
    text: "The AI counselor answered every question I had at 2am before my deadline. I got into my first choice!",
    program: "MSc Finance, London School of Economics",
  },
  {
    name: "Kwame Mensah",
    country: "Nigeria → Germany",
    text: "The visa support was incredible. No confusing forms, no agency fees — just straightforward help.",
    program: "MBA, Technical University of Munich",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2">
        {/* Left */}
        <div className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-16 lg:py-0">
          <div className="inline-flex items-center gap-2 bg-brand-light text-brand rounded-full px-3 py-1 text-xs font-dm font-medium mb-6 w-fit">
            <span className="w-1.5 h-1.5 bg-brand rounded-full animate-pulse" />
            Global Education Platform
          </div>

          <h1 className="font-syne text-5xl sm:text-6xl xl:text-7xl font-extrabold text-[#0a0a0a] leading-[1.05] mb-6">
            Your Path to
            <br />
            <span className="text-brand">Global</span>
            <br />
            Education
          </h1>

          <p className="text-lg font-dm text-muted leading-relaxed mb-8 max-w-lg">
            Find the right university anywhere in the world, get your visa sorted, discover scholarships, and book your flight — Apple 9 guides you every step of the way.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link href="/apply">
              <Button size="lg" className="gap-2">
                Find My College
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/ai-counseling">
              <Button variant="outline" size="lg">
                Talk to AI Counselor
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {["Free to browse", "No hidden fees", "Expert guidance"].map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-xs font-dm text-muted">
                <CheckCircle className="w-3.5 h-3.5 text-brand" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Right — dark panel */}
        <div className="hidden lg:flex bg-brand-dark relative overflow-hidden items-center justify-center p-12">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <Globe className="w-72 h-72 text-white/10 absolute" strokeWidth={0.4} />
          <div className="relative z-10 grid grid-cols-2 gap-4 max-w-sm w-full">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5"
              >
                <p className="font-syne font-extrabold text-3xl text-white">{stat.value}</p>
                <p className="text-sm font-dm text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile stats */}
      <section className="lg:hidden bg-brand-dark py-10 px-4">
        <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center py-2">
              <p className="font-syne font-extrabold text-3xl text-white">{stat.value}</p>
              <p className="text-sm font-dm text-white/60 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand text-sm font-dm font-medium uppercase tracking-widest mb-3">Everything you need</p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold text-[#0a0a0a]">
              One Platform,
              <br />
              Endless Possibilities
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => (
              <Link key={service.title} href={service.href}>
                <div className="group bg-white rounded-xl border border-black/10 p-6 hover:border-brand/30 hover:bg-brand-light/30 transition-all cursor-pointer h-full">
                  <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand transition-colors">
                    <service.icon className="w-5 h-5 text-brand group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-syne font-extrabold text-lg text-[#0a0a0a] mb-2">{service.title}</h3>
                  <p className="text-sm font-dm text-muted leading-relaxed">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-brand-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-brand text-sm font-dm font-medium uppercase tracking-widest mb-3">Simple process</p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold text-white">How Apple 9 Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step) => (
              <div key={step.number}>
                <div className="text-brand font-syne font-extrabold text-6xl mb-4">{step.number}</div>
                <h3 className="font-syne font-extrabold text-xl text-white mb-3">{step.title}</h3>
                <p className="text-sm font-dm text-white/60 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-brand text-sm font-dm font-medium uppercase tracking-widest mb-3">Real students</p>
            <h2 className="font-syne text-4xl sm:text-5xl font-extrabold text-[#0a0a0a]">Stories That Inspire</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-xl border border-black/10 p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-brand text-brand" />
                  ))}
                </div>
                <p className="text-sm font-dm text-[#0a0a0a] leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-syne font-extrabold text-sm text-[#0a0a0a]">{t.name}</p>
                  <p className="text-xs font-dm text-brand">{t.country}</p>
                  <p className="text-xs font-dm text-muted mt-0.5">{t.program}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-brand">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-syne text-4xl sm:text-5xl font-extrabold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg font-dm text-white/80 mb-8 max-w-xl mx-auto">
            Join thousands of students who found their perfect university and got there with Apple 9.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-0">
                Browse Colleges
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
