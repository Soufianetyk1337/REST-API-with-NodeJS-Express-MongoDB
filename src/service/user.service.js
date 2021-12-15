import { UserModel } from "../model/user.model.js";
import omit from "lodash/omit.js";
export const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const createdUser = await UserModel.create(userData);
        if (!createdUser) {
            return res
                .status(400)
                .json({ success: false, message: "Email already Exists!" });
        }
        return omit(createdUser.toJSON(), ["password", "confirmPassword"]);
    } catch (err) {
        return err;
    }
};

export const validateUserPassword = async ({ email, password }) => {
    const user = await UserModel.findOne({ email });
    if (!user) {
        return false;
    }
    const passwordMatches = await user.comparePassword(password);
    if (!passwordMatches) {
        return false;
    }
    return omit(user.toJSON(), ["password"]);
};
