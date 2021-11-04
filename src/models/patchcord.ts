import {material} from "./material";
import {Interface} from "./interface";

export interface Patchcord {
    id: number,
    type: material,
    start: Partial<Interface>,
    end: Partial<Interface>
}
