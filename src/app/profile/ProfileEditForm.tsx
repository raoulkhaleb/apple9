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
  name: z.string().min(2),
  phone: z.string().optional(),
  nationality: z.string().optional(),
  bio: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    nationality: string | null;
    bio: string | null;
  };
}

export default function ProfileEditForm({ user }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name ?? "",
      phone: user.phone ?? "",
      nationality: user.nationality ?? "",
      bio: user.bio ?? "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();
      toast.success("Profile updated");
      router.refresh();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Input label="Full Name" id="name" error={errors.name?.message} {...register("name")} />
      <Input label="Email" id="email" value={user.email} disabled className="opacity-60" readOnly />
      <Input label="Phone" id="phone" placeholder="+1 234 567 8900" {...register("phone")} />
      <Input label="Nationality" id="nationality" placeholder="e.g. Nigerian" {...register("nationality")} />
      <div className="sm:col-span-2">
        <Textarea label="Bio" id="bio" rows={4} placeholder="Tell us a bit about yourself..." {...register("bio")} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" isLoading={isLoading}>Save Changes</Button>
      </div>
    </form>
  );
}
