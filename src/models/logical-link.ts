export interface LogicalLink {
    id: string,
    start: {
        rack: {
            id: string,
            name: string
        },
        device: {
            id:string,
            name: string            
        },
        interface: {
            id: string,
            name: string,
            type: string
        }
    },
    end: {
        rack: {
            id: string,
            name: string
        },
        device: {
            id:string,
            name: string
        },
        interface: {
            id: string,
            name: string,
            type: string
        }
    }
}