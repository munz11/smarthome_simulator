<template>
  <div class="FloorPlan">
    <v-container fluid fill-height>
      <v-row>
        <FloorPlanMenu />
        <Grid :editGrid="true" />
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
  </div>
</template>

<script>
import FloorPlanMenu from "@/components/widgets/floorPlanMenu.vue";
import Grid from "@/components/widgets/grid.vue";

export default {
  name: "FloorPlan",
  components: { FloorPlanMenu, Grid },
  data() {
    return {
      snackBar:false,
      text:"",
      btnText:"",
    }
  },
  methods: {
    closeSnackBar(){
      this.snackBar=false;
      this.text="";
      this.btnText="";
      this.$router.push({ name: 'Home'});
    }
  },
  beforeMount(){
    if(this.$store.state.floorPlanDetails.width==0 && this.$store.state.floorPlanDetails.height==0){
      this.text="The floor plan details have not been submitted.";
      this.btnText="Go Back";
      this.snackBar=true;
    }

  }
};
</script>
