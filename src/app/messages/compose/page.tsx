"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const schema = z.object({
  subject: z.string().min(2, "Subject is required"),
  body: z.string().min(5, "Message body is required"),
});

type FormData = z.infer<typeof schema>;

export default function ComposePage() {
  const router = useRouter();
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

      toast.success("Message sent!");
      router.push("/messages?tab=sent");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/messages" className="inline-flex items-center gap-2 text-sm font-dm text-muted hover:text-brand mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Messages
      </Link>

      <div className="bg-white rounded-2xl border border-black/10 p-8">
        <h1 className="font-syne font-extrabold text-2xl text-[#0a0a0a] mb-6">New Message</h1>
        <p className="text-sm font-dm text-muted mb-6">Your message will be sent to an Apple 9 counselor.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Subject"
            id="subject"
            placeholder="e.g. Question about my visa application"
            error={errors.subject?.message}
            {...register("subject")}
          />
          <Textarea
            label="Message"
            id="body"
            rows={8}
            placeholder="Write your message here..."
            error={errors.body?.message}
            {...register("body")}
          />
          <div className="flex gap-3">
            <Button type="submit" isLoading={isLoading}>Send Message</Button>
            <Link href="/messages">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
