"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const schema = z.object({
  name: z.string().min(2),
  type: z.enum(["UNIVERSITY", "AIRLINE", "EMBASSY", "SPONSOR", "MEDIA"]),
  contactEmail: z.string().email().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddPartnershipForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: "SPONSOR" },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Failed to add partner");
        return;
      }

      toast.success("Partner added!");
      reset();
      router.refresh();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <Input label="Name" id="name" placeholder="Partner name" error={errors.name?.message} {...register("name")} />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#0a0a0a] font-dm">Type</label>
        <select
          {...register("type")}
          className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-brand"
        >
          {["UNIVERSITY", "AIRLINE", "EMBASSY", "SPONSOR", "MEDIA"].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <Input label="Contact Email" id="contactEmail" type="email" placeholder="contact@partner.com" {...register("contactEmail")} />
      <Input label="Website" id="website" type="url" placeholder="https://partner.com" {...register("website")} />

      <Button type="submit" className="w-full" isLoading={isLoading}>Add Partner</Button>
    </form>
  );
}
