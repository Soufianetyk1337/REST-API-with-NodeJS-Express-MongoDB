import mongoose from 'mongoose'
import {
    UserModel
} from '../model/user.model.js'
import {
    logger
} from './../utils/logger.js'
import omit from 'lodash/omit.js'
export const createUser = async (req, res) => {
    try {
        const userData = req.body;
        const createdUser = await UserModel.create(userData)
        return omit(createdUser.toJSON(), ["password"])
    } catch (error) {
        logger.error(error.message)
        res.send(error.message)
    }
}

export const validateUserPassword = async ({ email, password }) => {
    const user = await UserModel.findOne({ email })
    if (!user) {
        return false;
    }
    const passwordMatches = await user.comparePassword(password)
    if (!passwordMatches) { return false; }
    return omit(user.toJSON(), ["password"])
}