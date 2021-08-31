import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../components/views/Home.vue";
import FloorPlan from "../components/views/FloorPlan.vue";
import Simulation from "../components/views/Simulation.vue";
import Sensors from "../components/views/Sensors.vue";
import Entities from "../components/views/Entities.vue";
import Agents from "../components/views/Agents.vue";
import About from "../components/views/About.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/floorplan",
    name: "FloorPlan",
    component: FloorPlan,
  },
  {
    path: "/sensors",
    name: "Sensors",
    component: Sensors,
  },
  {
    path: "/entities",
    name: "Entities",
    component: Entities,
  },
  {
    path: "/agents",
    name: "Agents",
    component: Agents,
  }, 
  {
    path: "/simulation",
    name: "Simulation",
    component: Simulation,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
