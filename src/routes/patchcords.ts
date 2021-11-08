import express from "express";
import patchcordsController from '../controllers/patchcords'
import {auth} from "../controllers/middleware";
const patchcordsRouter = express.Router()

patchcordsRouter.get('/', auth, patchcordsController.getAll)
patchcordsRouter.get('/:id', auth, patchcordsController.getOne)
patchcordsRouter.post('/', auth, patchcordsController.add)
patchcordsRouter.delete('/:id', auth, patchcordsController.remove)

export = patchcordsRouter
