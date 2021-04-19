<template>
  <div class="FloorPlan">
    <b-container fluid>
      <b-row>
      <Menu />
      <Grid v-bind:widthNodes="widthNodes" v-bind:heightNodes="heightNodes" v-bind:objectBeingAdded="objectBeingAdded" />
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Menu from "@/components/widgets/menu.vue";
import Grid from "@/components/widgets/grid.vue";

export default {
  name: "FloorPlan",
  components: { Menu, Grid },
  data() {
    return {
      widthNodes: [],
      heightNodes: [],
      objectBeingAdded: "wall"
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
