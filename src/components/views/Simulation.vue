<template>
  <div class="Simulation">
    <v-container fluid fill-height>
      <v-row>
        <SimulationMenu />
          <Grid
            v-bind:widthNodes="widthNodes"
            v-bind:heightNodes="heightNodes"
            :editPlan="editPlan"
          />
      </v-row>
    </v-container>
    <v-overlay :value="waitInfo" :light="true" :dark="false">
      <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
        <v-card-title>Enter time duration for wait</v-card-title>
        <v-card-text>
          <v-form v-model="timeValid">
            <v-text-field
              label="Time"
              v-model="time"
              required
              :rules="[(v) => !!v || 'Required']"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn outlined rounded text :disabled="!timeValid" @click="submitWait"> Submit </v-btn>
        </v-card-actions>
      </v-card>
    </v-overlay>
    <v-overlay :value="simulationInfo" :light="true" :dark="false">
      <AddSimulationInfo @simulationClose="simulationInfo = false" />
    </v-overlay>
  </div>
</template>

<script>
import SimulationMenu from "@/components/widgets/simulationMenu.vue";
import Grid from "@/components/widgets/grid.vue";
import AddSimulationInfo from "@/components/widgets/addSimulationInfo.vue";

export default {
  name: "Simulation",
  components: { AddSimulationInfo, SimulationMenu, Grid },
  data() {
    return {
      widthNodes: [],
      heightNodes: [],
      editPlan: false,
      waitInfo: false,
      time: "",
      simulationInfo: false,
      timeValid: true
    };
  },
  methods: {
    submitWait() {
      this.$root.$emit("TimeWait", this.time);
      this.waitInfo = false;
    }
  },
  mounted() {
    console.log(this.simulationInfo);
    this.$root.$on("Wait", () => {
      this.waitInfo = true;
    });
    this.$root.$on("simulationInfoAdd", () => {
      this.simulationInfo = true;
    });
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
