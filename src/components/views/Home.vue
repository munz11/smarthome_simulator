<template>
  <div class="home">
    <b-container fluid>
      <br>
      <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
        <v-card-title
          >Please enter the details about the floor plan</v-card-title
        >

        <v-list-item>
          <label>Height: </label>
          <input type="text" class="form-control" v-model="height" />
        </v-list-item>
        <br />
        <v-list-item>
          <label>Width: </label>
          <input type="text" class="form-control" v-model="width" />
        </v-list-item>
        <br />
        <v-list-item>
          <label>Side length:</label>
          <input type="text" class="form-control" v-model="tileSideLength" />
        </v-list-item>

        <v-card-actions>
          <v-btn outlined rounded text @click="submitFloorPlanInfo"> Continue </v-btn>
        </v-card-actions>
      </v-card>
    </b-container>
  </div>
</template>

<script>
import floorPlanDetails from "@/models/floorPlanDetails";
export default {
  name: "Home",
  data() {
    return {
      width: "",
      height: "",
      tileSideLength: "",
    };
  },
  methods: {
    submitFloorPlanInfo(){
      this.$store.commit("updateFloorPlanDetails",new floorPlanDetails(parseInt(this.width),parseInt(this.height),parseInt(this.tileSideLength)));

      this.$router.push({ name: 'FloorPlan' })
    }
  },
};
</script>
