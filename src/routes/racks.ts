import express from "express";
import racksController from '../controllers/racks'
import {auth} from "../controllers/middleware";

const racksRouter = express.Router()

racksRouter.get('/', auth, racksController.getAll)
racksRouter.get('/:id', auth, racksController.getOne)
racksRouter.post('/', auth, racksController.add)
racksRouter.post('/:id', auth, racksController.update)
racksRouter.delete('/:id', auth, racksController.remove)

racksRouter.get('/:id/devices', auth, racksController.getDevices)
racksRouter.get('/:id/patchpanels', auth, racksController.getPatchpanels)

export = racksRouter
