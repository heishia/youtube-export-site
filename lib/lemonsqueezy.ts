import {
  lemonSqueezySetup,
  createCheckout,
  getSubscription,
  cancelSubscription,
} from "@lemonsqueezy/lemonsqueezy.js";

export function initLemonSqueezy() {
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY! });
}

export const PLANS = {
  pro: {
    variantId: process.env.LEMONSQUEEZY_PRO_VARIANT_ID!,
    name: "Pro",
    price: "₩9,900",
  },
  team: {
    variantId: process.env.LEMONSQUEEZY_TEAM_VARIANT_ID!,
    name: "Team",
    price: "₩29,900",
  },
} as const;

export async function createCheckoutUrl(
  variantId: string,
  userId: string,
  userEmail: string
) {
  initLemonSqueezy();

  const checkout = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID!,
    variantId,
    {
      checkoutData: {
        email: userEmail,
        custom: { user_id: userId },
      },
      productOptions: {
        redirectUrl: `${process.env.NEXTAUTH_URL}/dashboard?payment=success`,
      },
    }
  );

  return checkout.data?.data.attributes.url;
}

export async function getSubscriptionById(subscriptionId: string) {
  initLemonSqueezy();
  const sub = await getSubscription(subscriptionId);
  return sub.data?.data;
}

export async function cancelSub(subscriptionId: string) {
  initLemonSqueezy();
  return cancelSubscription(subscriptionId);
}
