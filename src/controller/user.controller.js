import { logger } from "../utils/logger.js";
import { createUser } from "../service/user.service.js";
import omit from "lodash/omit.js"
export const createUserHandler = async (req, res) => {
  try {
    const user = await createUser(req, res);
    return res.status(201).send(omit(user, ["password"]))
  } catch (error) {
    logger.error(error);
    return res.status(409).send(`error from controller :${error}`);
  }
};
