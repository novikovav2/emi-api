import {Token} from "../../models/token";

const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")

export const emailValidator = (email: string): boolean => {
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegexp.test(email)
}

export const passwordCheck = (password:string, hash: string) => {
    return  bcrypt.compareSync(password, hash)
}

export const generateJWT = async (email: string) => {
    const token: string =  await jwt.sign({user: email}, process.env.SECRET_KEY, { expiresIn: '1d' })
    const expAt = new Date(jwt.verify(token, process.env.SECRET_KEY).exp * 1000)

    return { token, expAt }
}

export const renewJWT = async (userToken: string) => {
    try {
        const tokenDB = await Token.findOne({ where: {jwt: userToken}})
        if (!tokenDB) {
            return
        }
        const user = await tokenDB.getUser()
        const { token, expAt } = await generateJWT(user.email)
        await user.createToken({jwt: token, expAt: expAt, active: true})
        await tokenDB.destroy()
        return token
    } catch (e) {
        console.log('Error occurred while renewJWT: ', e)
    }
}

export const deleteJWT = async (token: string) => {
    try {
        const tokenDB = await Token.findOne({ where: {jwt: token}})
        if (!tokenDB) {
            return
        }
        await tokenDB.destroy()
        return { status: 'ok' }
    } catch (e) {
        console.log('Error occurred while deleteJWT: ', e)
    }
}
