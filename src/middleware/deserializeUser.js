import get from 'lodash/get.js'
import { verifyJwt } from '../utils/jwt_utils.js'
export const deserializeUser = async (req, res, next) => {
    const accessToken = get(req, "headers.authorization", "").replace(/^Bearer\s/, "")
    if (!accessToken) {
        return next()
    }
    const { decoded, expired } = await verifyJwt(accessToken)
    if (decoded) {
        res.locals.user = decoded;
        return next()
    }
    return next()
}