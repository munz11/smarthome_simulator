<template>
  <b-row>
    <nav
      class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse border-right p-0">
      <div class="sidebar-sticky pt-0">
        <FloorPlanMenu />
      </div>
    </nav>

    <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4 pt-3">
      <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2">Floor plan configuration</h1>
      </div>
      <Grid :editGrid="true" />
    </main>
    <v-snackbar v-model="snackBar" timeout="-1" bottom>
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeSnackBar">
          {{ btnText }}
        </v-btn>
      </template>
    </v-snackbar>
  </b-row>
</template>

<script>
import FloorPlanMenu from "@/components/widgets/floorPlanMenu.vue";
import Grid from "@/components/widgets/grid.vue";

export default {
  name: "FloorPlan",
  components: { FloorPlanMenu, Grid },
  data() {
    return {
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
};
</script>
