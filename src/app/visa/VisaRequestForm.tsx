"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Upload, X, FileText } from "lucide-react";

const schema = z.object({
  country: z.string().min(2, "Please enter destination country"),
  userNotes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof schema>;

interface UploadedFile {
  name: string;
  path: string;
  size: number;
}

export default function VisaRequestForm({ userId }: { userId: string }) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length === 0) return;

    setUploading(true);
    const newFiles: UploadedFile[] = [];

    for (const file of selected) {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error ?? `Failed to upload ${file.name}`);
          continue;
        }

        // Upload directly to Supabase signed URL
        const uploadRes = await fetch(data.signedUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) {
          toast.error(`Upload failed for ${file.name}`);
          continue;
        }

        newFiles.push({ name: file.name, path: data.path, size: file.size });
        toast.success(`${file.name} uploaded`);
      } catch {
        toast.error(`Error uploading ${file.name}`);
      }
    }

    setFiles((prev) => [...prev, ...newFiles]);
    setUploading(false);
    e.target.value = "";
  }

  function removeFile(path: string) {
    setFiles((prev) => prev.filter((f) => f.path !== path));
  }

  async function onSubmit(data: FormData) {
    if (files.length === 0) {
      toast.error("Please upload at least one document");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/visa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: data.country,
          userNotes: data.userNotes,
          documentUrls: files.map((f) => f.path),
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Submission failed");
        return;
      }

      // Redirect to Stripe payment
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "VISA_SERVICE", visaRequestId: json.visaRequest.id }),
      });

      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) {
        toast.error(checkoutData.error ?? "Payment setup failed");
        return;
      }

      window.location.href = checkoutData.url;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Destination Country"
        id="country"
        placeholder="e.g. United Kingdom, Canada, Germany"
        error={errors.country?.message}
        {...register("country")}
      />

      <div>
        <label className="text-sm font-medium text-[#0a0a0a] font-dm block mb-2">
          Upload Documents
        </label>

        <label className="flex flex-col items-center justify-center h-32 border border-dashed border-black/20 rounded-xl cursor-pointer hover:border-brand hover:bg-brand-light/20 transition-colors">
          <Upload className="w-6 h-6 text-muted mb-2" />
          <span className="text-sm font-dm text-muted">Click to upload files</span>
          <span className="text-xs font-dm text-muted mt-1">PDF, JPG, PNG — max 10MB each</span>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>

        {uploading && (
          <p className="text-xs font-dm text-brand mt-2">Uploading...</p>
        )}

        {files.length > 0 && (
          <ul className="mt-3 space-y-2">
            {files.map((f) => (
              <li key={f.path} className="flex items-center gap-2 bg-brand-light/30 rounded-lg px-3 py-2">
                <FileText className="w-4 h-4 text-brand flex-shrink-0" />
                <span className="text-xs font-dm text-[#0a0a0a] flex-1 truncate">{f.name}</span>
                <button type="button" onClick={() => removeFile(f.path)} className="text-muted hover:text-red-500 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Textarea
        label="Additional Notes (optional)"
        id="userNotes"
        rows={3}
        placeholder="Any specific requirements or questions for our visa agents..."
        {...register("userNotes")}
      />

      <div className="bg-brand-light rounded-xl p-4">
        <p className="text-sm font-dm text-brand font-medium mb-1">$5 Processing Fee</p>
        <p className="text-xs font-dm text-brand/70">
          You&apos;ll be redirected to pay after submitting. Your documents are saved securely.
        </p>
      </div>

      <Button type="submit" size="lg" className="w-full" isLoading={isLoading || uploading}>
        Submit & Pay $5
      </Button>
    </form>
  );
}
