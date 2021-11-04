import express from "express";
import patchcordsController from '../controllers/patchcords'
const patchcordsRouter = express.Router()

patchcordsRouter.get('/', patchcordsController.getAll)
patchcordsRouter.get('/:id', patchcordsController.getOne)
patchcordsRouter.post('/', patchcordsController.add)
patchcordsRouter.delete('/:id', patchcordsController.remove)

export = patchcordsRouter
