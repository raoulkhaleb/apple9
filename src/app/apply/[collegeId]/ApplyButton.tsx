"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface Props {
  collegeId: string;
  collegeName: string;
  existingApplication: { id: string; status: string; paymentStatus: string } | null;
  isLoggedIn: boolean;
}

export default function ApplyButton({ collegeId, existingApplication, isLoggedIn }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!isLoggedIn) {
    return (
      <Button
        className="w-full"
        size="lg"
        onClick={() => router.push(`/login?callbackUrl=/apply/${collegeId}`)}
      >
        Sign In to Apply
      </Button>
    );
  }

  if (existingApplication) {
    if (existingApplication.paymentStatus === "PAID") {
      return (
        <div className="space-y-2">
          <Badge variant="success" className="w-full justify-center py-2 text-sm">
            Application Submitted
          </Badge>
          <p className="text-xs text-center font-dm text-muted">
            Status: {existingApplication.status.replace("_", " ")}
          </p>
        </div>
      );
    }
    // Unpaid — allow retry
  }

  async function handleApply() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "COLLEGE_APP", collegeId }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong");
        return;
      }

      window.location.href = data.url;
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button className="w-full" size="lg" onClick={handleApply} isLoading={isLoading}>
      Apply Now — $3
    </Button>
  );
}
