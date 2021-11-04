import {material} from "./material";
import {Rack} from "./rack";

export interface Patchpanel {
    id: number,
    name: number,
    type: material,
    rack: Partial<Rack>
}
