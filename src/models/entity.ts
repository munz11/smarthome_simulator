import position from "./position";

export default class entity {
    name: string;
    interactArea: position[];
    physicalArea: position[];
    walkable: boolean;

    constructor(name: string, interactArea: position[], physicalArea: position[], walkable: boolean) {
        this.name = name;
        this.interactArea = interactArea;
        this.physicalArea = physicalArea;
        this.walkable = walkable;
    }
}