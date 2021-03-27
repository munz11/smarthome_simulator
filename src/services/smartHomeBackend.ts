export default class smartHomeBackend {
    url: { protocol: string; hostname: string; };
    constructor(){
        this.url={"protocol":"http","hostname":"localhost:8080"}
    }

    getUrl(): string{
        return this.url["protocol"]+"://"+this.url["hostname"];
    }

    getUrlPing():string{
        return this.getUrl() +"/api/v2/system/ping";
    }

    getUrlRoomConfigFloorPlan():string{
        return this.getUrl()+"/api/v2/roomConfig/floorPlan";
    }

    getUrlRoomConfigSensorsDefined(): string{
        return this.getUrl()+"/api/v2/roomConfig/sensorsDefined";
    }

}