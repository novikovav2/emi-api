import express from "express";
import patchpanelsController from '../controllers/patchpanels'

const patchpanelsRouter = express.Router()

patchpanelsRouter.get('/', patchpanelsController.getAll)
patchpanelsRouter.get('/:id', patchpanelsController.getOne)
patchpanelsRouter.post('/', patchpanelsController.add)
patchpanelsRouter.post('/:id', patchpanelsController.update)
patchpanelsRouter.delete('/:id', patchpanelsController.remove)

patchpanelsRouter.get('/:id/interfaces', patchpanelsController.getInterfaces)
patchpanelsRouter.post('/:id/interfaces', patchpanelsController.createInterface)
patchpanelsRouter.delete('/:id/interfaces/:intId', patchpanelsController.removeInterface)

export = patchpanelsRouter
