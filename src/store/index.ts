import Vue from "vue";
import Vuex from "vuex";
import sensor from "../models/sensor";
import position from "../models/position";
import floorPlanDetails from "../models/floorPlanDetails";
import entity from "../models/entity";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    agent: JSON.parse(sessionStorage.getItem("agent")) || new position(0, 0),
    agentSpeed: sessionStorage.getItem("agentSpeed") || "1",
    sensors: JSON.parse(sessionStorage.getItem("sensors")) || Array<sensor>(),
    entities: JSON.parse(sessionStorage.getItem("entities")) || Array<entity>(),
    walls: JSON.parse(sessionStorage.getItem("walls")) || Array<position>(),
    floorPlanDetails: JSON.parse(sessionStorage.getItem("floorPlanDetails")) || new floorPlanDetails(0, 0, 0),
    passiveSensors: JSON.parse(sessionStorage.getItem("passiveSensors")) || Array<string>(),
    activeSensors: JSON.parse(sessionStorage.getItem("activeSensors")) || Array<string>(),
    filterText: sessionStorage.getItem("filterText") || "",
    activities: sessionStorage.getItem("activities") || "",
  },

  mutations: {
    addActiveSensors(state, newActive: string[]) {
      state.activeSensors = newActive;
      sessionStorage.setItem("activeSensors", JSON.stringify(state.activeSensors));
    },
    updateAgentSpeed(state, newSpeed: number) {
      state.agentSpeed = newSpeed.toString();
      sessionStorage.setItem("agentSpeed", state.agentSpeed);
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
    addWall(state, newWall: position) {
      let foundWall = false;
      state.walls.forEach((wall:position) => {
        if(JSON.stringify(wall)===JSON.stringify(newWall)){
          foundWall=true;
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
    removeSensor(state,sensor:sensor){
      state.sensors = state.sensors.filter((e:sensor)=>!(e.name == sensor.name));
      sessionStorage.setItem("sensors", JSON.stringify(state.sensors));
    },
    removeEntity(state,entity:entity){
      state.entities = state.entities.filter((e:entity)=>!(e.name==entity.name));
      sessionStorage.setItem("entities", JSON.stringify(state.entities));
    },
    updateAgent(state, newAgentPosition: position) {
      state.agent = newAgentPosition;
      sessionStorage.setItem("agent", JSON.stringify(state.agent));
    },
    updateFloorPlanDetails(state, newFloorPlan: floorPlanDetails) {
      state.floorPlanDetails = newFloorPlan;
      sessionStorage.setItem("floorPlanDetails", JSON.stringify(state.floorPlanDetails));
    },
    clearAllInfoOnGrid(state) {
      state.sensors = Array<sensor>();
      state.entities = Array<entity>();
      state.walls = Array<position>();
      state.agent = new position(0, 0);
      state.agentSpeed = "1";
      sessionStorage.setItem("sensors", JSON.stringify(state.sensors));
      sessionStorage.setItem("entities", JSON.stringify(state.entities));
      sessionStorage.setItem("walls", JSON.stringify(state.walls));
      sessionStorage.setItem("agent", JSON.stringify(state.agent));
      sessionStorage.setItem("agentSpeed", state.agentSpeed);
    },
  },
  getters: {
    lastSensorAdded: state => {
      return state.sensors[state.sensors.length - 1];
    },
    lastEntityAdded: state => {
      return state.entities[state.entities.length - 1];
    }
  }
});
