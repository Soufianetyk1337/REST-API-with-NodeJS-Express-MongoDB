import express from "express";
import * as SessionController from "../controller/session.controller.js";
import { checkEmailExistence } from "../middleware/checkEmailExistence.js";
import { passwordBruteforceRateLimiterMiddleware } from "../middleware/rateLimiter.js";
import { userIsGuest } from "../middleware/userIsGuest.js";
import { userIsLoggedIn } from "../middleware/userIsLoggedIn.js";
import { userIsVerified } from "../middleware/userIsVerified.js";
import { validate } from "../middleware/validate.js";
import { createSessionValidationSchema } from "../schema/session.schema.js";
import * as UserController from "../controller/user.controller.js";
import * as UserSchema from "../schema/user.schema.js";

var router = express.Router();

router.post(
  "/register",
  userIsGuest,
  checkEmailExistence,
  validate(UserSchema.createUserValidationSchema),
  UserController.createUserHandler
);
router.post(
  "/login",
  userIsGuest,
  userIsVerified,
  validate(createSessionValidationSchema),
  passwordBruteforceRateLimiterMiddleware,
  SessionController.createUserSessionHandler
);
router.delete(
  "/logout",
  userIsLoggedIn,
  userIsVerified,
  SessionController.deleteUserSessionHandler
);
router.patch(
  "/password/reset",
  userIsGuest,
  validate(UserSchema.createPasswordValidationSchema),
  UserController.createUserPasswordReset
);
router.post(
  "/password/confirm",
  userIsLoggedIn,
  userIsVerified,
  validate(UserSchema.createPasswordValidationSchema),
  UserController.createUserPasswordConfirm
);
router.post(
  "/password/forgot",
  userIsGuest,
  validate(UserSchema.createEmailValidationSchema),
  UserController.createUserPasswordForgot
);
router.get(
  "/email/verify",
  userIsGuest,
  UserController.createUserEmailVerification
);
router.post(
  "/email/resend-verify",
  userIsGuest,
  UserController.sendEmailToVerifyUserAccount
);
export { router as authRouter };
