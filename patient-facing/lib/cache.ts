// Redis-like caching for API responses
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>();
  private maxSize = 1000; // Maximum cache entries

  set(key: string, data: any, ttlSeconds: number = 300) {
    // Clean up expired entries if cache is getting full
    if (this.cache.size >= this.maxSize) {
      this.cleanup();
    }

    const expires = Date.now() + (ttlSeconds * 1000);
    this.cache.set(key, { data, expires });
  }

  get(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let expired = 0;
    let active = 0;

    for (const [, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        expired++;
      } else {
        active++;
      }
    }

    return {
      total: this.cache.size,
      active,
      expired,
      maxSize: this.maxSize
    };
  }
}

// Global cache instance
export const apiCache = new MemoryCache();

// Cache wrapper for API functions
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttlSeconds: number = 300
): T {
  return (async (...args: Parameters<T>) => {
    const cacheKey = keyGenerator(...args);
    
    // Try to get from cache first
    const cached = apiCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Execute function and cache result
    try {
      const result = await fn(...args);
      apiCache.set(cacheKey, result, ttlSeconds);
      return result;
    } catch (error) {
      // Don't cache errors
      throw error;
    }
  }) as T;
}

// Specific cache keys for different data types
export const cacheKeys = {
  services: () => 'services:active',
  testimonials: (featured: boolean) => `testimonials:${featured ? 'featured' : 'all'}`,
  availability: (date: string) => `availability:${date}`,
  appointments: (userId: string) => `appointments:user:${userId}`,
  userProfile: (userId: string) => `profile:${userId}`,
};

// Cache invalidation helpers
export const invalidateCache = {
  services: () => apiCache.delete(cacheKeys.services()),
  testimonials: () => {
    apiCache.delete(cacheKeys.testimonials(true));
    apiCache.delete(cacheKeys.testimonials(false));
  },
  availability: (date?: string) => {
    if (date) {
      apiCache.delete(cacheKeys.availability(date));
    } else {
      // Clear all availability cache
      apiCache.clear();
    }
  },
  userAppointments: (userId: string) => {
    apiCache.delete(cacheKeys.appointments(userId));
  },
  userProfile: (userId: string) => {
    apiCache.delete(cacheKeys.userProfile(userId));
  }
};
