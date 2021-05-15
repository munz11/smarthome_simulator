export default class node {
    type: string[]; // empty, wall, agent, sensorInteract, sensorPhysical, entityInteract, entityPhysical
    id: string; //position on the grid x-y
    sensorName: Set<string>; // a node can contain multiple sensors 
    entityName: Set<string>; // a node can contain multiple entity names
    walkable: boolean;

    constructor(id: string) {
        this.type = [];
        this.type.push("empty");
        this.id = id;
        this.sensorName = new Set();
        this.entityName = new Set();
        this.walkable = false;
    }
    setType(type: string) {
        this.type.push(type);
    }
    removeAgent() {
        this.type = this.type.filter(value => value !== "agent");
    }
    setSensor(sensorName: string, walkable: boolean) {
        this.sensorName.add(sensorName);
        this.walkable = walkable;
    }
    setEntity(entityName: string, walkable: boolean) {
        this.entityName.add(entityName);
        this.walkable = walkable;
    }
    removeWall() {
        this.type = this.type.filter(value => value !== "wall");
    }
    reset() {
        this.type = [];
        this.type.push("empty");
        this.sensorName.clear();
        this.entityName.clear();
        this.walkable = false;
    }
    getTypeofNode(filterText: string): string {
        if (filterText != "") {
            if (this.sensorName.has(filterText)) {
                if(this.type.includes("sensorPhysical") &&this.type.includes("sensorInteract") ){
                    return "overlap";
                }else if(this.type.includes("sensorInteract")){
                    return "interact";
                }else if(this.type.includes("sensorPhysical")){
                    return "sensorPhysical";
                }
            }
            if (this.entityName.has(filterText)) {
                if(this.type.includes("entityPhysical") &&this.type.includes("entityInteract") ){
                    return "overlap";
                }else if(this.type.includes("entityInteract")){
                    return "interact";
                }else if(this.type.includes("entityPhysical")){
                    return "entityPhysical";
                }
            }
            if (this.type.includes("agent")) {
                return "agent"; //assuming that a node will contain an agent only if it can be added
            }
            if (this.type.includes("wall")) {
                return "wall";
            }
            return "empty";
        } {
            if (this.type.includes("agent")) {
                return "agent"; //assuming that a node will contain an agent only if it can be added
            }
            if (this.type.includes("sensorPhysical") && !this.walkable) {
                return "sensorPhysical"; // so only show sensors physical area if it is not walkable
            }
            if (this.type.includes("entityPhysical") && !this.walkable) {
                return "entityPhysical"; // so only show entities physical area if it is not walkable
            }
            if (this.type.includes("wall")) {
                return "wall";
            }
            return "empty";
        }
    }
    setToString(setToConsider: Set<string>): string {
        let value = "";
        setToConsider.forEach(val => {
            value += val + ",";
        })
        return value;
    }
    displayNodeInfo(): string {
        //x-y,sensornames,entitynames
        if (this.sensorName.size == 0) {
            if (this.entityName.size !== 0) {
                return this.id + "," + this.setToString(this.entityName);
            }
            return this.id;
        } else if (this.entityName.size == 0) {
            return this.id + "," + this.setToString(this.sensorName);
        }
        return this.id + "," + this.setToString(this.sensorName) + this.setToString(this.entityName);
    }
    canMoveAgentHere(): boolean {
        if (this.type.includes("wall")) {
            return false; //agent can not move to a wall node
        }
        if ((this.type.includes("sensorInteract") || this.type.includes("entityInteract")) && (this.type.includes("sensorPhysical") || this.type.includes("entityPhysical")) && !this.walkable) {
            return false; //an agent can not go to an interact area if it is also a physical area which is not walkable 
        }
        if ((this.type.includes("sensorPhysical") || this.type.includes("entityPhysical")) && this.walkable) {
            return true; // agent can go to a physical area if it is walkable
        }
        return true; //agent can go to an empty node and if it is an interact area and physical area and walkable
    }
    canAddWallHere(): boolean {
        //wall can be added if the node is empty, and is not a physical area and not added where there is an agent
        if (this.type.includes("sensorPhysical") || this.type.includes("entityPhysical")) {
            return false;
        }
        if (this.type.includes("agent")) {
            return false;
        }
        return true;
    }
    canAddSensorPhysical(): boolean {
        if (this.type.includes("wall") || this.type.includes("agent")) {
            return false; // physical can not be added on a wall or where the agent is at the moment
        }
        return true;
    }
    canAddSensorInteract(): boolean {
        return true; //atm it can be added anywhere
    }
    canAddEntityPhysical(): boolean {
        if (this.type.includes("wall") || this.type.includes("agent")) {
            return false; // physical can not be added on a wall or where the agent is at the moment
        }
        return true;
    }
    canAddEntityInteract(): boolean {
        return true; //atm it can be added anywhere
    }


}