import {Interface} from "./interface";
import {material} from "./material";

// export interface Cable {
//     id: number,
//     type: material,
//     start: Partial<Interface>,
//     end: Partial<Interface>
// }

export interface Cable {
    id: string,
    type: material,
    start: {
        rack: {
            id: string,
            name: string
        },
        patchpanel: {
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
        patchpanel: {
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