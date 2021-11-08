import {Request, Response} from "express";
import {DEVICES_IN_RACK, INTERFACES_IN_DEVICE} from "../models/relations";
import {DEVICE, INTERFACE, RACK} from "../models/models";
import {query} from "./helpers/neo4j";

// GET /devices
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (n:${DEVICE})-[${DEVICES_IN_RACK}]->(m:${RACK}) RETURN n, m`

    const {status, result} = await query(cypher, {}, 'device')
    return response.status(status).json(result)
}

// GET /devices/:id
const getOne = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (n:${DEVICE})-[${DEVICES_IN_RACK}]->(m:${RACK}) where ID(n) = $id RETURN n,m`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'device', false)
    return response.status(status).json(result)
}

// POST /devices
// Params:
//  name - name of device
//  rackId - ID of rack
const add = async (request: Request, response: Response) => {
    const name: string = request.body.name
    const rackId: number = +request.body.rackId
    const cypher = `MATCH (m:${RACK}) where ID(m)=$rackId
                    CREATE (n:${DEVICE} {name: $name})-[${DEVICES_IN_RACK}]->(m)
                    RETURN n,m`

    if (!name) {
        response.status(400).json({
            error: 'Name param is required'
        })
    }

    if (!rackId) {
        response.status(400).json({
            error: 'rackId must be number'
        })
    }

    const {status, result} = await query(cypher, {name: name, rackId: rackId}, 'device', false)
    return response.status(status).json(result)
}

// POST /devices/:id
const update = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const name: string = request.body.name
    const cypher = `MATCH (n:${DEVICE})-[${DEVICES_IN_RACK}]->(m:${RACK}) where ID (n)=$id 
                    SET n.name=$name 
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

    const {status, result} = await query(cypher, {id: id, name: name}, 'device', false)
    return response.status(status).json(result)
}

// DELETE /devices/:id
const remove = async (request: Request, response: Response) => {
    const id: number = +request.params.id
    const cypher = `MATCH (n:${DEVICE})-[r]-() WHERE ID(n)=$id DELETE r,n`

    if (!id) {
        response.status(400).json({
            error: 'ID must be a number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'device')
    return response.status(status).json(result)
}

//GET /devices/:id/interfaces
const getInterfaces = async (request: Request, response: Response) => {
    const id: number = +request.params.id
    const cypher = `MATCH (m:${DEVICE})<-[${INTERFACES_IN_DEVICE}]-(n:${INTERFACE}) 
                    WHERE ID(m)=$id 
                    RETURN m, n`

    if (!id) {
        response.status(400).json({
            error: 'ID must be a number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'interface')
    return response.status(status).json(result)
}

// POST /devices/:id/interfaces
const createInterface = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const name: string = request.body.name
    const type: string = request.body.type
    const cypher = `MATCH (m:${DEVICE}) where ID(m)=$id
                    CREATE (n:${INTERFACE} {name: $name, 
                                            type: $type,
                                            physicalConnected: false,
                                            logicalConnected: false
                                            })-[${INTERFACES_IN_DEVICE}]->(m)
                    RETURN n,m`

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

    if (!type || (type !== 'OPTIC' && type !== 'COPPER')) {
        response.status(400).json({
            error: 'Type must be COPPER or OPTIC'
        })
    }

    const {status, result} = await query(cypher, {id: id, name: name, type: type}, 'interface', false)
    return response.status(status).json(result)
}

// DELETE /devices/:id/interfaces/:intId
const removeInterface = async (request: Request, response: Response) => {
    const deviceId: number = +request.params.id
    const intId: number = +request.params.intId
    const cypher = `MATCH (n:${INTERFACE})-[r${INTERFACES_IN_DEVICE}]-(m:${DEVICE}) 
                    WHERE ID(n)=$intId AND ID(m)=$deviceId
                    DELETE r,n`

    if (!deviceId || !intId) {
        response.status(400).json({
            error: 'ID must be a number'
        })
    }

    const {status, result} = await query(cypher, {deviceId: deviceId, intId: intId}, 'interface')
    return response.status(status).json(result)
}

export default {getAll, getOne, add, update, remove, getInterfaces, createInterface, removeInterface}
