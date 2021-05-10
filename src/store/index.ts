import Vue from "vue";
import Vuex from "vuex";
import sensor from "../models/sensor";
import position from "../models/position";
import floorPlanDetails from "../models/floorPlanDetails";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    agent: JSON.parse(sessionStorage.getItem("agent")) || new position(0, 0),
    sensors: JSON.parse(sessionStorage.getItem("sensors")) || Array<sensor>(), 
    walls: JSON.parse(sessionStorage.getItem("walls")) || Array<position>(),
    floorPlanDetails: JSON.parse(sessionStorage.getItem("floorPlanDetails")) || new floorPlanDetails(0, 0, 0),
    passiveSensors: JSON.parse(sessionStorage.getItem("passiveSensors")) || Array<string>(),
    activeSensors: JSON.parse(sessionStorage.getItem("activeSensors")) || Array<string>()
  },

  mutations: {
    addActiveSensors(state, newActive: string[]){
      state.activeSensors = newActive;
      sessionStorage.setItem("activeSensors", JSON.stringify(state.activeSensors));
    },
    addPassiveSensors(state, newPassive: string[]){
      state.passiveSensors = newPassive;
      sessionStorage.setItem("passiveSensors", JSON.stringify(state.passiveSensors));
    },
    addSensor(state, newSensor: sensor) {
      state.sensors.push(newSensor);
      sessionStorage.setItem("sensors", JSON.stringify(state.sensors));
    },
    addWall(state, newWall: position) {
      state.walls.push(newWall);
      sessionStorage.setItem("walls", JSON.stringify(state.walls));
    },
    removeWall(state, wall: position) {
      state.walls = state.walls.filter((e: position) => !(e.x == wall.x && e.y == wall.y));
      sessionStorage.setItem("walls", JSON.stringify(state.walls));
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
      state.walls = Array<position>();
      state.agent = new position(0, 0);
      sessionStorage.setItem("sensors", JSON.stringify(state.sensors));
      sessionStorage.setItem("walls", JSON.stringify(state.walls));
      sessionStorage.setItem("agent", JSON.stringify(state.agent));
    },
  },
});
