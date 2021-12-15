import Verifier from 'email-verifier'
import { env } from 'process'
import { logger } from "../utils/logger.js";

export const checkEmailExistence = (req, res, next) => {
    logger.info("Middleware executed")
    const { email } = req.body
    let verifier = new Verifier(env.EMAIL_VERIFICATION);
    verifier.verify(email, (err, data) => {
        if (err) logger.error(err)
        logger.info(data.disposableCheck)
        if (!data.disposableCheck) {
            next()
        } else {
            logger.log("FALSE")
            return res.status(400).json({ success: false, message: "Email address does not exists" })
        }
    })
}