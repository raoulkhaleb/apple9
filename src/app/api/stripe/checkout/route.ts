import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CollegeSchema = z.object({
  type: z.literal("COLLEGE_APP"),
  collegeId: z.string(),
});

const VisaSchema = z.object({
  type: z.literal("VISA_SERVICE"),
  visaRequestId: z.string(),
});

const Schema = z.discriminatedUnion("type", [CollegeSchema, VisaSchema]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const baseUrl = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";

  try {
    if (parsed.data.type === "COLLEGE_APP") {
      const { collegeId } = parsed.data;

      const college = await prisma.college.findUnique({ where: { id: collegeId } });
      if (!college) return NextResponse.json({ error: "College not found" }, { status: 404 });

      // Upsert application
      const application = await prisma.application.upsert({
        where: { userId_collegeId: { userId: session.user.id, collegeId } },
        create: { userId: session.user.id, collegeId, paymentStatus: "UNPAID" },
        update: { paymentStatus: "UNPAID" },
      });

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 300,
              product_data: {
                name: `College Application — ${college.name}`,
                description: "One-time application processing fee",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
          collegeId,
          applicationId: application.id,
          type: "COLLEGE_APP",
        },
        success_url: `${baseUrl}/apply/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/apply/${collegeId}`,
      });

      await prisma.application.update({
        where: { id: application.id },
        data: { stripeSessionId: checkoutSession.id },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    if (parsed.data.type === "VISA_SERVICE") {
      const { visaRequestId } = parsed.data;

      const visaRequest = await prisma.visaRequest.findFirst({
        where: { id: visaRequestId, userId: session.user.id },
      });
      if (!visaRequest) return NextResponse.json({ error: "Visa request not found" }, { status: 404 });

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: 500,
              product_data: {
                name: `Visa Assistance — ${visaRequest.country}`,
                description: "Visa application processing and agent support",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
          visaRequestId,
          type: "VISA_SERVICE",
        },
        success_url: `${baseUrl}/visa/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/visa`,
      });

      await prisma.visaRequest.update({
        where: { id: visaRequestId },
        data: { stripeSessionId: checkoutSession.id },
      });

      return NextResponse.json({ url: checkoutSession.url });
    }
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
