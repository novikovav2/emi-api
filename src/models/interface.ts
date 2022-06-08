import {material} from "./material";

export interface Interface {
    id: string,
    name: string,
    type: material,
    connected: boolean,
    logicalConnected: boolean,
    owner: {
        id: string,
        name: string
    }
}
