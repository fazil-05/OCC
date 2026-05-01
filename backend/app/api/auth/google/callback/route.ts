import { attachStudentToReferralCode } from "@/lib/attach-referral";
import { DEFAULT_AVATAR_URL } from "@/lib/avatar";
import {
  exchangeCodeForTokens,
  fetchGoogleUserInfo,
  GOOGLE_OAUTH_FROM_COOKIE,
  GOOGLE_OAUTH_REDIRECT_COOKIE,
  GOOGLE_OAUTH_REFERRAL_COOKIE,
  GOOGLE_OAUTH_STATE_COOKIE,
  oauthCallbackUrl,
} from "@/lib/google-oauth";
import { authCookieOptions, signAuthToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { STAFF_PUBLIC_PREFIX } from "@/lib/staff-paths";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { storeOAuthToken } from "@/lib/poll-store";

const MOBILE_SCHEME = "OCC://google-auth";

function generateIndianPhoneNumber(): string {
  const first = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
  const rest = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join("");
  return `${first}${rest}`;
}

function safeRedirectPath(path: string | null | undefined): string {
  if (path === "mobile") return "mobile";
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return "/dashboard";
  }
  return path.slice(0, 2000);
}

function postLoginDestination(
  user: { role: string; approvalStatus: string; onboardingComplete?: boolean },
  redirectCookie: string | undefined,
): string {
  const safe = safeRedirectPath(redirectCookie);

  // MOBILE BRIDGE: If the redirect cookie is "mobile", return the custom scheme
  if (safe === "mobile") {
    return MOBILE_SCHEME;
  }

  if (user.role === "STUDENT" && user.onboardingComplete === false) {
    return "/onboarding";
  }

  if (safe !== "/dashboard") {
    return safe;
  }
  if (user.role === "ADMIN") {
    return STAFF_PUBLIC_PREFIX;
  }
  if (user.role === "CLUB_HEADER" && user.approvalStatus === "APPROVED") {
    return "/header/dashboard";
  }
  if (user.role === "CLUB_HEADER" && user.approvalStatus === "PENDING") {
    return "/pending";
  }
  return "/dashboard";
}

export async function GET(req: NextRequest) {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    const code = req.nextUrl.searchParams.get("code");
    const redirectUri = oauthCallbackUrl(req);

    if (!code) return new NextResponse("Error: Missing code", { status: 400 });
    if (!clientId || !clientSecret) return new NextResponse("Error: Missing credentials", { status: 500 });

    const { access_token } = await exchangeCodeForTokens({
      code,
      clientId,
      clientSecret,
      redirectUri,
    });

    const googleUser = await fetchGoogleUserInfo(access_token);
    const email = googleUser.email?.toLowerCase().trim();
    if (!email) return new NextResponse("Error: No email from Google", { status: 500 });

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Create a minimal user
      user = await prisma.user.create({
        data: {
          fullName: googleUser.name || email.split("@")[0],
          email,
          phoneNumber: "0000000000" + Math.floor(Math.random() * 1000),
          password: "minimal_password_" + Date.now(),
          collegeName: "Not specified",
          role: "STUDENT",
        },
      });
    }

    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      approvalStatus: user.approvalStatus as any,
      onboardingComplete: user.onboardingComplete,
    });

    return new NextResponse(`SUCCESS! TOKEN: ${token}`, { status: 200 });

  } catch (err: any) {
    console.error(err);
    return new NextResponse(`CRITICAL ERROR: ${err.message || String(err)}`, { status: 500 });
  }
}
}
