import Vue from "vue";
import Vuex from "vuex";
import sensor from "../models/sensor";
import agent from "../models/agent";
import position from "../models/position";
import floorPlanDetails from "../models/floorPlanDetails";
import entity from "../models/entity";
Vue.use(Vuex);



export default new Vuex.Store({
  state: {
    agents: JSON.parse("" + sessionStorage.getItem("agents")) || Array<agent>(),
    sensors: Array<sensor>(),
    entities: JSON.parse("" + sessionStorage.getItem("entities")) || Array<entity>(),
    walls: JSON.parse("" + sessionStorage.getItem("walls")) || Array<position>(),
    floorPlanDetails: JSON.parse("" + sessionStorage.getItem("floorPlanDetails")) || new floorPlanDetails(0, 0, 0),
    passiveSensors: JSON.parse("" + sessionStorage.getItem("passiveSensors")) || Array<string>(),
    activeSensors: JSON.parse("" + sessionStorage.getItem("activeSensors")) || Array<string>(),
    filterText: sessionStorage.getItem("filterText") || "",
    activities: sessionStorage.getItem("activities") || "",
    visualSimulation: sessionStorage.getItem("visualSimulation") || "false",
  },

  mutations: {
    setVisualSimulation(state, newVisual: string) {
      state.visualSimulation = newVisual;
      sessionStorage.setItem("visualSimulation", state.visualSimulation);
    },
    addActiveSensors(state, newActive: string[]) {
      state.activeSensors = newActive;
      sessionStorage.setItem("activeSensors", JSON.stringify(state.activeSensors));
    },
    updateFilterText(state, text: string) {
      state.filterText = text;
      sessionStorage.setItem("filterText", state.filterText);
    },
    updateActivities(state, text: string) {
      state.activities = text;
      sessionStorage.setItem("activities", state.activities);
    },
    addPassiveSensors(state, newPassive: string[]) {
      state.passiveSensors = newPassive;
      sessionStorage.setItem("passiveSensors", JSON.stringify(state.passiveSensors));
    },
    addSensor(state, newSensor: sensor) {
      state.sensors.push(newSensor);
      sessionStorage.setItem("sensors", JSON.stringify(state.sensors));
    },
    addEntity(state, newEntity: entity) {
      state.entities.push(newEntity);
      sessionStorage.setItem("entities", JSON.stringify(state.entities));
    },
    addAgent(state, newAgent: agent) {
      state.agents.push(newAgent);
      sessionStorage.setItem("agents", JSON.stringify(state.agents));
    },
    addWall(state, newWall: position) {
      let foundWall = false;
      state.walls.forEach((wall: position) => {
        if (JSON.stringify(wall) === JSON.stringify(newWall)) {
          foundWall = true;
        }
      });
      if (!foundWall) {
        state.walls.push(newWall);
        sessionStorage.setItem("walls", JSON.stringify(state.walls));
      }
    },
    removeWall(state, wall: position) {
      state.walls = state.walls.filter((e: position) => !(e.x == wall.x && e.y == wall.y));
      sessionStorage.setItem("walls", JSON.stringify(state.walls));
    },
    removeSensor(state, sensor: sensor) {
      state.sensors = state.sensors.filter((e: sensor) => !(e.name == sensor.name));
      sessionStorage.setItem("sensors", JSON.stringify(state.sensors));
    },
    removeEntity(state, entity: entity) {
      state.entities = state.entities.filter((e: entity) => !(e.name == entity.name));
      sessionStorage.setItem("entities", JSON.stringify(state.entities));
    },
    removeAgent(state, agent: agent) {
      state.agents = state.agents.filter((e: agent) => !(e.id == agent.id));
      sessionStorage.setItem("agents", JSON.stringify(state.agents));
    },
    editEntity(state, entity: entity) {
      state.entities = state.entities.filter((e: entity) => !(e.name == entity.name));
      state.entities.push(entity);
      sessionStorage.setItem("entities", JSON.stringify(state.entities));
    },
    editSensor(state, sensor: sensor) {
      state.sensors = state.sensors.filter((e: sensor) => !(e.name == sensor.name));
      state.sensors.push(sensor);
      sessionStorage.setItem("sensors", JSON.stringify(state.sensors));
    },
    editAgent(state, agent: agent) {
      state.agents = state.agents.filter((e: agent) => !(e.id == agent.id));
      state.agents.push(agent);
      sessionStorage.setItem("agents", JSON.stringify(state.agents));
    },
    updateFloorPlanDetails(state, newFloorPlan: floorPlanDetails) {
      state.floorPlanDetails = newFloorPlan;
      sessionStorage.setItem("floorPlanDetails", JSON.stringify(state.floorPlanDetails));
    },
    clearAllInfoOnGrid(state) {
      state.sensors = Array<sensor>();
      state.entities = Array<entity>();
      state.agents = Array<agent>();
      state.walls = Array<position>();
      sessionStorage.setItem("sensors", JSON.stringify(state.sensors));
      sessionStorage.setItem("entities", JSON.stringify(state.entities));
      sessionStorage.setItem("walls", JSON.stringify(state.walls));
      sessionStorage.setItem("agents", JSON.stringify(state.agents));
    },
  },
  getters: {
    lastSensorAdded: state => {
      return state.sensors[state.sensors.length - 1];
    },
    lastEntityAdded: state => {
      return state.entities[state.entities.length - 1];
    },
    lastAgentAdded: state => {
      return state.agents[state.agents.length - 1];
    },
    listSensors: state => {
      if (state.sensors.length == 0 && sessionStorage.getItem("sensors") !== null) {
        const sensorsObject = JSON.parse("" + sessionStorage.getItem("sensors"));
        for (let i = 0; i < sensorsObject.length; i++) {
          state.sensors.push(new sensor(sensorsObject[i].name, sensorsObject[i].physicalArea, sensorsObject[i].interactArea, sensorsObject[i].triggerFrequency, sensorsObject[i].type, sensorsObject[i].walkable, sensorsObject[i].sensorType));
        }
      }
      return state.sensors;
    },
    sensorNames: (state, getters) => {
      const sensorName: string[] = [];
      getters.listSensors.forEach((sensor: any) => {
        sensorName.push(sensor.name);
      })
      return sensorName;
    },
    entityNames: state => {
      const entityName: string[] = [];
      state.entities.forEach((entity: any) => {
        entityName.push(entity.name);
      })
      return entityName;
    },
    agentNames: state => {
      const agentName: string[] = [];
      state.agents.forEach((agent: agent) => {
        agentName.push(agent.id);
      })
      return agentName;
    },
  }
});
