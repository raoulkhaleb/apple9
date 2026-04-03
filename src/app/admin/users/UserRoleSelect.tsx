"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import type { Role } from "@prisma/client";

const roles: Role[] = ["STUDENT", "ADMIN", "MEDIA_DIRECTOR"];

export default function UserRoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const [role, setRole] = useState<Role>(currentRole);
  const [saving, setSaving] = useState(false);

  async function handleChange(newRole: Role) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/users`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (!res.ok) throw new Error();
      setRole(newRole);
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={role}
      onChange={(e) => handleChange(e.target.value as Role)}
      disabled={saving}
      className="h-8 rounded-lg border border-black/15 bg-white px-2 text-xs font-dm focus:outline-none focus:ring-2 focus:ring-brand disabled:opacity-50"
    >
      {roles.map((r) => (
        <option key={r} value={r}>
          {r}
        </option>
      ))}
    </select>
  );
}
