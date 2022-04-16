import {Request, Response} from "express";
import {User} from "../models/user";
import {deleteJWT, emailValidator, generateJWT, passwordCheck} from "./helpers/auth";

const signUp = async (request: Request, response: Response) => {
    const email: string = request.body.email
    const password: string = request.body.password

    let result: any
    let status: number
    try {
        result = await User.create({email: email, password: password})
        status = 201
    } catch (error: any) {
        console.log(error)
        status = 500
        result = { error: error }
    }
    response.status(status).json(result)
}

const signIn = async (request: Request, response: Response) => {
    const email: string = request.body.email
    const password: string = request.body.password

    if (!email || !emailValidator(email)) {
        response.status(400).json({
            error: 'Email required'
        })
    }

    if (!password || password.length < 6) {
        response.status(400).json({
            error: 'Password with minimum 6 symbols required'
        })
    }
    let result:any
    let status: number
    try {
        const user = await User.findOne({ where: { email: email }}, )

        if (user && passwordCheck(password, user.password)) {
            const {token, expAt} = await generateJWT(email)
            const newToken = await user.createToken({jwt: token, expAt: expAt, active: true})
            status = 200
            result = {
                token: newToken.jwt,
                expireAt: newToken.expAt,
                user: {
                    id: user.id,
                    email: user.email
                }
            }
        } else {
            status = 422
            result = {error: 'User with this params not found'}
        }

    } catch (error) {
        console.log(error)
        status = 500
        result = {error: error}
    }
    response.status(status).json(result)
}

const verify = async (request: Request, response: Response) => {
    response.status(200).json({status: 'ok'})
}

const signOut = async (request: Request, response: Response) => {
    let result: any
    let status: any

    try {
        const authHeader = request.headers['authorization']
        if (authHeader) {
            const userToken = authHeader.split(' ')[1]
            const result = await deleteJWT(userToken)
            status = result ? 200 : 422
        } else {
            status = 401
            result = {error: 'No access'}
        }
    } catch (error) {
        console.log(error)
        status = 500
        result = {error: error}
    }
    response.status(status).json(result)
}

export default {signUp, signIn, verify, signOut}
