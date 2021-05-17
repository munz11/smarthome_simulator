<template>
  <div class="Simulation">
    <v-container fluid fill-height>
      <v-row>
        <SimulationMenu />
        <Grid :editPlan="false" />
      </v-row>
    </v-container>
    <v-snackbar v-model="snackBar" timeout="-1" bottom>
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeSnackBar">
          {{ btnText }}
        </v-btn>
      </template>
    </v-snackbar>
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
      simulationInfo: false,
      snackBar: false,
      text: "",
      btnText: "",
    };
  },
  methods: {
    closeSnackBar() {
      this.snackBar = false;
      this.text = "";
      this.btnText = "";
      this.$router.push({ name: "Home" });
    },
  },
  beforeMount() {
    if (
      this.$store.state.floorPlanDetails.width == 0 &&
      this.$store.state.floorPlanDetails.height == 0
    ) {
      this.text = "The floor plan details have not been submitted.";
      this.btnText = "Go Back";
      this.snackBar = true;
    }
  },
  mounted() {
    this.$root.$on("simulationInfoAdd", () => {
      this.simulationInfo = true;
    });
  },
};
</script>
