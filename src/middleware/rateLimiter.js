import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import { env } from "process";
import { logger } from "../utils/logger.js";

const redisClient = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    enableOfflineQueue: false,
});

const getEmailIPkey = (username, ip) => `${username}_${ip}`;
export const limitFastBruteForceByIp = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_fail_ip_per_minute",
    points: +env.MAX_WRONG_ATTEMPTS_BY_IP_PER_MINTUE,
    duration: 30,
    inmemoryBlockOnConsumed: +env.MAX_WRONG_ATTEMPTS_BY_IP_PER_MINUTE,
    blockDuration: 60 * 10,
});

export const limitSlowBruteForceByIp = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "login_fail_ip_per_day",
    points: +env.MAX_WRONG_ATTEMPTS_BY_IP_PER_DAY,
    inmemoryBlockOnConsumed: +env.MAX_WRONG_ATTEMPTS_BY_IP_PER_DAY,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24,
});
const limitConsecutiveFailsByEmailAndIp = new RateLimiterRedis({
    redis: redisClient,
    keyPrefix: "login_fail_consecutive_email",
    points: +env.MAX_CONSECUTIVE_FAIL_BY_EMAIL || 5,
    duration: 60 * 60 * 1,
    blockDuration: 60 * 10,
});
export const passwordBruteforceRateLimiterMiddleware = async (
    req,
    res,
    next
) => {
    const ipAddress =
        req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { email } = req.body;
    const emailIpKey = getEmailIPkey(email, ipAddress);
    const rateLimiterResponseEmailAndIp =
        await limitConsecutiveFailsByEmailAndIp.get(emailIpKey);
    try {
        await limitConsecutiveFailsByEmailAndIp.consume(emailIpKey);
        res.set(
            "X-RateLimit-Remaining",
            rateLimiterResponseEmailAndIp.remainingPoints ||
            +env.MAX_CONSECUTIVE_FAIL_BY_EMAIL
        );
        res.set("X-RateLimit-Limit", 5);
        res.locals.limitConsecutiveFailsByEmailAndIp =
            limitConsecutiveFailsByEmailAndIp;
        res.locals.emailIpKey = emailIpKey;
        return next();
    } catch (error) {
        logger.error(error);
        const retryInSeconds =
            Math.round(rateLimiterResponseEmailAndIp.msBeforeNext / 1000) || 1;
        res.set("Retry-After", `${String(retryInSeconds)} seconds`);
        return res
            .status(429)
            .json({
                success: false,
                message: `Too many requests! Retry after : ${String(
                    retryInSeconds
                )} seconds`,
            });
    }
};
