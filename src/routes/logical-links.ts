import express from "express";
import logicalLinksController from '../controllers/logical-links'
import {auth} from "../controllers/middleware";

const logicalLinksRouter = express.Router()

logicalLinksRouter.get('/', auth, logicalLinksController.getAll)
logicalLinksRouter.get('/:id', auth, logicalLinksController.getOne)
logicalLinksRouter.post('/', auth, logicalLinksController.add)
logicalLinksRouter.delete('/:id', auth, logicalLinksController.remove)


export = logicalLinksRouter
