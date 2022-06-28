import {Request, Response} from "express";
import {DEVICE, INTERFACE, RACK} from "../models/models";
import {LOGICAL_LINK} from "../models/relations";
import {query} from "./helpers/neo4j";


// GET /logical-links
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (n:${INTERFACE})-[r${LOGICAL_LINK}]->(m:${INTERFACE})
                    MATCH (n)-->(d1:${DEVICE})-->(r1:${RACK})
                    MATCH (m)-->(d2:${DEVICE})-->(r2:${RACK})
                    RETURN n, m, r, d1, d2, r1, r2`

    const {status, result} = await query(cypher, {}, 'logicalLink')
    return response.status(status).json(result)
}

// GET /logicalLinks/:id
const getOne = async (request: Request, response: Response) => {
    const id:string = request.params.id
    const cypher = `MATCH (n:${INTERFACE})-[r${LOGICAL_LINK}]->(m:${INTERFACE})
                    MATCH (n)-->(d1:${DEVICE})-->(r1:${RACK})
                    MATCH (m)-->(d2:${DEVICE})-->(r2:${RACK}) 
                    WHERE r.uuid = $id
                    RETURN n, m, r, d1, d2, r1, r2`

    if (!id) {
        response.status(400).json({
            error: 'ID param is required'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'logicalLink', false)
    return response.status(status).json(result)
}

// POST /logical-links
// Params:
//  startId - ID of start interface
//  endId - ID of end interface
const add = async (request: Request, response: Response) => {
    const startId: string = request.body.startId
    const endId: string = request.body.endId
    const cypher = `MATCH (d1:${DEVICE})<--(n:${INTERFACE}), (m:${INTERFACE})-->(d2:${DEVICE})
                    MATCH (d1)-->(r1:${RACK}), (d2)-->(r2:${RACK}) 
                    WHERE n.uuid = $startId AND m.uuid = $endId AND n.type=m.type
                            AND NOT (n)-[${LOGICAL_LINK}]-(:${INTERFACE})
                            AND NOT (m)-[${LOGICAL_LINK}]-(:${INTERFACE})
                    CREATE (n)-[r${LOGICAL_LINK} {uuid: apoc.create.uuid()}]->(m)
                    RETURN n, m, r, d1, d2, r1, r2`

    if (!startId || !endId) {
        response.status(400).json({
            error: 'ID param is required'
        })
    }

    const {status, result} = await query(cypher, {startId: startId, endId: endId}, 'logicalLink', false)
    return response.status(status).json(result)
}

// DELETE /logica-links/:id
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
