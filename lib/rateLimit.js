const { Ratelimit } = require('@upstash/ratelimit');
const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Per-route rate limiters
const limiters = {
  analyze: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '60 s'), prefix: 'rl:analyze' }),
  finalize: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '60 s'), prefix: 'rl:finalize' }),
  proEnqueue: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '60 s'), prefix: 'rl:pro-enqueue' }),
  reportPdf: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, '60 s'), prefix: 'rl:report-pdf' }),
  captureEmail: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '60 s'), prefix: 'rl:capture-email' }),
  preCheck: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '120 s'), prefix: 'rl:pre-check' }),
  contactBeeleven: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '600 s'), prefix: 'rl:contact-beeleven' }),
  createCheckout: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '60 s'), prefix: 'rl:create-checkout' }),
  verifyPayment: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '60 s'), prefix: 'rl:verify-payment' }),
  sendEmail: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '60 s'), prefix: 'rl:send-email' }),
  track: new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '60 s'), prefix: 'rl:track' }),
};

async function checkRateLimit(limiterName, req, res) {
  const limiter = limiters[limiterName];
  if (!limiter) return true;
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  try {
    const { success, remaining } = await limiter.limit(ip);
    res.setHeader('X-RateLimit-Remaining', remaining);
    if (!success) {
      res.status(429).json({ error: 'Too many requests. Please try again later.' });
      return false;
    }
    return true;
  } catch {
    return true; // Fail open if Redis is down
  }
}

module.exports = { checkRateLimit };
