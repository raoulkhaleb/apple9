import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { z } from "zod";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const UploadSchema = z.object({
  fileName: z.string().min(1).max(200),
  fileType: z.string(),
  fileSize: z.number().positive(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = UploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { fileName, fileType, fileSize } = parsed.data;

  if (!ALLOWED_TYPES.includes(fileType)) {
    return NextResponse.json(
      { error: "File type not allowed. Use PDF, JPG, or PNG." },
      { status: 400 }
    );
  }

  if (fileSize > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File exceeds 10MB limit." }, { status: 400 });
  }

  // Sanitize filename — strip path traversal and non-alphanumeric chars
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
  const filePath = `${session.user.id}/${Date.now()}-${safeName}`;

  const { data, error } = await supabaseAdmin.storage
    .from("visa-documents")
    .createSignedUploadUrl(filePath);

  if (error || !data) {
    console.error("Supabase upload URL error:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: data.signedUrl,
    path: filePath,
    token: data.token,
  });
}
