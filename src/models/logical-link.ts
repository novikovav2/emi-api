import {Interface} from "./interface";

export interface LogicalLink {
    id: number,
    start: Partial<Interface>,
    end: Partial<Interface>
}
