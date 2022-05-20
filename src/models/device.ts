import {Rack} from "./rack";

export interface Device {
    id: string,
    name: string,
    rack: Partial<Rack>
}
