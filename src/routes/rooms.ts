import express from "express";
import roomsController from '../controllers/rooms'
import {auth} from "../controllers/middleware";
const roomsRouter = express.Router()

roomsRouter.get('/', auth, roomsController.getAll)
roomsRouter.get('/:id', auth, roomsController.getOne)
roomsRouter.post('/', auth, roomsController.add)
roomsRouter.post('/:id', auth, roomsController.update)
roomsRouter.delete('/:id', auth, roomsController.remove)

roomsRouter.get('/:id/racks', auth, roomsController.getRacks)

export = roomsRouter
