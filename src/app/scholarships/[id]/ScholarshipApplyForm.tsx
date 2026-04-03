"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const schema = z.object({
  essay: z.string().min(100, "Essay must be at least 100 characters").max(2000),
});

type FormData = z.infer<typeof schema>;

interface Props {
  scholarshipId: string;
  existingApp: { id: string; status: string } | null;
  isLoggedIn: boolean;
}

export default function ScholarshipApplyForm({ scholarshipId, existingApp, isLoggedIn }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  if (!isLoggedIn) {
    return (
      <Button className="w-full" onClick={() => router.push(`/login?callbackUrl=/scholarships/${scholarshipId}`)}>
        Sign In to Apply
      </Button>
    );
  }

  if (existingApp) {
    return (
      <div className="space-y-2">
        <Badge variant="success" className="w-full justify-center py-2">Application Submitted</Badge>
        <p className="text-xs text-center font-dm text-muted">Status: {existingApp.status.replace("_", " ")}</p>
      </div>
    );
  }

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scholarshipId, essay: data.essay }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Submission failed");
        return;
      }

      toast.success("Application submitted!");
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Textarea
        label="Personal Essay"
        id="essay"
        rows={6}
        placeholder="Tell us why you deserve this scholarship (min. 100 characters)..."
        error={errors.essay?.message}
        {...register("essay")}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Submit Application
      </Button>
      <p className="text-xs font-dm text-muted text-center">Free to apply — no payment required</p>
    </form>
  );
}
