import {Rack} from "./rack";

export interface Device {
    id: number,
    name: number,
    rack: Partial<Rack>
}
