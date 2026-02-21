import { rateLimit } from "express-rate-limit";

const ratelimit = rateLimit({
  windowMs: 20 * 1000,
  limit: 50,
  message: { message: "Too many requests, please try again later" },
});

export default ratelimit;
