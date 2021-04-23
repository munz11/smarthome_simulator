<template>
  <div>
    <v-textarea
      filled
      name="input-7-4"
      label="Enter Activities"
      :v-model="activities"
      :value="activities"
    ></v-textarea>
    <v-btn outlined rounded text @click="submitActivitiesAndFloorPlan">
      Start Simulation
    </v-btn>
    <br />
    <br />
    <v-snackbar v-model="SnackBar" timeout="-1">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeSnackBar">
          {{ btnText }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddInput",
  data() {
    return {
      activities: "",
      SnackBar:false,
      text:"",
      btnText:"Close"
    };
  },
  methods: {
    closeSnackBar(){
      this.text="";
      this.SnackBar=false;
    },
    fixTileID(selectedNode) {
      let coord = selectedNode.split("-");
      return coord.join(",");
    },
    updateSessionStorage() {
      sessionStorage.setItem("activities", this.activities);
    },
    addGoToActivity(selectedNode) {
      if (this.activities == "") {
        this.activities = "goto(" + this.fixTileID(selectedNode) + ")";
      } else {
        this.activities =
          this.activities + ";goto(" + this.fixTileID(selectedNode) + ")";
      }
      this.updateSessionStorage();
    },
    addWaitActivity(time) {
      if (this.activities == "") {
        this.activities = "wait(" + time + ")";
      } else {
        this.activities = this.activities + ";wait(" + time + ")";
      }
      this.updateSessionStorage();
    },
    convertPositionObjToID(position) {
      return position.x.toString() + "-" + position.y.toString();
    },
    findSensorName(selectedNode) {
      //this can be optimized by better algorithm
      let sensors = this.$store.state.sensors;
      for (let i = 0; i < sensors.length; i++) {
        for (let j = 0; j < sensors[i].positions.length; j++) {
          if (
            this.convertPositionObjToID(sensors[i].positions[j]) ===
            selectedNode
          ) {
            return sensors[i].name;
          }
        }
      }
    },
    addInteractActivity(selectedNode) {
      if (this.activities == "") {
        this.activities = "interact(" + this.findSensorName(selectedNode) + ")";
      } else {
        this.activities =
          this.activities +
          ";interact(" +
          this.findSensorName(selectedNode) +
          ")";
      }
      this.updateSessionStorage();
    },
    submitActivitiesAndFloorPlan() {
      let floorPlan = {
        tileSideLength: this.$store.state.floorPlanDetails.tileSideLenght,
        width: this.$store.state.floorPlanDetails.width,
        height: this.$store.state.floorPlanDetails.height,
        agent: { position: this.$store.state.agent, speed: 1 },
        sensors: this.$store.state.sensors,
        walls: this.$store.state.walls,
      };
      let activities = {
        input: this.activities,
      };
      axios
        .post(this.$smartHomeBackend.getUrlRoomConfig(), floorPlan)
        .then((resFloorPlan) =>{
          axios
            .post(this.$smartHomeBackend.getUrlInput(), activities)
            .then((resInput) => {
              if (resInput.data == "consumed") {
                this.$root.$emit("simulationInfoAdd");
              } else {
                this.text=resInput.data;
                this.SnackBar=true;
              }
            })
            .catch((err) =>{
              this.text=err;
              this.SnackBar=true;
            });}
        )
        .catch((err)=>{
          this.text=err;
          this.SnackBar=true;
        });
    },
  },
  mounted() {
    this.$root.$on("TileGoTo", (selectedNode) => {
      this.addGoToActivity(selectedNode);
    });
    this.$root.$on("TimeWait", (time) => {
      this.addWaitActivity(time);
    });
    this.$root.$on("SensorInteract", (selectedNode) => {
      this.addInteractActivity(selectedNode);
    });
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>
