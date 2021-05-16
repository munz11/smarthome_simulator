<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title
        >Upload or Download the FloorPlan
        <br />
        <v-btn text @click="close"> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-btn outlined rounded text @click="upload"> Upload JSON file </v-btn>
        <v-btn outlined rounded text @click="download"> Download</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "UploadDownload",
  data() {
      return{
          passiveSensors:[],
          activeSensors:[],
      }
  },
  methods: {
    close() {
      this.$emit("closeCard");
    },
    upload() {
      console.log("upload a filee");
    },
    download() {
        this.getPassiveActiveSensors();
        let jsonData = {
            tileSideLength:this.$store.state.floorPlanDetails.tileSideLenght,
            width:this.$store.state.floorPlanDetails.width,
            height:this.$store.state.floorPlanDetails.height,
            agent:{position:this.$store.state.agent,speed:1},
            passiveSensors:this.passiveSensors,
            activeSensors:this.activeSensors,
            walls:this.$store.state.walls,
            entities: this.$store.state.entities
        },
        

    },
    getPassiveActiveSensors(){
        let sensors = this.$store.state.sensors;
        for(let i=0;i<sensors.length;i++){
            if(sensors[i].isPassive()){
                this.passiveSensors.push(sensors[i].getPassiveSensor());
            }else{
                this.activeSensors.push(sensors[i].getActiveSensor());
            }
        }
    }
  },
};
</script>
