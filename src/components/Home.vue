<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <Menu
          @showAddSensorForm="showSensorForm = true"
          @showInputForm="showInputForm = true"
          @showSensorList="showSensorList = true"
        />
        <Grid />
      </b-row>
    </b-container>
    <div v-if="showSensorForm">
      <AddSensor @closeAddSensorForm="showSensorForm = false" />
    </div>
    <div v-if="showInputForm">
      <AddInput @closeAddInput="showInputForm = false" />
    </div>
    <div v-if="showSensorList">
      <SensorList @closeSensorList="showSensorList = false" />
    </div>
  </div>
</template>

<script>
import Grid from "./widgets/grid.vue";
import Menu from "./widgets/menu.vue";
import AddSensor from "./widgets/addSensor.vue";
import AddInput from "./widgets/addInput.vue";
import SensorList from "./widgets/currentSensorsList.vue";

export default {
  name: "Home",
  components: {
    Grid,
    Menu,
    AddSensor,
    AddInput,
    SensorList,
  },
  data() {
    return {
      showSensorForm: false,
      showInputForm: false,
      showSensorList: false,
    };
  },
};
</script>
