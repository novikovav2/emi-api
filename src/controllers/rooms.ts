import { Request, Response } from 'express';
import {RACKS_IN_ROOM} from "../models/relations";
import {RACK, ROOM} from "../models/models";
import {query} from "./helpers/neo4j";

// GET /rooms
const getAll = async (request: Request, response: Response) => {
    const cypher = `MATCH (n:${ROOM}) RETURN n`

    const {status, result} = await query(cypher, {}, 'room')
    return response.status(status).json(result)
}

// GET /rooms/:id
const getOne = async (request: Request, response: Response) => {
    const id:string = request.params.id
    const cypher = `MATCH (n:${ROOM}) where n.uuid = $id RETURN n`

    const {status, result} = await query(cypher, {id: id}, 'room', false)
    return response.status(status).json(result)

}

// POST /rooms
const add = async (request: Request, response: Response) => {
    const title: string = request.body.title
    const cypher = `CREATE (n:${ROOM} {title: $title}) RETURN n`

    if (!title) {
        response.status(400).json({
            error: 'Title param is required'
        })
    }

    const {status, result} = await query(cypher, {title: title}, 'room', false)
    return response.status(status).json(result)
}

// POST /rooms/:id
const update = async (request: Request, response: Response) => {
    const id:string = request.params.id
    const title: string = request.body.title
    const cypher = `MATCH (n:${ROOM}) where n.uuid=$id SET n.title=$title RETURN n`

    if (!title) {
        response.status(400).json({
            error: 'Title param is required'
        })
    }

    const {status, result} = await query(cypher, {id: id, title: title}, 'room', false)
    return response.status(status).json(result)
}

// DELETE /rooms/:id
const remove = async (request: Request, response: Response) => {
    const id: string = request.params.id
    const cypher = `MATCH (n:${ROOM}) WHERE n.uuid=$id DELETE n`

    if (!id) {
        response.status(400).json({
            error: 'ID must be a number'
        })
    }

    const {status, result} = await query(cypher, {id: id}, 'room')
    return response.status(status).json(result)
}

//GET /rooms/:id/racks
const getRacks = async (request: Request, response: Response) => {
    const id: string = request.params.id
    const cypher = `MATCH (n:${ROOM})<-[${RACKS_IN_ROOM}]-(m:${RACK}) 
                    WHERE n.uuid = $id 
                    RETURN m, n`

    const {status, result} = await query(cypher, {id: id}, 'rack')
    return response.status(status).json(result)
}

export default {getAll, getOne, add, update, remove, getRacks}


// https://www.section.io/engineering-education/how-to-create-a-simple-rest-api-using-typescript-and-nodejs/
