import {Request, Response} from "express";
import {DEVICE, INTERFACE, PATCHPANEL} from "../models/models";
import {PATCHCORDS} from "../models/relations";
import {query} from "./helpers";


// GET /patchcords
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (d1)<--(n:${INTERFACE})-[r${PATCHCORDS}]
                        ->(m:${INTERFACE})-->(d2)
                    WHERE (d1:${DEVICE} OR d1:${PATCHPANEL})
                        AND (d2:${DEVICE} OR d2:${PATCHPANEL})
                    RETURN n, m, r, d1, d2`

    const {status, result} = await query(cypher, {}, 'patchcord')
    return response.status(status).json(result)
}

// GET /patchcords/:id
const getOne = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (d1)<--(n:${INTERFACE})-[r${PATCHCORDS}]
                        ->(m:${INTERFACE})-->(d2) 
                    WHERE ID(r)=$id AND (d1:${DEVICE} OR d1:${PATCHPANEL})
                        AND (d2:${DEVICE} OR d2:${PATCHPANEL})
                    RETURN n, m, r, d1, d2`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'patchcord', false)
    return response.status(status).json(result)
}

// POST /patchcords
// Params:
//  startId - ID of start interface
//  endId - ID of end interface
const add = async (request: Request, response: Response) => {
    const startId: number = +request.body.startId
    const endId: number = +request.body.endId
    const cypher = `MATCH (d1)<--(n:${INTERFACE}), (m:${INTERFACE})-->(d2)
                    WHERE ID(n)=$startId AND ID(m)=$endId AND n.type=m.type
                            AND NOT (n)-[${PATCHCORDS}]-(:${INTERFACE})
                            AND NOT (m)-[${PATCHCORDS}]-(:${INTERFACE})
                            AND (d1:${DEVICE} OR d1:${PATCHPANEL})
                            AND (d2:${DEVICE} OR d2:${PATCHPANEL})
                    CREATE (n)-[r${PATCHCORDS}]->(m)
                    RETURN n, m, r, d1, d2`

    if (!startId || !endId) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {startId: startId, endId: endId}, 'patchcord', false)
    return response.status(status).json(result)
}

// DELETE /patchcords/:id
const remove = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (n:${INTERFACE})-[r${PATCHCORDS}]->(m:${INTERFACE}) 
                    WHERE ID(r)=$id
                    DELETE r`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'patchcord')
    return response.status(status).json(result)
}


export default {getAll, getOne, add, remove}
