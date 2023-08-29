import { env } from "process";
import Redis from "ioredis";
import connectRedis from "connect-redis";
import session from "express-session";
import { logger } from "../utils/logger.js";
const HALF_HOUR = 1000 * 60 * 30;
const RedisStore = connectRedis(session);
const redisClient = new Redis({
  url: env.REDIS_URL,
  connectTimeout: 10000,
  url: env.REDIS_URL,
  family: 4,
});

redisClient.on("connect", function (err) {
  logger.success("Connected to redis successfully");
});

redisClient.on("error", function (err) {
  logger.error("Redis Client Error", err);
});

export const sessionConfig = {
  name: "sid",
  secret: env.SESSION_SECRET,
  maxDuration: 60 * 60 * 6, // duration in seconds (this would be 6 hours)
  cookie: {
    maxAge: env.SESSION_TIME_TO_LIVE || HALF_HOUR,
    sameSite: true,
    secure: env.NODE_ENV === "production",
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: new RedisStore({ client: redisClient, ttl: 86400 }),
};
