import {Request, Response} from "express";
import {DEVICES_IN_RACK, PATCHPANELS_IN_RACK, RACKS_IN_ROOM} from "../models/relations";
import {DEVICE, PATCHPANEL, RACK, ROOM} from "../models/models";
import {query} from "./helpers/neo4j";

// GET /racks
const getAll = async (request: Request, response: Response) => {
    const order = request.query.order
    const direction = request.query.direction
    const filter = request.query.filter
    let cypher = `MATCH (m:${RACK})-[${RACKS_IN_ROOM}]->(n:${ROOM}) `
    
    if (filter) {
        cypher = cypher + `WHERE n.title CONTAINS $filter OR m.name CONTAINS $filter`
    }

    cypher = cypher + ' RETURN n,m '

    if (order && direction) {
        switch (order) {
            case "name":
                cypher = cypher + ` ORDER BY m.name ${direction}`
                break
            case "room":
                cypher = cypher + ` ORDER BY n.title ${direction}`
                break
            default:
                break
        }     
    }

    const {status, result} = await query(cypher, {filter}, 'rack')
    return response.status(status).json(result)
}

// GET /racks/:id
const getOne = async (request: Request, response: Response) => {
    const id:string = request.params.id
    const cypher = `MATCH (m:${RACK})-[${RACKS_IN_ROOM}]->(n:${ROOM}) where m.uuid = $id RETURN n,m`

    if (!id) {
        response.status(400).json({
            error: 'ID is required'
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
    const cypher = `MATCH (n:${ROOM}) where n.uuid=$roomId
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
    const id:string = request.params.id
    const name: string = request.body.name
    const cypher = `MATCH (m:${RACK})-[${RACKS_IN_ROOM}]->(n:${ROOM}) where m.uuid = $id 
                    SET m.name=$name 
                    RETURN n, m`

    if (!id) {
        response.status(400).json({
            error: 'ID is required'
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
    const id: string = request.params.id
    const cypher = `MATCH (m:${RACK})-[r]-() WHERE m.uuid = $id DELETE r,m`

    if (!id) {
        response.status(400).json({
            error: 'ID is required'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'rack')
    return response.status(status).json(result)
}

// GET /racks/:id/devices
const getDevices = async (request: Request, response: Response) => {
    const id:string = request.params.id
    const cypher = `MATCH (m:${RACK})<-[${DEVICES_IN_RACK}]-(n:${DEVICE}) where m.uuid = $id RETURN n,m`

    if (!id) {
        response.status(400).json({
            error: 'ID is required'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'device')
    return response.status(status).json(result)
}

// GET /racks/:id/patchpanels
const getPatchpanels = async (request: Request, response: Response) => {
    const id:string = request.params.id
    const cypher = `MATCH (m:${RACK})<-[${PATCHPANELS_IN_RACK}]-(n:${PATCHPANEL}) 
                        where m.uuid = $id RETURN n,m`

    if (!id) {
        response.status(400).json({
            error: 'ID is required'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'patchpanel')
    return response.status(status).json(result)
}

export default {getAll, getOne, add, update, remove, getDevices, getPatchpanels}
