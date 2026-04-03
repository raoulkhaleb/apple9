"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

const schema = z.object({
  origin: z.string().min(2, "Enter your departure city or country"),
  destination: z.string().min(2, "Enter your destination"),
  departDate: z.string().min(1, "Select a departure date"),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(10),
});

type FormData = z.infer<typeof schema>;

export default function FlightEnquiryForm({ userId }: { userId: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { passengers: 1 },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    try {
      const res = await fetch("/api/flights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        toast.error("Submission failed. Please try again.");
        return;
      }

      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-14 h-14 bg-brand-light rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-7 h-7 text-brand" />
        </div>
        <h3 className="font-syne font-extrabold text-xl text-[#0a0a0a] mb-2">Enquiry Received!</h3>
        <p className="text-sm font-dm text-muted">
          Our travel team will reach out via your messages within 24 hours with flight options.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="From (city or country)"
        id="origin"
        placeholder="e.g. Lagos, Nigeria"
        error={errors.origin?.message}
        {...register("origin")}
      />
      <Input
        label="To (city or country)"
        id="destination"
        placeholder="e.g. London, United Kingdom"
        error={errors.destination?.message}
        {...register("destination")}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Departure Date"
          id="departDate"
          type="date"
          error={errors.departDate?.message}
          {...register("departDate")}
        />
        <Input
          label="Return Date (optional)"
          id="returnDate"
          type="date"
          {...register("returnDate")}
        />
      </div>
      <Input
        label="Passengers"
        id="passengers"
        type="number"
        min={1}
        max={10}
        error={errors.passengers?.message}
        {...register("passengers", { valueAsNumber: true })}
      />
      <Button type="submit" className="w-full" isLoading={isLoading}>
        Submit Enquiry
      </Button>
    </form>
  );
}
