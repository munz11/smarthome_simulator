<template>
  <div>
    <v-textarea
      filled
      name="input-7-4"
      label="Enter Activities"
      v-model="activities"
    ></v-textarea>
    <v-btn outlined rounded text @click="submitActivitiesAndFloorPlan">
      Start Simulation
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "AddInput",
  data() {
    return {
      activities: this.$store.state.activities,
    };
  },
  methods: {
    submitActivitiesAndFloorPlan(){
      console.log("heree");
    }
  },
  watch: {
    activities: function(newActivity){
      this.$store.commit("updateActivities",newActivity);
    }
  }
};
</script>

