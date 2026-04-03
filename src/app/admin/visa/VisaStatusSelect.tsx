"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { VisaStatus } from "@prisma/client";

const statuses: VisaStatus[] = [
  "SUBMITTED",
  "DOCUMENTS_REQUIRED",
  "PROCESSING",
  "APPROVED",
  "REJECTED",
  "ON_WAITLIST",
];

export default function VisaStatusSelect({
  visaRequestId,
  currentStatus,
}: {
  visaRequestId: string;
  currentStatus: VisaStatus;
}) {
  const [status, setStatus] = useState<VisaStatus>(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: VisaStatus) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/visa`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visaRequestId, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setStatus(newStatus);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as VisaStatus)}
      disabled={saving}
      className="h-8 rounded-lg border border-black/15 bg-white px-2 text-xs font-dm focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  );
}
