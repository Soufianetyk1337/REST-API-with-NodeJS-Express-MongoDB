import { SessionModel } from './../model/session.model.js'


export const createSession = async (userId, userAgent) => {
    const session = await SessionModel.create({ user: userId, userAgent })
    return session.toJSON()
}


export const getSessions = async (query) => {
    return SessionModel.find(query).lean();
}

export const updateSession = async (query, update) => {
    return SessionModel.updateOne(query, update)
}