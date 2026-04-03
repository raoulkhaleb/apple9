"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

interface Props {
  countries: string[];
}

export default function CollegeFilters({ countries }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/apply?${params.toString()}`);
    },
    [router, searchParams]
  );

  function clearFilters() {
    router.push("/apply");
  }

  return (
    <div className="bg-white rounded-xl border border-black/10 p-5 space-y-5">
      <h3 className="font-syne font-extrabold text-base text-[#0a0a0a]">Filters</h3>

      {/* Search */}
      <div>
        <label className="text-xs font-dm font-medium text-muted uppercase tracking-wider mb-2 block">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            placeholder="University name..."
            defaultValue={searchParams.get("q") ?? ""}
            onChange={(e) => updateParam("q", e.target.value)}
            className="h-10 w-full rounded-lg border border-black/15 bg-white pl-9 pr-3 text-sm font-dm text-[#0a0a0a] placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
          />
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="text-xs font-dm font-medium text-muted uppercase tracking-wider mb-2 block">Country</label>
        <select
          className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm font-dm text-[#0a0a0a] focus:outline-none focus:ring-2 focus:ring-brand"
          defaultValue={searchParams.get("country") ?? ""}
          onChange={(e) => updateParam("country", e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Tuition Range */}
      <div>
        <label className="text-xs font-dm font-medium text-muted uppercase tracking-wider mb-2 block">Tuition Range (USD/yr)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={searchParams.get("minTuition") ?? ""}
            onChange={(e) => updateParam("minTuition", e.target.value)}
            className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-brand"
          />
          <input
            type="number"
            placeholder="Max"
            defaultValue={searchParams.get("maxTuition") ?? ""}
            onChange={(e) => updateParam("maxTuition", e.target.value)}
            className="h-10 w-full rounded-lg border border-black/15 bg-white px-3 text-sm font-dm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>

      {/* Scholarship */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            defaultChecked={searchParams.get("scholarship") === "true"}
            onChange={(e) => updateParam("scholarship", e.target.checked ? "true" : "")}
            className="w-4 h-4 rounded border-black/20 accent-brand"
          />
          <span className="text-sm font-dm text-[#0a0a0a]">Scholarship Available</span>
        </label>
      </div>

      <Button variant="ghost" size="sm" className="w-full" onClick={clearFilters}>
        Clear Filters
      </Button>
    </div>
  );
}
