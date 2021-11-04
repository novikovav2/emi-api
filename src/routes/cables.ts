import express from "express";
import cablesController from '../controllers/cables'

const cablesRouter = express.Router()

cablesRouter.get('/', cablesController.getAll)
cablesRouter.get('/:id', cablesController.getOne)
cablesRouter.post('/', cablesController.add)
cablesRouter.delete('/:id', cablesController.remove)

export = cablesRouter
