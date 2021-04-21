<template>
  <div class="Simulation">
    <b-container fluid>
      <b-row>
           <SimulationMenu />
        <Grid v-bind:widthNodes="widthNodes" v-bind:heightNodes="heightNodes" :editPlan="editPlan" />
      </b-row>
    </b-container>
    <v-overlay :value="waitInfo">
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title>Enter time duration for wait</v-card-title>

      <v-list-item>
        <label>Time: </label>
        <input type="text" class="form-control" v-model="time" />
      </v-list-item>
      <v-card-actions>
        <v-btn outlined rounded text @click="submitWait"> Submit </v-btn>
      </v-card-actions>
    </v-card>
    </v-overlay>
  </div>
  
</template>

<script>
import SimulationMenu from "@/components/widgets/simulationMenu.vue";
import Grid from "@/components/widgets/grid.vue";

export default {
  name: "Simulation",
  components: { SimulationMenu, Grid},
  data() {
    return {
      widthNodes: [],
      heightNodes: [],
      editPlan: false,
      waitInfo:false,
      time: ""
    };
  },
  methods: {
    submitWait(){
      this.$root.$emit("TimeWait",this.time);
      this.waitInfo=false;
    }
  },
  mounted() {
    this.$root.$on("Wait",()=>{
      this.waitInfo=true;
    })
  },
  created() {
    let width = this.$store.state.floorPlanDetails.width;
    let height = this.$store.state.floorPlanDetails.height;
    for (let i = 0; i < width; i++) {
      this.widthNodes.push(i);
    }
    for (let i = 0; i < height; i++) {
      this.heightNodes.push(i);
    }
  },
};
</script>
