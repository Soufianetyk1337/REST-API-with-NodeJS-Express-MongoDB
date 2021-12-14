
import { UserModel } from "../model/user.model.js";
import { isLoggedIn } from "../utils/isLoggedIn.js";
export const userIsVerified = async (req, res, next) => {
    if (!isLoggedIn(req)) {
        return res.status(401).json({ error: "You must be logged in." })
    }
    const userId = req.session.sid;
    const user = await UserModel.findById(userId)
    if (!user) {
        return res.status(500).send({
            success: false,
            message: "Internal server error."
        })
    }
    if (user.confirmed !== true) {
        return res.status(401).json({
            success: false,
            message: "Activate your account"
        })
    }
    next()
}