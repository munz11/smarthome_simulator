import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../components/views/Home.vue";
import FloorPlan from "../components/views/FloorPlan.vue";
import Simulation from "../components/views/Simulation.vue";
import SensorAdd from "../components/views/SensorAdd.vue";
import Sensors from "../components/views/Sensors.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/FloorPlan",
    name: "FloorPlan",
    component: FloorPlan,
  },
  {
    path: "/Sensors",
    name: "Sensors",
    component: Sensors,
  },
  {
    path: "/Sensors/Add",
    name: "AddSensor",
    component: SensorAdd,
  },
  {
    path: "/Simulation",
    name: "Simulation",
    component: Simulation,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
