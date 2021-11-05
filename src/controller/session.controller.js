import { access } from 'fs'
import { env } from 'process'
import { validateUserPassword } from "../service/user.service.js";
import { createSession, getSessions, updateSession } from '../service/session.service.js'
import { signJwt } from '../utils/jwt_utils.js';
export const createUserSessionHandler = async (req, res) => {
    //Validate User Password
    const user = await validateUserPassword(req.body)
    if (!user) return res.status(401).send("Invalid email or password")
    //Create A Session
    const session = await createSession(user._id, req.get('user-agent') || "")
    // Create An Access Token
    const accessToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: env.ACCESS_TOKEN_TIME_TO_LIVE }
    )
    // Create A Refresh Token
    const refreshToken = signJwt(
        { ...user, session: session._id },
        { expiresIn: env.ACCESS_TOKEN_TIME_TO_LIVE }
    )
    // Return Refresh And Access Token
    res.send({ accessToken, refreshToken })
}


export const getUserSessionHandler = async (req, res) => {
    const userId = res.locals.user.payload._id;
    const sessions = await getSessions({ user: userId, valid: true })
    return res.send(sessions)
}

export const deleteUserSessionHandler = async (req, res) => {
    const sessionId = res.locals.user.session;
    console.log("Locals", res.locals.user)
    const isSessionUpdated = await updateSession({ _id: sessionId }, { valid: false })
    return res.send({ accessToken: null, refreshToken: null })
}