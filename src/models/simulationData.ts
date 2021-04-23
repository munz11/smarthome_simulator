export default class simulationData {
    clock: string;
    instantSimulation: boolean;
    relativeTime: number;
    mqttOutput: boolean;
    mqttHost: string;
    mqttPort: string;
    rootTopic: string;

    constructor(clock: string, instantSimulation: boolean, relativeTime: number, mqttOutput: boolean, mqttHost: string, mqttPort: string, rootTopic: string) {
        this.clock = clock;
        this.instantSimulation = instantSimulation;
        this.relativeTime = relativeTime;
        this.mqttOutput = mqttOutput;
        this.mqttHost = mqttHost;
        this.mqttPort = mqttPort;
        this.rootTopic = rootTopic;
    }
}