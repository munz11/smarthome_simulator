import position from "./position";

export default class sensor {
  name: string;
  interactArea: position[];
  physicalArea: position[];
  triggerFrequency: number | null;
  type: string;
  walkable:boolean;
  sensorType:string;

  constructor(
    name: string,
    physicalArea: position[],
    interactArea: position[],
    triggerFrequency: number| null,
    type: string,
    walkable:boolean,
    sensorType:string,//passive or active
  ) {
    this.name = name;
    this.interactArea=interactArea;
    this.physicalArea=physicalArea;
    this.triggerFrequency = triggerFrequency;
    this.type=type;
    this.walkable=walkable;
    this.sensorType=sensorType;
  }
}
