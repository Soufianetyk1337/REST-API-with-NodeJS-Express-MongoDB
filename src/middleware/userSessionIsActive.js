import { isLoggedIn } from "../utils/isLoggedIn.js";
import { logOut } from "../utils/logOut.js"
export const userSessionIsActive = async (req, res, next) => {
    if (isLoggedIn(req)) {
        const currentTime = Date.now()
        const { sessionCreatedAt } = req.session;
        const maxDuration = 1000 * 60 * 60 * 6; // 6Hours in ms 
        if (currentTime > sessionCreatedAt + maxDuration) {
            await logOut(req, res)
            return next(res.status(401).json({ message: "Session Expired" }))
        }
    }
    next()
}