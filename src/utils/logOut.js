export const logOut = (req, res) => {
    console.log("Logout executed")
    return new Promise((resolve, reject) => {
        req.session.destroy((err) => {
            if (err) reject(err)
            res.clearCookie("sid")
            resolve()
        })
    })
}