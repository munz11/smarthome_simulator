import position from "@/models/position";
import { faThumbsDown } from "@fortawesome/free-solid-svg-icons";
export default class node {
    type: string[]; // empty, wall, agent, sensorInteract, sensorPhysical, entityInteract, entityPhysical
    id: string; //position on the grid x-y
    sensorName: string[]; // a node can contain multiple sensors 
    entityName: string[]; // a node can contain multiple entity names
    walkable: boolean;

    constructor(id: string) {
        this.type = [];
        this.type.push("empty");
        this.id = id;
        this.sensorName = [];
        this.entityName = [];
        this.walkable = false;
    }
    setType(type: string) {
        this.type.push(type);
    }
    removeAgent(){
        this.type = this.type.filter(value => value !== "agent");
    }
    setSensor(sensorName: string, walkable: boolean) {
        this.sensorName.push(sensorName);
        this.walkable = walkable;
    }
    setEntity(entityName: string, walkable: boolean) {
        this.entityName.push(entityName);
        this.walkable = walkable;
    }
    removeWall() {
        this.type = this.type.filter(value => value !== "wall");
    }
    reset() {
        this.type = [];
        this.type.push("empty");
        this.sensorName = [];
        this.entityName = [];
        this.walkable = false;
    }
    getTypeofNode():string{ 
        if(this.type.includes("agent")){
            return "agent"; //assuming that a node will contain an agent only if it can be added
        }
        if(this.type.includes("sensorPhysical") && !this.walkable){
            return "sensorPhysical"; // so only show sensors physical area if it is not walkable
        }
        if(this.type.includes("entityPhysical")&& !this.walkable){
            return "entityPhysical"; // so only show entities physical area if it is not walkable
        }
        if(this.type.includes("wall")){
            return "wall";
        }
        return "empty";
    }
    displayNodeInfo():string{
        //x-y,sensornames,entitynames
        if(this.sensorName.length==0){
            return this.id;
        }else if(this.entityName.length==0){
            return this.id+","+this.sensorName.toString();
        }
        return this.id+","+this.sensorName.toString()+","+this.entityName.toString();
    }
    canMoveAgentHere():boolean{
        if(this.type.includes("wall")){
            return false; //agent can not move to a wall node
        }
        if((this.type.includes("sensorInteract") || this.type.includes("entityInteract"))&&(this.type.includes("sensorPhysical")||this.type.includes("entityPhysical"))&&!this.walkable){
            return false; //an agent can not go to an interact area if it is also a physical area which is not walkable 
        }
        if((this.type.includes("sensorPhysical")|| this.type.includes("entityPhysical"))&&this.walkable){
            return true; // agent can go to a physical area if it is walkable
        }
        return true; //agent can go to an empty node and if it is an interact area and physical area and walkable
    }
    canAddWallHere():boolean{
        //wall can be added if the node is empty, and is not a physical area and not added where there is an agent
        if(this.type.includes("sensorPhysical")||this.type.includes("entityPhysical")){
            return false;
        }
        if(this.type.includes("agent")){
            return false;
        }
        return true;
    }
    canAddSensorPhysical():boolean{
        if(this.type.includes("wall") || this.type.includes("agent")){
            return false; //sensor physical can not be added on a wall or where the agent is at the moment
        }
        return true;
    }
    canAddSensorInteract():boolean{
        return true; //atm it can be added anywhere
    }

    

}