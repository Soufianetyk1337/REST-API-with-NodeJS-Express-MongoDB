import { isLoggedIn } from "../utils/isLoggedIn.js";

export const userIsGuest = (req, res, next) => {
  if (isLoggedIn(req)) {
    return res.status(400).send({ message: "You are already logged in." });
  }
  next();
};
