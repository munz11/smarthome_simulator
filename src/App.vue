<template>
  <div id="app">

    <b-navbar toggleable="lg" type="dark" variant="dark" class="shadow">
      <b-navbar-brand href="#">
         <img src="@/assets/dtu.png" class="d-inline-block align-top" alt="DTU" height="30" />
        Smart Home Simulator
      </b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item :to="{ name: 'FloorPlan' }">FloorPlan</b-nav-item>
          <b-nav-item :to="{ name: 'Sensors' }">Sensors</b-nav-item>
          <b-nav-item :to="{ name: 'Simulation' }">Simulation</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <main role="main">
          <router-view Home />
    </main>
    <SystemStatus v-bind:systemStatus="systemStatus"/>

  </div>
</template>

<script>

import SystemStatus from './components/widgets/SystemStatus.vue';
import axios from 'axios';

export default {
  components: {
    SystemStatus
    },
    data(){
      return {
        systemStatus: "offline"
      }
    },
    methods: {
      checkStatus(){
        axios.get(this.$smartHomeBackend.getUrlPing())
             .then(res => this.systemStatus = (res.data == 'pong' ? "online" : "offline"))
             .catch(err => console.error(err));
      }
    },
    mounted(){
      this.checkStatus();
      setInterval(() => {
          this.checkStatus();
      }, 1000*15);
    },
}

</script>

