import position from "./position";

export default class sensor {
  name: string;
  positions: position[];
  triggerArea: position[];
  triggerFrequency: number;
  type: string;
  walkable:boolean;

  constructor(
    name: string,
    positions: position[],
    triggerArea: position[],
    triggerFrequency: number,
    type: string,
    walkable:boolean
  ) {
    this.name = name;
    this.positions = positions;
    this.triggerArea = triggerArea;
    this.triggerFrequency = triggerFrequency;
    this.type=type;
    this.walkable=walkable;
  }
}
