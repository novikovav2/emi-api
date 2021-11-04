import express from "express";
import devicesController from '../controllers/devices'
const devicesRouter = express.Router()

devicesRouter.get('/', devicesController.getAll)
devicesRouter.get('/:id', devicesController.getOne)
devicesRouter.post('/', devicesController.add)
devicesRouter.post('/:id', devicesController.update)
devicesRouter.delete('/:id', devicesController.remove)

devicesRouter.get('/:id/interfaces', devicesController.getInterfaces)
devicesRouter.post('/:id/interfaces', devicesController.createInterface)
devicesRouter.delete('/:id/interfaces/:intId', devicesController.removeInterface)


export = devicesRouter
