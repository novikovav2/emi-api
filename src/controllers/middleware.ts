import {NextFunction, Request, Response} from "express";
import {renewJWT} from "./helpers/auth";
const jwt = require("jsonwebtoken")

export const auth = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers['authorization']

    if (!authHeader) {
        return response.status(403).json({error: "Token required"})
    }

    const userToken = authHeader.split(' ')[1]

    try {
        await jwt.verify(userToken, process.env.SECRET_KEY)
        const newToken = await renewJWT(userToken)

        if (newToken) {
            response.setHeader('x-new-token', newToken)
        } else {
            return response.status(401).json({ error: "Token not found"})
        }
    } catch (error) {
        return response.status(401).json({ error: "Token invalid"})
    }
    return next()
}
