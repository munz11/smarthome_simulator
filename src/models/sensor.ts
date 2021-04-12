import position from './position';

export default class sensor {
    id: string;
    name: string;
    positions:position[];
    triggerArea:position[];

    constructor(id:string,name:string,positions:position[],triggerArea:position[]){
        this.id = id;
        this.name=name;
        this.positions=positions;
        this.triggerArea=triggerArea;
    }
}