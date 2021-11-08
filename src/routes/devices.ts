import express from "express";
import devicesController from '../controllers/devices'
import {auth} from "../controllers/middleware";
const devicesRouter = express.Router()

devicesRouter.get('/', auth, devicesController.getAll)
devicesRouter.get('/:id', auth, devicesController.getOne)
devicesRouter.post('/', auth, devicesController.add)
devicesRouter.post('/:id', auth, devicesController.update)
devicesRouter.delete('/:id', auth, devicesController.remove)

devicesRouter.get('/:id/interfaces', auth, devicesController.getInterfaces)
devicesRouter.post('/:id/interfaces', auth, devicesController.createInterface)
devicesRouter.delete('/:id/interfaces/:intId', auth, devicesController.removeInterface)


export = devicesRouter
