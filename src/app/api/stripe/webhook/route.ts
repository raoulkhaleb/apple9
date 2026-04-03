import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { userId, type, applicationId, visaRequestId } = session.metadata ?? {};

        if (type === "COLLEGE_APP" && applicationId) {
          await prisma.$transaction([
            prisma.application.update({
              where: { id: applicationId },
              data: {
                paymentStatus: "PAID",
                stripePaymentId: session.payment_intent as string,
              },
            }),
            prisma.transaction.create({
              data: {
                userId,
                type: "COLLEGE_APP",
                amount: 3.0,
                stripeId: session.payment_intent as string,
                status: "COMPLETED",
                metadata: { sessionId: session.id, applicationId },
              },
            }),
          ]);
        }

        if (type === "VISA_SERVICE" && visaRequestId) {
          await prisma.$transaction([
            prisma.visaRequest.update({
              where: { id: visaRequestId },
              data: {
                paymentStatus: "PAID",
                stripePaymentId: session.payment_intent as string,
                status: "SUBMITTED",
              },
            }),
            prisma.transaction.create({
              data: {
                userId,
                type: "VISA_SERVICE",
                amount: 5.0,
                stripeId: session.payment_intent as string,
                status: "COMPLETED",
                metadata: { sessionId: session.id, visaRequestId },
              },
            }),
          ]);
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { type, applicationId, visaRequestId } = session.metadata ?? {};

        if (type === "COLLEGE_APP" && applicationId) {
          await prisma.application.update({
            where: { id: applicationId },
            data: { paymentStatus: "FAILED" },
          });
        }

        if (type === "VISA_SERVICE" && visaRequestId) {
          await prisma.visaRequest.update({
            where: { id: visaRequestId },
            data: { paymentStatus: "FAILED" },
          });
        }

        break;
      }
    }
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response("Webhook processing failed", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
