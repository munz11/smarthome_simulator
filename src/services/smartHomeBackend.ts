export default class smartHomeBackend {
  url: { protocol: string; hostname: string };
  constructor() {
    this.url = { protocol: "http", hostname: "linac.compute.dtu.dk" };
  }

  getUrl(): string {
    return this.url["protocol"] + "://" + this.url["hostname"];
  }

  getUrlPing(): string {
    return this.getUrl() + "/api/system/ping";
  }

  getUrlInput(): string {
    return this.getUrl() + "/api/simulation/input";
  }

  getUrlRoomConfig(): string {
    return this.getUrl() + "/api/roomConfig/floorplan";
  }
  getUrlSimulation(): string{
    return this.getUrl() +"/api/simulation/simulator";
  }
  getUrlActiveSensors(): string{
    return this.getUrl() +"/api/system/activeSensors";
  }
  getUrlPassiveSensors(): string{
    return this.getUrl() +"/api/system/passiveSensors";
  }
}
