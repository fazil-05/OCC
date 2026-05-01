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
  const url = req.nextUrl;
  console.log(`[GOOGLE CALLBACK] START: ${url.href}`);
  
  try {
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code || !state) {
      console.error("[GOOGLE CALLBACK] Missing parameters", { code: !!code, state: !!state });
      return new NextResponse("Error: Missing code or state", { status: 400 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
    if (!clientId || !clientSecret) {
      console.error("[GOOGLE CALLBACK] Missing ENV: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET");
      return new NextResponse("Error: Server credentials missing", { status: 500 });
    }

    // Determine redirect URI dynamically or from ENV
    const redirectUri = oauthCallbackUrl(req);
    console.log(`[GOOGLE CALLBACK] Using redirectUri: ${redirectUri}`);

    // 1. Exchange Code
    console.log("[GOOGLE CALLBACK] Exchanging code...");
    const { access_token } = await exchangeCodeForTokens({
      code,
      clientId,
      clientSecret,
      redirectUri,
    });

    // 2. Fetch User Info
    console.log("[GOOGLE CALLBACK] Fetching user info...");
    const googleUser = await fetchGoogleUserInfo(access_token);
    const email = googleUser.email?.toLowerCase().trim();
    if (!email) throw new Error("No email returned from Google");

    // 3. Database Operation
    console.log(`[GOOGLE CALLBACK] Syncing user: ${email}`);
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("[GOOGLE CALLBACK] Creating new user");
      user = await prisma.user.create({
        data: {
          fullName: googleUser.name || email.split("@")[0],
          email,
          phoneNumber: generateIndianPhoneNumber(),
          password: crypto.randomBytes(32).toString("hex"),
          collegeName: "Not specified",
          avatar: googleUser.picture || null,
          emailVerified: new Date(),
          role: "STUDENT",
        },
      });
    }

    // 4. Create Token
    const token = await signAuthToken({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      approvalStatus: user.approvalStatus as any,
      onboardingComplete: user.onboardingComplete,
    });

    // 5. Handle Redirection
    const stateParts = state.split(":");
    const isPollMode = stateParts[1] === "poll";
    const pollKey = isPollMode ? stateParts[2] : null;

    if (isPollMode && pollKey) {
      console.log(`[GOOGLE CALLBACK] Poll Mode -> storing token for ${pollKey}`);
      await storeOAuthToken(pollKey, token, user.email);
      
      const encodedReturn = stateParts.length > 3 ? stateParts[3] : null;
      let returnUrl = "OCC://google-auth";
      if (encodedReturn) {
        try { returnUrl = Buffer.from(encodedReturn, "base64").toString("utf-8"); } catch (e) {}
      }
      
      console.log(`[GOOGLE CALLBACK] Forcing App Redirect: ${returnUrl}`);
      
      // Instead of server-side redirect, we use a client-side "Auto-Redirector" 
      // This is MUCH more reliable for closing mobile browser tabs.
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Redirecting...</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #000; color: #fff; text-align: center; }
              .spinner { border: 4px solid rgba(255,255,255,0.1); border-left-color: #fff; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
              @keyframes spin { to { transform: rotate(360deg); } }
              a { color: #4facfe; text-decoration: none; margin-top: 20px; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="spinner"></div>
            <h2>Authenticating...</h2>
            <p>Returning you to the app automatically.</p>
            <a href="${returnUrl}">Click here if you are not redirected</a>
            <script>
              // Force the redirect
              setTimeout(() => {
                window.location.href = "${returnUrl}";
              }, 500);
            </script>
          </body>
        </html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    console.log("[GOOGLE CALLBACK] Web Mode -> redirecting to dashboard");
    const res = NextResponse.redirect(new URL("/dashboard", req.url));
    res.cookies.set("occ-token", token, authCookieOptions);
    return res;

  } catch (err: any) {
    console.error("[GOOGLE CALLBACK] CRITICAL ERROR:", err);
    return new NextResponse(`SERVER ERROR: ${err.message || String(err)}`, { status: 500 });
  }
}
