import {Request, Response} from "express";
import {DEVICE, INTERFACE} from "../models/models";
import {LOGICAL_LINK} from "../models/relations";
import {query} from "./helpers";


// GET /logicalLinks
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (d1:${DEVICE})<--(n:${INTERFACE})-[r${LOGICAL_LINK}]
                        ->(m:${INTERFACE})-->(d2:${DEVICE}) 
                    RETURN n, m, r, d1, d2`

    const {status, result} = await query(cypher, {}, 'logicalLink')
    return response.status(status).json(result)
}

// GET /logicalLinks/:id
const getOne = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (d1:${DEVICE})<--(n:${INTERFACE})-[r${LOGICAL_LINK}]
                        ->(m:${INTERFACE})-->(d2:${DEVICE}) 
                    WHERE ID(r)=$id
                    RETURN n, m, r, d1, d2`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'logicalLink', false)
    return response.status(status).json(result)
}

// POST /logicalLinks
// Params:
//  startId - ID of start interface
//  endId - ID of end interface
const add = async (request: Request, response: Response) => {
    const startId: number = +request.body.startId
    const endId: number = +request.body.endId
    const cypher = `MATCH (d1:${DEVICE})<--(n:${INTERFACE}), (m:${INTERFACE})-->(d2:${DEVICE})
                    WHERE ID(n)=$startId AND ID(m)=$endId AND n.type=m.type
                            AND NOT (n)-[${LOGICAL_LINK}]-(:${INTERFACE})
                            AND NOT (m)-[${LOGICAL_LINK}]-(:${INTERFACE})
                    CREATE (n)-[r${LOGICAL_LINK}]->(m)
                    RETURN n, m, r, d1, d2`

    if (!startId || !endId) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {startId: startId, endId: endId}, 'logicalLink', false)
    return response.status(status).json(result)
}

// DELETE /logicalLinks/:id
const remove = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (n:${INTERFACE})-[r${LOGICAL_LINK}]->(m:${INTERFACE}) 
                    WHERE ID(r)=$id
                    DELETE r`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'logicalLink')
    return response.status(status).json(result)
}

export default {getAll, getOne, add, remove}
