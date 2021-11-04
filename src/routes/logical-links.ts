import express from "express";
import logicalLinksController from '../controllers/logical-links'

const logicalLinksRouter = express.Router()

logicalLinksRouter.get('/', logicalLinksController.getAll)
logicalLinksRouter.get('/:id', logicalLinksController.getOne)
logicalLinksRouter.post('/', logicalLinksController.add)
logicalLinksRouter.delete('/:id', logicalLinksController.remove)


export = logicalLinksRouter
