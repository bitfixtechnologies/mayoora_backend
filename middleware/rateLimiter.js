const rateLimitStore = {};

/**
 * Custom memory-based rate limiting middleware
 * Limits clients to 5 login attempts per 15 minutes window
 */
const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes window
  const maxAttempts = 5; // Allow maximum 5 attempts

  if (!rateLimitStore[ip]) {
    rateLimitStore[ip] = [];
  }

  // Filter out attempts that are older than the 15-minute window
  rateLimitStore[ip] = rateLimitStore[ip].filter(timestamp => now - timestamp < windowMs);

  if (rateLimitStore[ip].length >= maxAttempts) {
    return res.status(429).json({
      message: "Too many login attempts. Please try again after 15 minutes."
    });
  }

  // Record the current login attempt
  rateLimitStore[ip].push(now);
  next();
};

module.exports = loginRateLimiter;
