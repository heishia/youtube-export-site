import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      plan: "FREE" | "PRO" | "TEAM";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    plan: "FREE" | "PRO" | "TEAM";
  }
}
