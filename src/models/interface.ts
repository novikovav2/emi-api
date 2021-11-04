import {material} from "./material";

export interface Interface {
    id: number,
    name: string,
    type: material,
    connected: boolean
    owner: {
        id: number,
        name: string
    }
}
