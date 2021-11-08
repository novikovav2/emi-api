import express from "express";
import authController from '../controllers/auth'
import {auth} from "../controllers/middleware";

export const authRouter = express.Router()

authRouter.post('/signUp', authController.signUp)
authRouter.post('/signIn', authController.signIn)
authRouter.get('/verify', auth, authController.verify)
