<template>
  <div class="FloorPlan">
    <v-container fluid fill-height>
      <v-row>
        <FloorPlanMenu @gridZoomIn="zoomIn" @gridZoomOut="zoomOut" />
        <div id="Grid">
          <Grid
            v-bind:widthNodes="widthNodes"
            v-bind:heightNodes="heightNodes"
            :editPlan="true"
          />
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import FloorPlanMenu from "@/components/widgets/floorPlanMenu.vue";
import Grid from "@/components/widgets/grid.vue";
import Panzoom from "@panzoom/panzoom";

export default {
  name: "FloorPlan",
  components: { FloorPlanMenu, Grid },
  data() {
    return {
      widthNodes: [],
      heightNodes: [],
      panzoom: null,
    };
  },
  methods: {
    zoomIn() {
      this.panzoom.zoomIn();
    },
    zoomOut() {
      this.panzoom.zoomOut();
    },
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
  mounted() {
    this.panzoom = Panzoom(document.getElementById("Grid"), {
      maxScale: 5,
    });
  },
};
</script>
