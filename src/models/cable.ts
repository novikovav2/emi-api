import {Interface} from "./interface";
import {material} from "./material";

export interface Cable {
    id: number,
    type: material,
    start: Partial<Interface>,
    end: Partial<Interface>
}
