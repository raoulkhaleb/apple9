"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { ApplicationStatus } from "@prisma/client";

const statuses: ApplicationStatus[] = [
  "PENDING",
  "UNDER_REVIEW",
  "ACCEPTED",
  "REJECTED",
  "WAITLISTED",
];

export default function ApplicationStatusSelect({
  applicationId,
  currentStatus,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
}) {
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [saving, setSaving] = useState(false);

  async function handleChange(newStatus: ApplicationStatus) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/applications`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: newStatus }),
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
      onChange={(e) => handleChange(e.target.value as ApplicationStatus)}
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
