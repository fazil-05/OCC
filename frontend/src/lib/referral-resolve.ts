import type { Club, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { REFERRAL_CODE_MIN_LEN } from "@/lib/validations";

/**
 * Normalizes referral input: NFC, strips spaces/zero-width chars, uppercases.
 * Fixes mismatches vs DB when users paste codes or DB has odd spacing.
 */
export function normalizeReferralCodeInput(raw: string): string {
  return raw
    .normalize("NFKC")
    .replace(/[\s\u200b-\u200d\ufeff]/g, "")
    .toUpperCase();
}

/** Levenshtein distance — used to suggest codes when users mistype (e.g. EPORTS vs ESPORTS). */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array<number>(n + 1).fill(0),
  );
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
}

export type ResolvedClubHeader = {
  header: User & { clubManaged: Club | null };
  club: Club;
};

/**
 * Finds an approved club leader whose referral code matches (exact or normalized).
 */
export async function resolveClubHeaderByReferralCode(
  codeInput: string,
): Promise<ResolvedClubHeader | null> {
  const normalized = normalizeReferralCodeInput(codeInput);
  if (normalized.length < REFERRAL_CODE_MIN_LEN) {
    return null;
  }

  let header =
    (await prisma.user.findUnique({
      where: { referralCode: normalized },
      include: { clubManaged: true },
    })) ?? null;

  if (
    header &&
    (header.role !== "CLUB_HEADER" || header.approvalStatus !== "APPROVED")
  ) {
    header = null;
  }

  if (!header) {
    const candidates = await prisma.user.findMany({
      where: {
        role: "CLUB_HEADER",
        approvalStatus: "APPROVED",
        referralCode: { not: null },
      },
      include: { clubManaged: true },
    });

    const matched = candidates.find(
      (u) =>
        u.referralCode !== null &&
        normalizeReferralCodeInput(u.referralCode) === normalized,
    );

    header = matched ?? null;
  }

  if (!header || header.role !== "CLUB_HEADER" || header.approvalStatus !== "APPROVED") {
    return null;
  }

  const club = await resolveClubForHeader(header);

  if (!club) {
    return null;
  }

  return { header, club };
}

/**
 * Resolves the managed club for a header when Prisma's `clubManaged` relation is null
 * (common when only `Club.headerId` or `User.clubManagedId` is set in the DB).
 */
export async function resolveClubForHeader(
  header: User & { clubManaged: Club | null },
): Promise<Club | null> {
  if (header.clubManaged) {
    return header.clubManaged;
  }
  const byHeaderId = await prisma.club.findFirst({
    where: { headerId: header.id },
  });
  if (byHeaderId) {
    return byHeaderId;
  }
  if (header.clubManagedId) {
    return prisma.club.findUnique({ where: { id: header.clubManagedId } });
  }
  // Legacy / edge-case: header still has a pending lead club id.
  if (header.pendingLeadClubId) {
    return prisma.club.findUnique({ where: { id: header.pendingLeadClubId } });
  }
  return null;
}

/**
 * When the typed code does not match exactly, find the closest real code (e.g. EPORTS → ESPORTS).
 * Verifies the suggestion resolves to an active club header + club.
 */
export async function suggestSimilarReferralCode(
  normalizedWrong: string,
): Promise<string | null> {
  if (normalizedWrong.length < REFERRAL_CODE_MIN_LEN) {
    return null;
  }

  const rows = await prisma.user.findMany({
    where: {
      role: "CLUB_HEADER",
      approvalStatus: "APPROVED",
      referralCode: { not: null },
    },
    select: { referralCode: true },
  });

  const maxDist =
    normalizedWrong.length <= 5 ? 1 : normalizedWrong.length <= 12 ? 2 : 3;

  let best: { code: string; dist: number } | null = null;

  for (const row of rows) {
    if (!row.referralCode) continue;
    const norm = normalizeReferralCodeInput(row.referralCode);
    if (norm === normalizedWrong) continue;
    const d = levenshtein(normalizedWrong, norm);
    if (d < 1 || d > maxDist) continue;

    if (!best || d < best.dist || (d === best.dist && norm.length < best.code.length)) {
      best = { code: norm, dist: d };
    }
  }

  if (!best) return null;

  const resolved = await resolveClubHeaderByReferralCode(best.code);
  return resolved ? best.code : null;
}
