import crypto from "crypto";

export function generateSixDigitOtp(): string {
  const n = crypto.randomInt(0, 1_000_000); // 0..999999
  return String(n).padStart(6, "0");
}

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

