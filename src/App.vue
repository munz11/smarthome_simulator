<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow">
      <b-navbar-brand href="#">
        <img
          src="@/assets/dtu.png"
          class="d-inline-block align-top"
          alt="DTU"
          height="30"
        />
        Linac - Smart Environment Simulator
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{ name: 'Home' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'FloorPlan' }">Floor Plan</b-nav-item>
          <b-nav-item :to="{ name: 'Sensors' }">Sensors</b-nav-item>
          <b-nav-item :to="{ name: 'Entities' }">Entities</b-nav-item>
          <b-nav-item :to="{ name: 'Agents' }">Agents</b-nav-item>
          <b-nav-item :to="{ name: 'Simulation' }">Simulation</b-nav-item>
          <b-nav-item :to="{ name: 'About' }">About</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container fluid>
        <router-view />
    </b-container>
    <SystemStatus :systemStatus="systemStatus" />
  </div>
</template>

<script>
import SystemStatus from "./components/widgets/SystemStatus.vue";
import axios from "axios";

export default {
  components: {
    SystemStatus,
  },
  data() {
    return {
      systemStatus: "offline",
    };
  },
  methods: {
    checkStatus() {
      axios
        .get(this.$smartHomeBackend.getUrlPing())
        .then(
          (res) =>
            (this.systemStatus = res.data == "pong" ? "online" : "offline")
        )
        .catch((err) => console.error(err));
    },
    getSensorNames() {
      axios
        .get(this.$smartHomeBackend.getUrlActiveSensors())
        .then((res) => this.$store.commit("addActiveSensors", res.data))
        .catch((err) => console.error(err));
      axios
        .get(this.$smartHomeBackend.getUrlPassiveSensors())
        .then((res) => this.$store.commit("addPassiveSensors", res.data))
        .catch((err) => console.error(err));
    },
  },
  mounted() {
    this.checkStatus();
    this.getSensorNames();
    setInterval(() => {
      this.checkStatus();
    }, 1000 * 15);
  },
};
</script>

<style>
.sidebar-sticky {
  height: calc(100vh - 56px);
}
.row {
  margin-top: 0 !important;
}

ul {
  padding-left: 20px !important;
}
</style>
