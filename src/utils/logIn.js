export const logIn = (req, userId) => {
    req.session.sid = userId
    req.session.sessionCreatedAt = Date.now()
}