<template>
  <div class="FloorPlan">
    <b-container fluid>
      <b-row>
      <FloorPlanMenu />
      <Grid v-bind:widthNodes="widthNodes" v-bind:heightNodes="heightNodes" :editPlan="true" />
      </b-row>
    </b-container>
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
      widthNodes: [],
      heightNodes: []
    };
  },
  created() {
    let width = this.$store.state.floorPlanDetails.width;
    let height = this.$store.state.floorPlanDetails.height;
    for(let i=0; i<width; i++){
      this.widthNodes.push(i)
    }
    for(let i=0; i<height; i++){
      this.heightNodes.push(i)
    }

  }
};
</script>
