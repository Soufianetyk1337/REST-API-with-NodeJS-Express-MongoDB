import * as UserController from "./controller/user.controller.js";
import {
  createUserSessionHandler,
  deleteUserSessionHandler,
} from "./controller/session.controller.js";
import * as UserSchema from "./schema/user.schema.js";
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
    return res.status(200);
  });
  app.post(
    "/api/v1/users/register",
    userIsGuest,
    checkEmailExistence,
    validate(UserSchema.createUserValidationSchema),
    UserController.createUserHandler
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
    validate(UserSchema.createPasswordValidationSchema),
    UserController.createUserPasswordReset
  );
  app.post(
    "/api/v1/users/password/confirm",
    userIsLoggedIn,
    userIsVerified,
    validate(UserSchema.createPasswordValidationSchema),
    UserController.createUserPasswordConfirm
  );
  app.post(
    "/api/v1/users/password/forgot",
    userIsGuest,
    validate(UserSchema.createEmailValidationSchema),
    UserController.createUserPasswordForgot
  );
  app.get(
    "/api/v1/users/email/verify",
    userIsGuest,
    UserController.createUserEmailVerification
  );
};

/*
 app.post("/api/v1/board/", userIsLoggedIn, userIsVerified, createBoard);
  app.get("/api/v1/board/", userIsLoggedIn, userIsVerified, getAllBoards);
  app.put("/api/v1/board/", userIsLoggedIn, userIsVerified, updateBoards);
  app.get(
    "/api/v1/board/",
    userIsLoggedIn,
    userIsVerified,
    getfavoritesBoards
  );
  app.put(
    "/api/v1/board/",
    userIsLoggedIn,
    userIsVerified,
    updatefavoriteBoard
  );
  app.get(
    "/:boardId",
    param("boardId").custom((value) => {
      if (!isObjectId(value)) {
        return Promise.reject("Invalid Id");
      } else return Promise.resolve();
    }),
    validation,
    userIsLoggedIn,
    userIsVerified,
    getBoard
  );
  app.put(
    "/:boardId",
    param("boardId").custom((value) => {
      if (!validation.isObjectId(value)) {
        return Promise.reject("invalid id");
      } else return Promise.resolve();
    }),
    validation,
    userIsLoggedIn,
    userIsVerified,
    updateBoards
  );
  app.delete(
    "/:boardId",
    param("boardId").custom((value) => {
      if (!validation.isObjectId(value)) {
        return Promise.reject("invalid id");
      } else return Promise.resolve();
    }),
    validation,
    userIsLoggedIn,
    userIsVerified,
    deleteBoard
  );

*/
