export default class smartHomeBackend {
  url: { protocol: string; hostname: string };
  constructor() {
    this.url = { protocol: "http", hostname: "localhost:8080" };
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
}
