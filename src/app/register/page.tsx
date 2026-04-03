"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { GraduationCap, CheckCircle } from "lucide-react";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type FormData = z.infer<typeof schema>;

const benefits = [
  "Browse 2,400+ universities worldwide",
  "AI-powered college counseling",
  "Visa assistance & document management",
  "Scholarship discovery tools",
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Registration failed");
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      } else {
        toast.success("Welcome to Apple 9!");
        router.push("/");
        router.refresh();
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Form side */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-black/10 p-8">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-syne font-extrabold text-xl text-[#0a0a0a]">Apple 9</span>
            </div>

            <h1 className="font-syne font-extrabold text-2xl text-[#0a0a0a] mb-1">Create your account</h1>
            <p className="text-sm font-dm text-muted mb-6">Start your journey to global education</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Full Name"
                id="name"
                placeholder="Jane Smith"
                autoComplete="name"
                error={errors.name?.message}
                {...register("name")}
              />
              <Input
                label="Email"
                type="email"
                id="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
                {...register("email")}
              />
              <Input
                label="Password"
                type="password"
                id="password"
                placeholder="Min. 8 characters"
                error={errors.password?.message}
                {...register("password")}
              />
              <Input
                label="Confirm Password"
                type="password"
                id="confirm"
                placeholder="Repeat password"
                error={errors.confirm?.message}
                {...register("confirm")}
              />

              <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm font-dm text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-brand font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Benefits side */}
      <div className="hidden lg:flex bg-brand-dark flex-col items-center justify-center px-16">
        <div className="max-w-sm">
          <h2 className="font-syne font-extrabold text-4xl text-white mb-8">
            Your future starts here.
          </h2>
          <div className="space-y-4">
            {benefits.map((b) => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-brand/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-brand" />
                </div>
                <p className="text-sm font-dm text-white/80">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
