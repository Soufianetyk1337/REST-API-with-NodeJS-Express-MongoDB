import { env } from "process";
import { signJwt } from "../utils/jwt_utils.js";

export const tokenGenerator = (data) => {
    const accessToken = signJwt(
        { data },
        { expiresIn: env.ACCESS_TOKEN_TIME_TO_LIVE }
    );
    return accessToken;
};
