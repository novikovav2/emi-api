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
        logicalConnected: int.properties.logicalConnected,
        owner: {
            id: owner.properties.uuid,
            name: owner.properties.name
        }
    }
}

const formatPatchcord = (record: any): Patchcord => {
    const intStart = record.get('n')
    const intEnd = record.get('m')
    const link = record.get('r')
    const ownerStart = record.get('d1')
    const ownerEnd = record.get('d2')
    const rackStart = record.get('r1')
    const rackEnd = record.get('r2')
    return {
        id: link.properties.uuid,
        type: link.properties.type,
        start: {
            rack: {
                id: rackStart.properties.uuid,
                name: rackStart.properties.name
            },
            owner: {
                id: ownerStart.properties.uuid,
                name: ownerStart.properties.name,
                type: ownerStart.labels[0]
            },
            interface: {
                id: intStart.properties.uuid,
                name: intStart.properties.name,
                type: intStart.properties.type
            }
        },
        end: {
            rack: {
                id: rackEnd.properties.uuid,
                name: rackEnd.properties.name
            },
            owner: {
                id: ownerEnd.properties.uuid,
                name: ownerEnd.properties.name,
                type: ownerEnd.labels[0]
            },
            interface: {
                id: intEnd.properties.uuid,
                name: intEnd.properties.name,
                type: intEnd.properties.type
            }
        }
    }
}

const formatLogicalLink = (record: any): LogicalLink => {
    const intStart = record.get('n')
    const intEnd = record.get('m')
    const link = record.get('r')
    const deviceStart = record.get('d1')
    const deviceEnd = record.get('d2')
    const rackStart = record.get('r1')
    const rackEnd = record.get('r2')
    return {
        id: link.properties.uuid,
        start: {
            rack: {
                id: rackStart.properties.uuid,
                name: rackStart.properties.name
            },
            device: {
                id: deviceStart.properties.uuid,
                name: deviceStart.properties.name
            },
            interface: {
                id: intStart.properties.uuid,
                name: intStart.properties.name,
                type: intStart.properties.type,
            }
        },
        end: {
            rack: {
                id: rackEnd.properties.uuid,
                name: rackEnd.properties.name
            },
            device: {
                id: deviceEnd.properties.uuid,
                name: deviceEnd.properties.name
            },
            interface: {
                id: intEnd.properties.uuid,
                name: intEnd.properties.name,
                type: intEnd.properties.type,
            }
        }
    }
}

const formatCables = (record: any): Cable => {
    const intStart = record.get('n')
    const intEnd = record.get('m')
    const link = record.get('r')
    const ownerStart = record.get('d1')
    const ownerEnd = record.get('d2')
    const rackStart = record.get('r1')
    const rackEnd = record.get('r2')

    return {
        id: link.properties.uuid,
        type: link.properties.type,
        start: {
            rack: {
                id: rackStart.properties.uuid,
                name: rackStart.properties.name
            },
            patchpanel: {
                id: ownerStart.properties.uuid,
                name: ownerStart.properties.name
            },
            interface: {
                id: intStart.properties.uuid,
                name: intStart.properties.name,
                type: intStart.properties.type
            }
        },
        end: {
            rack: {
                id: rackEnd.properties.uuid,
                name: rackEnd.properties.name
            },
            patchpanel: {
                id: ownerEnd.properties.uuid,
                name: ownerEnd.properties.name
            },
            interface: {
                id: intEnd.properties.uuid,
                name: intEnd.properties.name,
                type: intEnd.properties.type
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
