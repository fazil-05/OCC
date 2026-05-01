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
      
      const returnUrl = "OCC://"; 
      console.log(`[GOOGLE CALLBACK] Forcing App Redirect: ${returnUrl}`);
      
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Redirecting to App...</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="refresh" content="3;url=${returnUrl}">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #0f172a; color: #f8fafc; text-align: center; padding: 20px; }
              .spinner { border: 3px solid rgba(255,255,255,0.1); border-left-color: #38bdf8; border-radius: 50%; width: 50px; height: 50px; animation: spin 0.8s linear infinite; margin-bottom: 24px; }
              @keyframes spin { to { transform: rotate(360deg); } }
              h2 { font-size: 24px; margin-bottom: 8px; font-weight: 600; }
              p { color: #94a3b8; margin-bottom: 32px; }
              .btn { background: #38bdf8; color: #0f172a; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; transition: opacity 0.2s; }
            </style>
          </head>
          <body>
            <div class="spinner"></div>
            <h2>Success!</h2>
            <p>You are now authenticated. Returning to the app...</p>
            <a href="${returnUrl}" class="btn">Open App Now</a>
            <script>
              function attemptRedirect() {
                window.location.replace("${returnUrl}");
                window.location.href = "${returnUrl}";
              }
              // Attempt immediately and again in 500ms
              attemptRedirect();
              setTimeout(attemptRedirect, 500);
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
