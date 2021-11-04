import express from "express";
import racksController from '../controllers/racks'

const racksRouter = express.Router()

racksRouter.get('/', racksController.getAll)
racksRouter.get('/:id', racksController.getOne)
racksRouter.post('/', racksController.add)
racksRouter.post('/:id', racksController.update)
racksRouter.delete('/:id', racksController.remove)

racksRouter.get('/:id/devices', racksController.getDevices)
racksRouter.get('/:id/patchpanels', racksController.getPatchpanels)

export = racksRouter
