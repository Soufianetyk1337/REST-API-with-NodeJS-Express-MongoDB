
import { env } from "process";
import Redis from 'ioredis'
import connectRedis from 'connect-redis'
import session from 'express-session'
import { logger } from "../utils/logger.js";
const HALF_HOUR = 1000 * 60 * 30
const RedisStore = connectRedis(session)
const redisClient = new Redis({
    host: 'localhost', port: 6379
})
redisClient.on('error', function (err) {
    logger.error('Could not establish a connection with redis. ' + err);
});
redisClient.on('connect', function (err) {
    logger.success('Connected to redis successfully');
});
export const sessionConfig = {
    name: "sid",
    secret: env.SESSION_SECRET,
    maxDuration: 60 * 60 * 6, // duration in seconds (this would be 6 hours)
    cookie: {
        maxAge: env.SESSION_TIME_TO_LIVE || HALF_HOUR,
        sameSite: true,
        secure: env.NODE_ENV === 'production'
    },
    rolling: true,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient, ttl: 86400 }),
}