import {Request, Response} from "express";
import {DEVICES_IN_RACK, PATCHPANELS_IN_RACK, RACKS_IN_ROOM} from "../models/relations";
import {DEVICE, PATCHPANEL, RACK, ROOM} from "../models/models";
import {query} from "./helpers/neo4j";

// GET /racks
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (m:${RACK})-[${RACKS_IN_ROOM}]->(n:${ROOM}) RETURN n, m`

    const {status, result} = await query(cypher, {}, 'rack')
    return response.status(status).json(result)
}

// GET /racks/:id
const getOne = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (m:${RACK})-[${RACKS_IN_ROOM}]->(n:${ROOM}) where ID(m) = $id RETURN n,m`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'rack', false)
    return response.status(status).json(result)
}

// POST /racks
// Params:
//  name - name of rack
//  roomId - ID of room
const add = async (request: Request, response: Response) => {
    const name: string = request.body.name
    const roomId: string = request.body.roomId
    const cypher = `MATCH (n:${ROOM}) where ID(n)=$roomId
                    CREATE (m:${RACK} {name: $name})-[${RACKS_IN_ROOM}]->(n)
                    RETURN n,m`
    console.log(typeof roomId)
    if (!roomId) {
        response.status(400).json({
            error: 'roomId param is required'
        })
    } else if  (!name) {
        response.status(400).json({
            error: 'Name param is required'
        })
    } else {
        const {status, result} = await query(cypher, {name: name, roomId: roomId}, 'rack', false)
        return response.status(status).json(result)
    }


}

// POST /racks/:id
const update = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const name: string = request.body.name
    const cypher = `MATCH (m:${RACK})-[${RACKS_IN_ROOM}]->(n:${ROOM}) where ID (m)=$id 
                    SET m.name=$name 
                    RETURN n, m`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    if (!name) {
        response.status(400).json({
            error: 'Name param is required'
        })
    }

    const {status, result} = await query(cypher, {id: id, name: name}, 'rack', false)
    return response.status(status).json(result)
}

// DELETE /racks/:id
const remove = async (request: Request, response: Response) => {
    const id: number = +request.params.id
    const cypher = `MATCH (m:${RACK})-[r]-() WHERE ID(m)=$id DELETE r,m`

    if (!id) {
        response.status(400).json({
            error: 'ID must be a number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'rack')
    return response.status(status).json(result)
}

// GET /racks/:id/devices
const getDevices = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (m:${RACK})<-[${DEVICES_IN_RACK}]-(n:${DEVICE}) where ID(m) = $id RETURN n,m`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'device')
    return response.status(status).json(result)
}

// GET /racks/:id/patchpanels
const getPatchpanels = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (m:${RACK})<-[${PATCHPANELS_IN_RACK}]-(n:${PATCHPANEL}) where ID(m) = $id RETURN n,m`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'patchpanel')
    return response.status(status).json(result)
}

export default {getAll, getOne, add, update, remove, getDevices, getPatchpanels}
