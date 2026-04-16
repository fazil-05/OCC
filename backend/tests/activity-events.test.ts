import assert from "node:assert/strict";
import { clampActivityWindowDays, DEFAULT_ACTIVITY_WINDOW_DAYS, sanitizeActivityMetadata } from "@/lib/activity-events";

function run() {
  const redacted = sanitizeActivityMetadata({
    keep: "ok",
    password: "x",
    otp: "123456",
    token: "abc",
    authorization: "Bearer aaa",
    secretNote: "no",
  });
  assert.equal(redacted?.keep, "ok");
  assert.equal("password" in (redacted || {}), false);
  assert.equal("otp" in (redacted || {}), false);
  assert.equal("token" in (redacted || {}), false);
  assert.equal("authorization" in (redacted || {}), false);

  assert.equal(clampActivityWindowDays(7), 7);
  assert.equal(clampActivityWindowDays(0), 1);
  assert.equal(clampActivityWindowDays(50), 30);
  assert.equal(clampActivityWindowDays(Number.NaN), DEFAULT_ACTIVITY_WINDOW_DAYS);

  console.log("activity-events tests passed");
}

run();

