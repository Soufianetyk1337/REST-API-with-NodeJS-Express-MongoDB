import Verifier from "email-verifier";
import { env } from "process";
import { logger } from "../utils/logger.js";

export const checkEmailExistence = (req, res, next) => {
    const { email } = req.body;
    let verifier = new Verifier(env.EMAIL_VERIFICATION);
    verifier.verify(email, (err, data) => {
        logger.info(data);
        if (err) {
            logger.error(err);
            return false;
        }
        if (data.formatCheck && data?.formatCheck === false) {
            return res.status(400).json({
                success: false,
                message: "Email address syntax is not valid",
            });
        }
        if (data.formatCheck && data.disposableCheck === true) {
            return res.status(400).json({
                success: false,
                message: "Email address already taken",
            });
        }

        if (data.smtpCheck && data.dnsCheck) {
            return next();
        }

        return res.status(400).json({
            success: false,
            message: "Email address does not exists",
        });

    });
};
