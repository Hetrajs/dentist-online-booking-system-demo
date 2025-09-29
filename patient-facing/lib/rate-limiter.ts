import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up expired entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  async isAllowed(identifier: string): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    let requestData = this.requests.get(identifier);
    
    // Reset if window has expired
    if (!requestData || requestData.resetTime <= now) {
      requestData = {
        count: 0,
        resetTime: now + this.config.windowMs
      };
    }
    
    requestData.count++;
    this.requests.set(identifier, requestData);
    
    const allowed = requestData.count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - requestData.count);
    
    return {
      allowed,
      remaining,
      resetTime: requestData.resetTime
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, data] of this.requests.entries()) {
      if (data.resetTime <= now) {
        this.requests.delete(key);
      }
    }
  }

  getStats() {
    return {
      activeIdentifiers: this.requests.size,
      config: this.config
    };
  }
}

// Different rate limiters for different endpoints
export const rateLimiters = {
  // General API rate limiting
  api: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many API requests, please try again later.'
  }),
  
  // Appointment booking (more restrictive)
  booking: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    message: 'Too many booking attempts, please try again in an hour.'
  }),
  
  // Contact form submissions
  contact: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    message: 'Too many contact form submissions, please try again later.'
  }),
  
  // Newsletter subscriptions
  newsletter: new RateLimiter({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    maxRequests: 1,
    message: 'You can only subscribe once per day.'
  })
};

// Helper function to get client identifier
export function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for production behind proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || request.ip || 'unknown';
  
  return ip;
}

// Middleware wrapper for rate limiting
export async function withRateLimit(
  request: NextRequest,
  limiterType: keyof typeof rateLimiters,
  customIdentifier?: string
): Promise<{ allowed: boolean; response?: Response }> {
  const identifier = customIdentifier || getClientIdentifier(request);
  const limiter = rateLimiters[limiterType];
  
  const result = await limiter.isAllowed(identifier);
  
  if (!result.allowed) {
    return {
      allowed: false,
      response: new Response(
        JSON.stringify({
          error: limiter.config.message || 'Rate limit exceeded',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limiter.config.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    };
  }
  
  return { allowed: true };
}
