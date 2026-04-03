export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { anthropic, COUNSELOR_SYSTEM_PROMPT } from "@/lib/anthropic";
import { z } from "zod";

const MessageSchema = z.array(
  z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1).max(4000),
  })
);

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return new Response("Unauthorized", { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = MessageSchema.safeParse((body as { messages?: unknown }).messages);
  if (!parsed.success || parsed.data.length === 0) {
    return new Response("Invalid messages", { status: 400 });
  }

  // Limit history to last 10 messages to control cost
  const messages = parsed.data.slice(-10);

  try {
    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: COUNSELOR_SYSTEM_PROMPT,
      messages,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === "content_block_delta" &&
              chunk.delta.type === "text_delta"
            ) {
              const data = JSON.stringify({ text: chunk.delta.text });
              controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
