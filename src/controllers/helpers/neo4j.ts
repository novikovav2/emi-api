import driver from "../../db/neo4j";
import {Device} from "../../models/device";
import {Interface} from "../../models/interface";
import {Room} from "../../models/room";
import {Rack} from "../../models/rack";
import {Patchpanel} from "../../models/patchpanel";
import {Patchcord} from "../../models/patchcord";
import {LogicalLink} from "../../models/logical-link";
import {Cable} from "../../models/cable";

export type resultFormat = 'room' | 'rack' | 'device' | 'patchpanel' | 'interface' |
                            'patchcord' | 'logicalLink' | 'cables'

const formatRoom = (record: any): Room => {
    const room =  record.get('n')
    return {
        // id: room.identity.low,
        id: room.properties.uuid,
        title: room.properties.title
    }
}

const formatRack = (record: any): Rack => {
    const room =  record.get('n')
    const rack =  record.get('m')
    return {
        id: rack.properties.uuid,
        name: rack.properties.name,
        room: {
            id: room.properties.uuid,
            title: room.properties.title
        }
    }
}

const formatDevice = (record: any): Device => {
    const device =  record.get('n')
    const rack =  record.get('m')
    return {
        id: device.properties.uuid,
        name: device.properties.name,
        rack: {
            id: rack.properties.uuid,
            name: rack.properties.name,
        }
    }
}

const formatPatchpanel = (record: any): Patchpanel => {
    const patchpanel =  record.get('n')
    const rack =  record.get('m')
    return {
        id: patchpanel.properties.uuid,
        name: patchpanel.properties.name,
        type: patchpanel.properties.type,
        rack: {
            id: rack.properties.uuid,
            name: rack.properties.name,
        }
    }
}

const formatInterface = (record: any): Interface => {
    const int =  record.get('n')
    const owner =  record.get('m')
    return {
        id: int.properties.uuid,
        name: int.properties.name,
        type: int.properties.type,
        connected: int.properties.connected,
        owner: {
            id: owner.properties.uuid,
            name: owner.properties.name
        }
    }
}

const formatPatchcord = (record: any): Patchcord => {
    const start = record.get('n')
    const end = record.get('m')
    const link = record.get('r')
    const ownerStart = record.get('d1')
    const ownerEnd = record.get('d2')
    return {
        id: link.identity.low,
        type: link.properties.type,
        start: {
            id: start.identity.low,
            name: start.properties.name,
            type: start.properties.type,
            owner: {
                id: ownerStart.identity.low,
                name: ownerStart.properties.name
            }
        },
        end: {
            id: end.identity.low,
            name: end.properties.name,
            type: end.properties.type,
            owner: {
                id: ownerEnd.identity.low,
                name: ownerEnd.properties.name
            }
        }
    }
}

const formatLogicalLink = (record: any): LogicalLink => {
    const start = record.get('n')
    const end = record.get('m')
    const link = record.get('r')
    const ownerStart = record.get('d1')
    const ownerEnd = record.get('d2')
    return {
        id: link.identity.low,
        start: {
            id: start.identity.low,
            name: start.properties.name,
            type: start.properties.type,
            owner: {
                id: ownerStart.identity.low,
                name: ownerStart.properties.name
            }
        },
        end: {
            id: end.identity.low,
            name: end.properties.name,
            type: end.properties.type,
            owner: {
                id: ownerEnd.identity.low,
                name: ownerEnd.properties.name
            }
        }
    }
}

const formatCables = (record: any): Cable => {
    const start = record.get('n')
    const end = record.get('m')
    const link = record.get('r')
    const ownerStart = record.get('d1')
    const ownerEnd = record.get('d2')
    return {
        id: link.identity.low,
        type: link.properties.type,
        start: {
            id: start.identity.low,
            name: start.properties.name,
            type: start.properties.type,
            owner: {
                id: ownerStart.identity.low,
                name: ownerStart.properties.name
            }
        },
        end: {
            id: end.identity.low,
            name: end.properties.name,
            type: end.properties.type,
            owner: {
                id: ownerEnd.identity.low,
                name: ownerEnd.properties.name
            }
        }
    }
}

export const query = async (cypher: string, params: {}, returnType: resultFormat, multiple = true) => {
    const session = driver.session();
    let result: any = {}
    let status:number = 0

    try {
        const queryResult = await session.run(cypher, params)
        result = queryResult.records.map((record: any) => {
            switch (returnType) {
                case 'room': return formatRoom(record)
                case 'rack': return formatRack(record)
                case 'device': return formatDevice(record)
                case 'patchpanel': return formatPatchpanel(record)
                case 'interface': return formatInterface(record)
                case 'patchcord': return formatPatchcord(record)
                case 'logicalLink': return formatLogicalLink(record)
                case 'cables': return formatCables(record)
            }
        })
        if (multiple) {
            status = 200
        } else {
            result = result[0]
            status = result === undefined ? 404 : 200
        }
    } catch (error) {
        status = 500
        result = {error: error}
    } finally {
        await session.close()
    }

    return {status, result}
}
