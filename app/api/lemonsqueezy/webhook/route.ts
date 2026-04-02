import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Plan } from "@prisma/client";

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

function variantIdToPlan(variantId: string): Plan {
  if (variantId === process.env.LEMONSQUEEZY_PRO_VARIANT_ID) return "PRO";
  if (variantId === process.env.LEMONSQUEEZY_TEAM_VARIANT_ID) return "TEAM";
  return "FREE";
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature || !process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const isValid = verifyWebhookSignature(
      rawBody,
      signature,
      process.env.LEMONSQUEEZY_WEBHOOK_SECRET
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName: string = payload.meta.event_name;
    const attributes = payload.data.attributes;
    const userId: string | undefined = payload.meta.custom_data?.user_id;

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    const subscriptionId = String(payload.data.id);
    const variantId = String(attributes.variant_id);
    const customerId = String(attributes.customer_id);
    const status: string = attributes.status;
    const renewsAt: string | null = attributes.renews_at;
    const portalUrl: string | null =
      attributes.urls?.customer_portal ?? null;

    switch (eventName) {
      case "subscription_created":
      case "subscription_updated": {
        const plan = variantIdToPlan(variantId);
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            lemonSqueezyCustomerId: customerId,
            lemonSqueezySubId: subscriptionId,
            lemonSqueezySubStatus: status,
            lemonSqueezyVariantId: variantId,
            lemonSqueezyCurrentPeriodEnd: renewsAt
              ? new Date(renewsAt)
              : null,
            lemonSqueezyPortalUrl: portalUrl,
          },
        });
        break;
      }

      case "subscription_expired":
      case "subscription_cancelled": {
        await prisma.user.update({
          where: { id: userId },
          data: {
            plan: "FREE",
            lemonSqueezySubStatus: status,
            lemonSqueezyCurrentPeriodEnd: null,
          },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
