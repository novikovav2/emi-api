import {Request, Response} from "express";
import {
    INTERFACES_IN_PATCHPANEL,
    PATCHPANELS_IN_RACK
} from "../models/relations";
import {material} from "../models/material";
import {INTERFACE, PATCHPANEL, RACK} from "../models/models";
import {query} from "./helpers/neo4j";

// GET /patchpanels
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (n:${PATCHPANEL})-[${PATCHPANELS_IN_RACK}]->(m:${RACK}) RETURN n, m`

    const {status, result} = await query(cypher, {}, 'patchpanel')
    return response.status(status).json(result)
}

// GET /patchpanels/:id
const getOne = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const cypher = `MATCH (n:${PATCHPANEL})-[${PATCHPANELS_IN_RACK}]->(m:${RACK}) where ID(n) = $id RETURN n,m`

    if (!id) {
        response.status(400).json({
            error: 'ID must be number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'patchpanel', false)
    return response.status(status).json(result)
}

// POST /devices
// Params:
//  name - name of device
//  rackId - ID of rack
//  type - 'COOPER' or 'OPTIC'
const add = async (request: Request, response: Response) => {
    const name: string = request.body.name
    const rackId: string = request.body.rackId
    const type: material = request.body.type
    const cypher = `MATCH (m:${RACK}) where m.uuid = $rackId
                    CREATE (n:${PATCHPANEL} {name: $name, type: $type})-[${PATCHPANELS_IN_RACK}]->(m)
                    RETURN n,m`

    if (!name) {
        response.status(400).json({
            error: 'Name param is required'
        })
    }

    if (!rackId) {
        response.status(400).json({
            error: 'rackId param is required'
        })
    }

    if (!type || (type !== 'OPTIC' && type !== 'COPPER')) {
        response.status(400).json({
            error: 'Type must be COPPER or OPTIC'
        })
    }

    const {status, result} = await query(cypher, {name: name, rackId: rackId, type: type}, 'patchpanel', false)
    return response.status(status).json(result)
}

// POST /patchpanels/:id
const update = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const name: string = request.body.name
    const cypher = `MATCH (n:${PATCHPANEL})-[${PATCHPANELS_IN_RACK}]->(m:${RACK}) where ID (n)=$id 
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

    const {status, result} = await query(cypher, {id: id, name: name}, 'patchpanel', false)
    return response.status(status).json(result)
}

// DELETE /patchpanels/:id
const remove = async (request: Request, response: Response) => {
    const id: number = +request.params.id
    const cypher = `MATCH (n:${PATCHPANEL})-[r]-() WHERE ID(n)=$id DELETE r,n`

    if (!id) {
        response.status(400).json({
            error: 'ID must be a number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'patchpanel')
    return response.status(status).json(result)
}

//GET /patchpanels/:id/interfaces
const getInterfaces = async (request: Request, response: Response) => {
    const id: number = +request.params.id
    const cypher = `MATCH (m:${PATCHPANEL})<-[${INTERFACES_IN_PATCHPANEL}]-(n:${INTERFACE}) 
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

// POST /patchpanels/:id/interfaces
const createInterface = async (request: Request, response: Response) => {
    const id:number = +request.params.id
    const name: string = request.body.name
    const cypher = `MATCH (m:${PATCHPANEL}) where ID(m)=$id
                    CREATE (n:${INTERFACE} {name: $name, type: m.type})-[${INTERFACES_IN_PATCHPANEL}]->(m)
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

    const {status, result} = await query(cypher, {id: id, name: name}, 'interface', false)
    return response.status(status).json(result)
}

// DELETE /patchpanels/:id/interfaces/:intId
const removeInterface = async (request: Request, response: Response) => {
    const patchpanelId: number = +request.params.id
    const intId: number = +request.params.intId
    const cypher = `MATCH (n:${INTERFACE})-[r${INTERFACES_IN_PATCHPANEL}]-(m:${PATCHPANEL}) 
                    WHERE ID(n)=$intId AND ID(m)=$patchpanelId
                    DELETE r,n`

    if (!patchpanelId || !intId) {
        response.status(400).json({
            error: 'ID must be a number'
        })
    }

    const {status, result} = await query(cypher, {patchpanelId: patchpanelId, intId: intId}, 'interface')
    return response.status(status).json(result)
}


export default {getAll, getOne, add, update, remove, getInterfaces, createInterface, removeInterface}
