import { readKeyFromFile } from '../helpers/readKeyFromFile.js'
const privateKey = readKeyFromFile("private_key.pem");
const publicKey = readKeyFromFile("public_key.pem");
import jwt from "jsonwebtoken";
import { logger } from '../utils/logger.js'
export const signJwt = (payload, options = {}) => {
    try {
        const formattedPrivateKey = privateKey;
        const jwtToken = jwt.sign(
            { payload },
            formattedPrivateKey,
            {
                ...(options && options),
                algorithm: "RS256"
            })
        return jwtToken;

    } catch (error) {
        logger.error("Error", error)
    }

}
export const verifyJwt = (token) => {
    try {
        const decoded = jwt.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded: decoded
        }
    } catch (error) {
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null
        }
    }
}
