"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  subject: z.string().min(5, "Subject is too short"),
  body: z.string().min(20, "Please provide more detail"),
});

type FormData = z.infer<typeof schema>;

export default function ContactCounselorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, toAdmin: true }),
      });

      if (!res.ok) {
        toast.error("Failed to send message");
        return;
      }

      setSubmitted(true);
      toast.success("Message sent to counselor!");
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <CheckCircle className="w-8 h-8 text-brand mb-2" />
        <p className="text-sm font-dm font-medium text-[#0a0a0a]">Message sent!</p>
        <p className="text-xs font-dm text-muted mt-1">Check your messages for a reply.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input
        label="Subject"
        id="subject"
        placeholder="e.g. Visa question for UK"
        error={errors.subject?.message}
        {...register("subject")}
      />
      <Textarea
        label="Your Message"
        id="body"
        rows={4}
        placeholder="Describe what you need help with..."
        error={errors.body?.message}
        {...register("body")}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Send to Counselor
      </Button>
    </form>
  );
}
