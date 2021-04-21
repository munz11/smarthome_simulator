import position from "./position";

export default class sensor {
  id: string;
  name: string;
  positions: position[];
  triggerArea: position[];
  triggerFrequency: number;

  constructor(
    id: string,
    name: string,
    positions: position[],
    triggerArea: position[],
    triggerFrequency: number
  ) {
    this.id = id;
    this.name = name;
    this.positions = positions;
    this.triggerArea = triggerArea;
    this.triggerFrequency = triggerFrequency;
  }
}
