import { nanoid } from "nanoid";

export function generateReferralCode(clubName: string, headerName: string): string {
  const clubPrefix = clubName.toUpperCase().replace(/\s/g, "").slice(0, 3);
  const namePrefix = headerName.toUpperCase().split(" ")[0]?.slice(0, 3) || "HDR";
  const unique = nanoid(4).toUpperCase();
  return `${clubPrefix}${namePrefix}${unique}`;
}
