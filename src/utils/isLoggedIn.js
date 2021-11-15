export const isLoggedIn = (req) => {
    return req.session.sid !== undefined
}