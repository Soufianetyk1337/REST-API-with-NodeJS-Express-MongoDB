import {
  createUserHandler,
  createUserPasswordConfirm,
  createUserPasswordReset,
  createUserEmailVerification,
  createUserPasswordForgot,
} from "./controller/user.controller.js";
import {
  createUserSessionHandler,
  deleteUserSessionHandler,
} from "./controller/session.controller.js";
import {
  createEmailValidationSchema,
  createPasswordValidationSchema,
  createUserValidationSchema,
} from "./schema/user.schema.js";
import { createSessionValidationSchema } from "./schema/session.schema.js";
import { validate } from "./middleware/validate.js";
import { userIsGuest } from "./middleware/userIsGuest.js";
import { userIsLoggedIn } from "./middleware/userIsLoggedIn.js";

import { passwordBruteforceRateLimiterMiddleware } from "./middleware/rateLimiter.js";
import { userIsVerified } from "./middleware/userIsVerified.js";
import { checkEmailExistence } from "./middleware/checkEmailExistence.js";
// req.headers['x-forwarded-for'] || req.connection.remoteAddress
export const routes = (app) => {
  app.get("/", (req, res) => {
    return res.redirect("/api-docs");
  });
  app.get("/api/v1/ping", (req, res) => {
    return res.sendStatus(200);
  });
  app.post(
    "/api/v1/users/register",
    userIsGuest,
    checkEmailExistence,
    validate(createUserValidationSchema),
    createUserHandler
  );
  app.post(
    "/api/v1/users/login",
    userIsGuest,
    validate(createSessionValidationSchema),
    passwordBruteforceRateLimiterMiddleware,
    createUserSessionHandler
  );
  app.delete(
    "/api/v1/users/logout",
    userIsLoggedIn,
    userIsVerified,
    deleteUserSessionHandler
  );
  app.patch(
    "/api/v1/users/password/reset",
    userIsGuest,
    validate(createPasswordValidationSchema),
    createUserPasswordReset
  );
  app.post(
    "/api/v1/users/password/confirm",
    userIsLoggedIn,
    userIsVerified,
    validate(createPasswordValidationSchema),
    createUserPasswordConfirm
  );
  app.post(
    "/api/v1/users/password/forgot",
    userIsGuest,
    validate(createEmailValidationSchema),
    createUserPasswordForgot
  );
  app.get(
    "/api/v1/users/email/verify",
    userIsGuest,
    createUserEmailVerification
  );
};
