<template>
  <div>
    
    <b-card class="m-3 mt-0 p-0">
      <template #header>
        <strong class="align-bottom">Code</strong>
        <b-button variant="outline-secondary" class="float-right" size="sm" v-b-modal.modal-simulation-code>Edit</b-button>
      </template>
      <b-card-text style="height: 5em; overflow: hidden;" v-b-modal.modal-simulation-code>
        <pre v-if="activities.length > 0" style="color: #bbb !important;">{{ activities }}</pre>
        <p v-else class="mt-3 text-center">Click here to insert the simulation code</p>
      </b-card-text>
    </b-card>
    <b-modal id="modal-simulation-code" title="Simulation code">
      <b-form-textarea class="editor" v-model="activities" placeholder="Enter here your code..." />
    </b-modal>

  <v-list-item>
    <b-button @click="submitActivitiesAndFloorPlan">
      <font-awesome-icon icon="play-circle" />
      Start Simulation
    </b-button>
    <v-snackbar v-model="SnackBar" timeout="-1">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeSnackBar">
          {{ btnText }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-list-item>
  </div>
</template>

<script>

import axios from "axios";
export default {
  name: "AddInput",
  data() {
    return {
      activities: this.$store.state.activities,
      passiveSensors: [],
      activeSensors: [],
      SnackBar: false,
      text: "",
      btnText: "Close",
    };
  },
  methods: {
    closeSnackBar() {
      this.text = "";
      this.SnackBar = false;
    },
    submitActivitiesAndFloorPlan() {
      this.getPassiveActiveSensors();
      let floorPlan = {
        tileSideLength: this.$store.state.floorPlanDetails.tileSideLenght,
        width: this.$store.state.floorPlanDetails.width,
        height: this.$store.state.floorPlanDetails.height,
        agents: this.$store.state.agents,
        passiveSensors: this.passiveSensors,
        activeSensors: this.activeSensors,
        walls: this.$store.state.walls,
        entities: this.$store.state.entities,
      };
      axios
        .post(this.$smartHomeBackend.getUrlRoomConfig(), floorPlan)
        .then(() => {
          axios
            .post(this.$smartHomeBackend.getUrlInput(), {input: this.$store.state.activities.replace(/\n/g, " ")}, {
              headers: { "content-type": "application/json" },
            })
            .then((resInput) => {
              if (resInput.data == "consumed") {
                this.$root.$emit("simulationInfoAdd");
                this.$root.$emit('bv::show::modal', 'modal-simulation', '#btnShow')
              } else {
                this.text = resInput.data;
                this.SnackBar = true;
              }
            })
            .catch((err) => {
              this.text = err;
              this.SnackBar = true;
            });
        })
        .catch((err) => {
          this.text = err;
          this.SnackBar = true;
        });
    },
    getPassiveActiveSensors() {
      let sensors = this.$store.getters.listSensors;
      for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].isPassive()) {
          this.passiveSensors.push(sensors[i].getPassiveSensor());
        } else {
          this.activeSensors.push(sensors[i].getActiveSensor());
        }
      }
    }
  },
  watch: {
    activities: function (newActivity) {
      this.$store.commit("updateActivities", newActivity);
    },
  },
};
</script>
<style scoped>
.editor {
  /* background: #ccc; */
  /* border: 1px solid rgb(224, 224, 224); */
  width: 100%;
  height: 300px;
  padding: 10px;
  font-size: 10pt;
  font-family: monospace;
  line-height: 18pt;
}
</style>