import { validateUserPassword } from "../service/user.service.js";
import { getSessions } from "../service/session.service.js";
import { logIn } from "../utils/logIn.js";
import { logger } from "../utils/logger.js";
export const createUserSessionHandler = async (req, res) => {
  /* eslint-disable no-unused-vars */
  const { email } = req.body;
  const limitConsecutiveFailsByEmailAndIp =
    res.locals.limitConsecutiveFailsByEmailAndIp;
  const emailIpKey = res.locals.emailIpKey;
  const user = await validateUserPassword(req.body);
  if (!user) return res.status(401).send("Invalid email or password");

  await logIn(req, user._id);
  // eslint-disable-next-line no-undef
  console.log(req.cookies, req.headers.cookie);
  try {
    await limitConsecutiveFailsByEmailAndIp.delete(emailIpKey);
    res.status(200).json({
      success: true,

      message: "You have successfully logged in.",
    });
  } catch (error) {
    logger.error(error);
  }
};

export const getUserSessionHandler = async (req, res) => {
  const userId = res.locals.user.payload._id;
  const sessions = await getSessions({ user: userId, valid: true });
  return res.send(sessions);
};

export const deleteUserSessionHandler = async (req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) {
      res.status(400).json(err);
    }
    res.clearCookie("sid");
    res.status(200).json({
      success: "true",
      message: "You have successfully logged out",
    });
  });
};
