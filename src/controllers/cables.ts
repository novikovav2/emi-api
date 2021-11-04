import {Request, Response} from "express";
import {INTERFACE, PATCHPANEL} from "../models/models";
import {CABLES} from "../models/relations";
import {query} from "./helpers";


// GET /cables
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (d1:${PATCHPANEL})<--(n:${INTERFACE})-[r${CABLES}]
                        ->(m:${INTERFACE})-->(d2:${PATCHPANEL}) 
                    RETURN n, m, r, d1, d2`

    const {status, result} = await query(cypher, {}, 'cables')
    return response.status(status).json(result)
}

// GET /cables/:id
const getOne = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (d1:${PATCHPANEL})<--(n:${INTERFACE})-[r${CABLES}]
                        ->(m:${INTERFACE})-->(d2:${PATCHPANEL}) 
                    WHERE ID(r)=$id
                    RETURN n, m, r, d1, d2`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'cables', false)
    return response.status(status).json(result)
}


// POST /cables
// Params:
//  startId - ID of start interface
//  endId - ID of end interface
const add = async (request: Request, response: Response) => {
    const startId: number = +request.body.startId
    const endId: number = +request.body.endId
    const cypher = `MATCH (d1:${PATCHPANEL})<--(n:${INTERFACE}), (m:${INTERFACE})-->(d2:${PATCHPANEL})
                    WHERE ID(n)=$startId AND ID(m)=$endId AND n.type=m.type
                            AND NOT (n)-[${CABLES}]-(:${INTERFACE})
                            AND NOT (m)-[${CABLES}]-(:${INTERFACE})
                    CREATE (n)-[r${CABLES} {type: n.type}]->(m)
                    RETURN n, m, r, d1, d2`

    if (!startId || !endId) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {startId: startId, endId: endId}, 'cables', false)
    return response.status(status).json(result)
}

// DELETE /cables/:id
const remove = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (n:${INTERFACE})-[r${CABLES}]->(m:${INTERFACE}) 
                    WHERE ID(r)=$id
                    DELETE r`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'cables')
    return response.status(status).json(result)
}


export default {getAll, getOne, add, remove}
