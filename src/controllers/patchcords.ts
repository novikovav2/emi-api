import {Request, Response} from "express";
import {DEVICE, INTERFACE, PATCHPANEL, RACK} from "../models/models";
import {PATCHCORDS} from "../models/relations";
import {query} from "./helpers/neo4j";


// GET /patchcords
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (n:${INTERFACE})-[r${PATCHCORDS}]->(m:${INTERFACE})
                    MATCH (n)-->(d1)-->(r1:${RACK})
                    MATCH (m)-->(d2)-->(r2:${RACK})
                    WHERE (d1:${DEVICE} OR d1:${PATCHPANEL})
                        AND (d2:${DEVICE} OR d2:${PATCHPANEL})
                    RETURN  n, m, r, d1, r1, d2, r2`

    const {status, result} = await query(cypher, {}, 'patchcord')
    return response.status(status).json(result)
}

// GET /patchcords/:id
const getOne = async (request: Request, response: Response) => {
    const id:string = request.params.id
    
    const cypher = `MATCH (n:${INTERFACE})-[r${PATCHCORDS}]->(m:${INTERFACE})
                    MATCH (n)-->(d1)-->(r1:${RACK})
                    MATCH (m)-->(d2)-->(r2:${RACK})
                    WHERE r.uuid = $id
                        AND (d1:${DEVICE} OR d1:${PATCHPANEL})
                        AND (d2:${DEVICE} OR d2:${PATCHPANEL})
                    RETURN  n, m, r, d1, r1, d2, r2`

    if (!id) {
        response.status(400).json({
            error: 'ID param is required'
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
    const startId: string = request.body.startId
    const endId: string = request.body.endId
    // const cypher = `MATCH (d1)<--(n:${INTERFACE}), (m:${INTERFACE})-->(d2)
    //                 WHERE ID(n)=$startId AND ID(m)=$endId AND n.type=m.type
    //                         AND NOT (n)-[${PATCHCORDS}]-(:${INTERFACE})
    //                         AND NOT (m)-[${PATCHCORDS}]-(:${INTERFACE})
    //                         AND (d1:${DEVICE} OR d1:${PATCHPANEL})
    //                         AND (d2:${DEVICE} OR d2:${PATCHPANEL})
    //                 CREATE (n)-[r${PATCHCORDS} {uuid: apoc.create.uuid()}]->(m)
    //                 RETURN n, m, r, d1, d2`
    const cypher = `MATCH (r1:${RACK})<--(d1)<--(n:${INTERFACE}) 
                        WHERE n.uuid = $startId
                        AND NOT (n)-[${PATCHCORDS}]-(:${INTERFACE})
                        AND (d1:${DEVICE} OR d1:${PATCHPANEL})
                        AND n.connected = false
                    MATCH (r2:${RACK})<--(d2)<--(m:${INTERFACE}) 
                        WHERE m.uuid = $endId
                        AND NOT (m)-[${PATCHCORDS}]-(:${INTERFACE})
                        AND (d2:${DEVICE} OR d2:${PATCHPANEL})
                        AND m.connected = false
                    MERGE (n)-[r${PATCHCORDS} {uuid: apoc.create.uuid(), 
                        type: n.type}]->(m)
                    SET n.connected = true, m.connected = true
                    return r1,r2,d1,d2,n,m,r`
                    
    if (!startId || !endId) {
        response.status(400).json({
            error: 'ID param is required'
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
