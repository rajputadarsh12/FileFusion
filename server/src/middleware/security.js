import rateLimit from 'express-rate-limit';
import { URL } from 'url';
import dns from 'dns/promises';

// API Rate Limiter: max 120 requests per 15 minutes per IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again in a few minutes.',
  },
});

// SSRF Guard to prevent access to private IP ranges, localhost, AWS/cloud metadata services
export async function validateSafeUrl(targetUrl) {
  try {
    const parsed = new URL(targetUrl);

    // Only allow HTTP and HTTPS
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      throw new Error('Only HTTP and HTTPS protocols are permitted.');
    }

    const hostname = parsed.hostname.toLowerCase();

    // Block localhost, loopback, private ranges
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname === '0.0.0.0' ||
      hostname.endsWith('.local') ||
      hostname.endsWith('.internal')
    ) {
      throw new Error('Access to local network hosts is restricted.');
    }

    // Resolve IP address to check for private ranges
    const lookup = await dns.lookup(hostname);
    const ip = lookup.address;

    // Check private IPv4 ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16 (cloud metadata)
    const parts = ip.split('.').map(Number);
    if (parts.length === 4) {
      if (
        parts[0] === 10 ||
        parts[0] === 127 ||
        (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
        (parts[0] === 192 && parts[1] === 168) ||
        (parts[0] === 169 && parts[1] === 254) // AWS / GCP metadata IP
      ) {
        throw new Error('Access to private or cloud metadata IP addresses is forbidden.');
      }
    }

    return true;
  } catch (err) {
    throw new Error(`SSRF Security check failed: ${err.message}`);
  }
}
