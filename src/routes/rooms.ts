import express from "express";
import roomsController from '../controllers/rooms'
const roomsRouter = express.Router()

roomsRouter.get('/', roomsController.getAll)
roomsRouter.get('/:id', roomsController.getOne)
roomsRouter.post('/', roomsController.add)
roomsRouter.post('/:id', roomsController.update)
roomsRouter.delete('/:id', roomsController.remove)

roomsRouter.get('/:id/racks', roomsController.getRacks)

export = roomsRouter
