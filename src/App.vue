<template>
  <div id="app">
    <head>
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css"
        rel="stylesheet"
      />
      <link
        href="https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css"
        rel="stylesheet"
      />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui"
      />
    </head>
    <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow">
      <b-navbar-brand href="#">
        <img
          src="@/assets/dtu.png"
          class="d-inline-block align-top"
          alt="DTU"
          height="30"
        />
        Smart Home Simulator
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{ name: 'Home' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'FloorPlan' }">FloorPlan</b-nav-item>
          <b-nav-item :to="{ name: 'Sensors' }">Sensors</b-nav-item>
          <b-nav-item :to="{ name: 'Entities' }">Entities</b-nav-item>
          <b-nav-item :to="{ name: 'Simulation' }">Simulation</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <main role="main">
      <router-view Home />
    </main>
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
    getSensorNames(){
      axios.get(this.$smartHomeBackend.getUrlActiveSensors())
           .then((res) => (this.$store.commit("addActiveSensors", res.data)))
           .catch((err) => console.error(err));
      axios.get(this.$smartHomeBackend.getUrlPassiveSensors())
           .then((res) => (this.$store.commit("addPassiveSensors", res.data)))
           .catch((err) => console.error(err));
    }
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

