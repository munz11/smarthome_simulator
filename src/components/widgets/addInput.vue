<template>
  <div>
    <v-textarea
      filled
      name="input-7-4"
      label="Enter Activities"
      :value="activities"
    ></v-textarea>
    <v-btn outlined rounded text @click="submitActivities"> Start Simulation </v-btn>
    <br>
    <br>
  </div>
</template>

<script>
export default {
  name: "AddInput",
  data() {
    return {
      activities: sessionStorage.getItem("activities")||"",
    };
  },
  methods: {
    fixTileID(selectedNode) {
      let coord = selectedNode.split("-");
      return coord.join(",");
    },
    updateSessionStorage(){
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
    convertPositionObjToID(position){
      return position.x.toString()+"-"+position.y.toString();
    },
    findSensorName(selectedNode) {
      //this can be optimized by better algorithm
      let sensors = this.$store.state.sensors;
      for(let i=0;i<sensors.length;i++){
        for(let j=0;j<sensors[i].positions.length;j++){

          if(this.convertPositionObjToID(sensors[i].positions[j])===selectedNode){
            return sensors[i].name;
          }
        }
      }
    },
    addInteractActivity(selectedNode) {
      if (this.activities == "") {
        this.activities = "interact(" + this.findSensorName(selectedNode) + ")";
      } else {
        this.activities = this.activities + ";interact(" + this.findSensorName(selectedNode) + ")";
      }
      this.updateSessionStorage();
    },
    submitActivities(){
      console.log("Submit ACtivities")
    }
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
