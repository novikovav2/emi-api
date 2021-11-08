import express from "express";
import patchpanelsController from '../controllers/patchpanels'
import {auth} from "../controllers/middleware";

const patchpanelsRouter = express.Router()

patchpanelsRouter.get('/', auth, patchpanelsController.getAll)
patchpanelsRouter.get('/:id', auth, patchpanelsController.getOne)
patchpanelsRouter.post('/', auth, patchpanelsController.add)
patchpanelsRouter.post('/:id', auth, patchpanelsController.update)
patchpanelsRouter.delete('/:id', auth, patchpanelsController.remove)

patchpanelsRouter.get('/:id/interfaces', auth, patchpanelsController.getInterfaces)
patchpanelsRouter.post('/:id/interfaces', auth, patchpanelsController.createInterface)
patchpanelsRouter.delete('/:id/interfaces/:intId', auth, patchpanelsController.removeInterface)

export = patchpanelsRouter
