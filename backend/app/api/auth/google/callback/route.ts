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
  console.log(`[GOOGLE CALLBACK] Request started: ${req.url}`);
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

  const url = req.nextUrl;
  const oauthError = url.searchParams.get("error");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const oauthFrom = req.cookies.get(GOOGLE_OAUTH_FROM_COOKIE)?.value;
  const authErrorBase = oauthFrom === "register" ? "/register" : "/login";

  // Extract CSRF part and encoded payload from state BEFORE defining failRedirect
  const stateParts = (state ?? "").split(":");
  const stateCsrf = stateParts[0] ?? "";
  const isPollMode = stateParts[1] === "poll";
  const pollKey = isPollMode ? (stateParts[2] ?? "") : "";
  const pollEncodedReturn = isPollMode && stateParts.length > 3 ? stateParts[3] : null;

  const stateEncodedReturn = !isPollMode && stateParts.length > 1 ? stateParts[1] : pollEncodedReturn;
  let stateDecodedReturnUrl: string | null = null;
  if (stateEncodedReturn) {
    try {
      stateDecodedReturnUrl = Buffer.from(stateEncodedReturn, "base64").toString("utf-8");
      console.log(`[GOOGLE CALLBACK] Decoded returnUrl: ${stateDecodedReturnUrl}`);
    } catch (e) {
      console.error(`[GOOGLE CALLBACK] Base64 decode failed for: ${stateEncodedReturn}`);
    }
  }

  const isMobileFlow = isPollMode || (!!stateDecodedReturnUrl && (
    stateDecodedReturnUrl.startsWith("exp://") ||
    stateDecodedReturnUrl.startsWith("OCC://") ||
    stateDecodedReturnUrl.startsWith("occ://")
  ));

  console.log(`[GOOGLE CALLBACK] Flow info -> isPoll: ${isPollMode}, isMobile: ${isMobileFlow}, state: ${state?.slice(0, 20)}...`);

  const failRedirect = (message: string) => {
    console.error(`[GOOGLE CALLBACK] Failure: ${message}`);
    let destination: string;
    if (isMobileFlow && stateDecodedReturnUrl) {
      destination = `${stateDecodedReturnUrl}${stateDecodedReturnUrl.includes("?") ? "&" : "?"}error=${encodeURIComponent(message)}`;
    } else {
      destination = new URL(`${authErrorBase}?error=${encodeURIComponent(message)}`, req.url).toString();
    }
    const res = NextResponse.redirect(destination);
    res.cookies.delete(GOOGLE_OAUTH_STATE_COOKIE);
    res.cookies.delete(GOOGLE_OAUTH_REDIRECT_COOKIE);
    res.cookies.delete(GOOGLE_OAUTH_REFERRAL_COOKIE);
    res.cookies.delete(GOOGLE_OAUTH_FROM_COOKIE);
    return res;
  };

  try {
    if (oauthError) return failRedirect("Google sign-in was cancelled");
    if (!code || !state) return failRedirect("Missing OAuth parameters");
    if (!clientId || !clientSecret) return failRedirect("Google OAuth is not configured");

    const cookieState = req.cookies.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
    const csrfValid = cookieState && cookieState.split(":")[0] === stateCsrf;
    const pollModeTrusted = isPollMode && !!pollKey;

    if (!csrfValid && !pollModeTrusted) {
      console.warn(`[GOOGLE CALLBACK] CSRF mismatch. Cookie: ${cookieState}, State: ${stateCsrf}`);
      // On mobile we allow it if pollMode is active
      if (!isPollMode) return failRedirect("Invalid session. Please try again.");
    }

    const redirectUri = oauthCallbackUrl(req);
    console.log(`[GOOGLE CALLBACK] Exchanging code with redirect_uri: ${redirectUri}`);

    const { access_token } = await exchangeCodeForTokens({
      code,
      clientId,
      clientSecret,
      redirectUri,
    });

    console.log(`[GOOGLE CALLBACK] Fetching user info...`);
    const googleUser = await fetchGoogleUserInfo(access_token);
    if (!googleUser.email) return failRedirect("Google did not return an email");

    const email = googleUser.email.toLowerCase().trim();
    console.log(`[GOOGLE CALLBACK] Authenticated as: ${email}`);

    let user = await prisma.user.findUnique({ where: { email } });
    let createdViaGoogle = false;

    if (!user) {
      console.log(`[GOOGLE CALLBACK] Creating new user for: ${email}`);
      createdViaGoogle = true;
      const phoneNumber = generateIndianPhoneNumber();
      const randomPassword = crypto.randomBytes(48).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 12);

      user = await prisma.user.create({
        data: {
          fullName: googleUser.name || email.split("@")[0],
          collegeName: "Not specified",
          phoneNumber,
          email,
          password: hashedPassword,
          avatar: googleUser.picture || null,
          emailVerified: new Date(),
          role: "STUDENT",
        },
      });
    }

    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      approvalStatus: user.approvalStatus as any,
      suspended: user.suspended,
      onboardingComplete: user.onboardingComplete,
    });

    if (isPollMode && pollKey) {
      console.log(`[GOOGLE CALLBACK] Storing token for polling: ${pollKey}`);
      // Add a 5 second timeout to the store operation to prevent hangs
      await Promise.race([
        storeOAuthToken(pollKey, token, user.email),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout storing token")), 5000))
      ]).catch(e => console.error("[GOOGLE CALLBACK] Store error/timeout:", e));

      const finalReturn = stateDecodedReturnUrl || "OCC://google-auth";
      console.log(`[GOOGLE CALLBACK] Redirecting to mobile return: ${finalReturn}`);
      const res = NextResponse.redirect(finalReturn);
      res.cookies.set("occ-token", token, authCookieOptions);
      return res;
    }

    const redirectCookieVal = req.cookies.get(GOOGLE_OAUTH_REDIRECT_COOKIE)?.value;
    const destination = postLoginDestination(
      { role: user.role, approvalStatus: user.approvalStatus, onboardingComplete: user.onboardingComplete },
      redirectCookieVal,
    );

    console.log(`[GOOGLE CALLBACK] Redirecting to web destination: ${destination}`);
    const res = NextResponse.redirect(new URL(destination, req.url));
    res.cookies.set("occ-token", token, authCookieOptions);
    return res;

  } catch (err: any) {
    console.error("[GOOGLE CALLBACK] Critical Error:", err);
    return failRedirect("A server error occurred during login");
  }
}
