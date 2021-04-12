import Vue from 'vue';
import Vuex from 'vuex';
import sensor from '../models/sensor';
import position from '../models/position';
import wall from '../models/wall';
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        agent: new position(0, 0),//default
        sensors: Array<sensor>(),
        walls: Array<wall>()
    },

    mutations: {
        addSensor(state, newSensor: sensor) {
            state.sensors.push(newSensor);

        },
        addWall(state, newWall: wall) {
            state.walls.push(newWall);
        },
        updateAgent(state, newAgentPosition: position) {
            state.agent = newAgentPosition;
        },
        clearAllSensorAndWallInfo(state) {
            state.sensors = Array<sensor>();
            state.walls = Array<wall>();
        }
    }
    /*,
    actions: {
        addSensor(context, newSensor: sensor) {
            context.commit('addSensor', newSensor);
        },
        addWall(context,newWall: position){
            context.commit('addWall',newWall);
        }
    }*/
})

