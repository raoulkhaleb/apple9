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

const schema = z.object({
  subject: z.string().min(3, "Subject required"),
  body: z.string().min(10, "Message body required"),
});

type FormData = z.infer<typeof schema>;

export default function BroadcastForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, broadcast: true }),
      });

      if (!res.ok) {
        toast.error("Failed to send broadcast");
        return;
      }

      toast.success("Broadcast sent to all users!");
      reset();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Subject"
        id="subject"
        placeholder="e.g. New scholarships available!"
        error={errors.subject?.message}
        {...register("subject")}
      />
      <Textarea
        label="Message"
        id="body"
        rows={6}
        placeholder="Write your announcement here..."
        error={errors.body?.message}
        {...register("body")}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Send to All Users
      </Button>
    </form>
  );
}
