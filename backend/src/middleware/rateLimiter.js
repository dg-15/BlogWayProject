import ratelimit from "../config/upstash.js";

const rateLimiter = (req, res, next) => {
  ratelimit(req, res, next);
};

export default rateLimiter;
