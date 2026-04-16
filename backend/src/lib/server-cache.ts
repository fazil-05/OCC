/**
 * Lightweight in-memory server-side cache with TTL.
 * Keeps hot data in memory so repeated API calls skip the database.
 *
 * Usage:
 *   const data = await serverCache.getOrSet("clubs:all", 30_000, () => prisma.club.findMany());
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class ServerCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private readonly maxEntries = 500;

  get<T>(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): T {
    if (this.store.size >= this.maxEntries && !this.store.has(key)) {
      const first = this.store.keys().next().value;
      if (first) this.store.delete(first);
    }
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
    return data;
  }

  async getOrSet<T>(
    key: string,
    ttlMs: number,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== undefined) return cached;
    const fresh = await fetcher();
    return this.set(key, fresh, ttlMs);
  }

  invalidate(key: string) {
    this.store.delete(key);
  }

  invalidatePrefix(prefix: string) {
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }

  clear() {
    this.store.clear();
  }
}

const globalForCache = globalThis as unknown as { __occCache?: ServerCache };
export const serverCache =
  globalForCache.__occCache ?? (globalForCache.__occCache = new ServerCache());
