import {Request, Response} from "express";
import {INTERFACE, PATCHPANEL, RACK} from "../models/models";
import {CABLES} from "../models/relations";
import {query} from "./helpers/neo4j";


// GET /cables
const getAll = async (request: Request, response: Response) => {
    // const cypher = `MATCH (d1:${PATCHPANEL})<--(n:${INTERFACE})-[r${CABLES}]
    //                     ->(m:${INTERFACE})-->(d2:${PATCHPANEL}) 
    //                 RETURN n, m, r, d1, d2`
    
    const cypher = `MATCH (n:${INTERFACE})-[r${CABLES}]->(m:${INTERFACE})
                    MATCH (n)-->(d1:${PATCHPANEL})-->(r1:${RACK})
                    MATCH (m)-->(d2:${PATCHPANEL})-->(r2:${RACK})
                    RETURN  n, m, r, d1, r1, d2, r2`

    const {status, result} = await query(cypher, {}, 'cables')
    return response.status(status).json(result)
}

// GET /cables/:id
const getOne = async (request: Request, response: Response) => {
    const id:string = request.params.id
    const cypher = `MATCH (n:${INTERFACE})-[r${CABLES}]->(m:${INTERFACE})
                    MATCH (n)-->(d1:${PATCHPANEL})-->(r1:${RACK})
                    MATCH (m)-->(d2:${PATCHPANEL})-->(r2:${RACK}) 
                    WHERE r.uuid = $id
                    RETURN n, m, r, d1, d2, r1, r2`

    if (!id) {
        response.status(400).json({
            error: 'ID param is required'
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
    const startId: string = request.body.startId
    const endId: string = request.body.endId
    const cypher = `MATCH (n:${INTERFACE}), (m:${INTERFACE})
                    MATCH (n)-->(d1:${PATCHPANEL})-->(r1:${RACK})
                    MATCH (m)-->(d2:${PATCHPANEL})-->(r2:${RACK}) 
                    WHERE n.uuid = $startId AND m.uuid = $endId AND n.type=m.type
                            AND NOT (n)-[${CABLES}]-(:${INTERFACE})
                            AND NOT (m)-[${CABLES}]-(:${INTERFACE})
                    CREATE (n)-[r${CABLES} {uuid: apoc.create.uuid(),
                                            type: n.type}]->(m)
                    RETURN n, m, r, d1, d2, r1, r2`


    if (!startId || !endId) {
        response.status(400).json({
            error: 'ID param is required'
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
