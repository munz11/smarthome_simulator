<template>
  <div class="home">
    <b-container fluid>
      <v-card class="mx-auto" max-width="550" outlined elevation="2" shaped>
        <v-card-title
          >Please enter the details about the floor plan</v-card-title
        >
        <v-card-text>
          <v-form v-model="isValid">
            <v-text-field
              label="Height"
              v-model="height"
              required
              :rules="numberRules"
            ></v-text-field>
            <v-text-field
              label="Width"
              v-model="width"
              required
              :rules="numberRules"
            ></v-text-field>
            <v-text-field
              label="Side Length"
              v-model="tileSideLength"
              required
              :rules="sideLengthRules"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn
            outlined
            rounded
            text
            @click="submitFloorPlanInfo"
            :disabled="!isValid"
          >
            Continue
          </v-btn>
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
      isValid: true,
      numberRules: [
        (v) => !!v || "Required",
        (v) =>
          /^[1-9]$|^[1-9][0-9]$|^(100)$/.test(v) ||
          "Number should be in the range 1 -100",
      ],
      sideLengthRules:[
        (v) => !!v || "Required",
        (v) =>
          /^\d*$/.test(v) ||
          "Enter a number",
      ],
    };
  },
  methods: {
    submitFloorPlanInfo() {
      this.$store.commit(
        "updateFloorPlanDetails",
        new floorPlanDetails(
          parseInt(this.width),
          parseInt(this.height),
          parseInt(this.tileSideLength)
        )
      );

      this.$router.push({ name: "FloorPlan" });
    },
  },
};
</script>
