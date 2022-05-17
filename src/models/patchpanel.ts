import {material} from "./material";
import {Rack} from "./rack";

export interface Patchpanel {
    id: string,
    name: string,
    type: material,
    rack: Partial<Rack>
}
