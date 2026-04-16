/** Public URL prefix for the staff panel (obscured; not /admin). Must match NEXT_PUBLIC_OCC_STAFF_PREFIX in .env */
export const STAFF_PUBLIC_PREFIX = (
  process.env.NEXT_PUBLIC_OCC_STAFF_PREFIX || "/k9xm2p7qv4nw8-stf"
).replace(/\/$/, "");

/** Public URL prefix for the SaaS admin control panel */
export const ADMIN_CP_PREFIX = (
  process.env.NEXT_PUBLIC_OCC_ADMIN_CP_PREFIX || "/k9xm2p7qv4nw8-admin-control-panel"
).replace(/\/$/, "");

/** Staff-only sign-in page (under the same prefix): .../gate */
export function staffGateHref(): string {
  return `${STAFF_PUBLIC_PREFIX}/gate`;
}

/** Build a staff panel path under the public prefix */
export function staffHref(path = ""): string {
  if (!path || path === "/") return STAFF_PUBLIC_PREFIX;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${STAFF_PUBLIC_PREFIX}${p}`;
}

/** Build an admin control panel path */
export function adminCpHref(path = ""): string {
  if (!path || path === "/") return ADMIN_CP_PREFIX;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${ADMIN_CP_PREFIX}${p}`;
}

