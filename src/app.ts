import express, { Express } from 'express';
import morgan from "morgan";
import * as http from "http";
import roomsRouter from "./routes/rooms";
import racksRouter from "./routes/racks";
import devicesRouter from "./routes/devices";
import patchpanelsRouter from "./routes/patchpanels";
import logicalLinksRouter from "./routes/logical-links";
import cablesRouter from "./routes/cables";
import patchcordsRouter from "./routes/patchcords";
import {authRouter} from "./routes/auth";
import {initDB} from "./db/mysql-init";

initDB()

const router: Express = express()

// Logging
router.use(morgan('dev'))
// Parse the request
router.use(express.urlencoded({ extended: false }))
// JSON data
router.use(express.json())

router.use((request, response, next) => {
    response.header('Access-Control-Expose-Headers', 'X-New-Token')
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'origin, X-Requested-With, Content-Type, Accept, Authorization')
    if (request.method === 'OPTIONS') {
        response.header('Access-Control-Allow-Methods', 'GET, DELETE, POST')
        return response.status(200).json({})
    }
    next()
})


router.use('/rooms', roomsRouter)
router.use('/racks', racksRouter)
router.use('/devices', devicesRouter)
router.use('/patchpanels', patchpanelsRouter)
router.use('/logical-links', logicalLinksRouter)
router.use('/cables', cablesRouter)
router.use('/patchcords', patchcordsRouter)
router.use('/auth', authRouter)



router.use((request, response) => {
    const error = new Error('Not found')
    return response.status(404).json({
        error: error.message
    })
})

const httpServer = http.createServer(router)
const PORT: any = process.env.PORT ?? 3000
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`))
