<template>
  <div>
  <v-list-item>
    <v-textarea
      filled
      name="input-7-4"
      label="Enter simulation code"
      v-model="activities"
    ></v-textarea>
  </v-list-item>
  <v-list-item>
    <v-btn outlined text @click="submitActivitiesAndFloorPlan">
      Start Simulation
    </v-btn>
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
    },
  },
  watch: {
    activities: function (newActivity) {
      this.$store.commit("updateActivities", newActivity);
    },
  },
};
</script>

