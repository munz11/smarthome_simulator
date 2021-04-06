<template>
  <div class="home">
    <b-container fluid>
      <b-row>
          <Menu @showAddSensorForm="showSensorForm=true"/>
          <Grid />
      </b-row>
    </b-container>
    <div v-if="showSensorForm">
      <AddSensor @closeAddSensorForm="showSensorForm=false" />
    </div>
  </div>
</template>

<script>
import Grid from "./widgets/grid.vue";
import Menu from "./widgets/menu.vue";
import AddSensor from "./widgets/addSensor.vue";

export default {
  name: "Home",
  components: {
    Grid,
    Menu,
    AddSensor
  },
  data() {
    return{
      showSensorForm:false
    }
  }


};
</script>
