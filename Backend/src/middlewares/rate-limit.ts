import { rateLimit } from "express-rate-limit";
import { ApiResponseType } from "../types/api";

const rateLimitExceededResponse: ApiResponseType<null> = {
  success: false,
  message: "Too many requests. Please slow down.",
  data: [],
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: rateLimitExceededResponse,
  keyGenerator: (req) => {
    console.log(
      "req.user?.id",
      req.user?.id,
      "req.ip",
      req.ip,
      "inside rate-limiter"
    );

    return req.user?.id || req.ip || "unknown";
  },
});

export default rateLimiter;