import express from "express";
import cablesController from '../controllers/cables'
import {auth} from "../controllers/middleware";

const cablesRouter = express.Router()

cablesRouter.get('/', auth, cablesController.getAll)
cablesRouter.get('/:id', auth, cablesController.getOne)
cablesRouter.post('/', auth, cablesController.add)
cablesRouter.delete('/:id', auth, cablesController.remove)

export = cablesRouter
