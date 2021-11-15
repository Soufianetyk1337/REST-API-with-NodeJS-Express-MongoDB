import { isLoggedIn } from "../utils/isLoggedIn.js"

export const userIsLoggedIn = (req, res, next) => {
    if (!isLoggedIn(req)) {
        return res.status(401).json({ error: "You must be logged in." })
    }
    next()
}