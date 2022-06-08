import {material} from "./material";

// export interface Patchcord {
//     id: number,
//     type: material,
//     start: Partial<Interface>,
//     end: Partial<Interface>
// }

export interface Patchcord {
    id: string,
    type: material,
    start: {
        rack: {
            id: string,
            name: string
        },
        owner: {
            id:string,
            name: string,
            type: string
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
        owner: {
            id:string,
            name: string,
            type: string
        },
        interface: {
            id: string,
            name: string,
            type: string
        }
    }
}