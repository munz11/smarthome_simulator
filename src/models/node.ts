import position from "@/models/position";
export default class node {
    type: string;
    id: string; //position on the grid x-y
    sensorName: string | null;

    constructor(id: string) {
        this.type = "empty";
        this.id = id;
        this.sensorName = null;
    }

    setType(type: string) {
        this.type = type;
    }

    setSensor(type: string,name: string){
        this.type = type;
        this.sensorName=name;
    }

    reset() {
        this.type = "empty";
        this.sensorName = null;
    }



}