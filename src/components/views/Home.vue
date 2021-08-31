<template>
    <b-row>
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse border-right p-0">
            <div class="sidebar-sticky pt-3">
                &nbsp;
            </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4 pt-3">

          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Confiuration parameters of the floor plan</h1>
            </div>


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
          
          <v-btn
            outlined
            text
            @click="submitFloorPlanInfo"
            :disabled="!isValid"
          >
            Continue
          </v-btn>
        </main>
    </b-row>
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
          /^\d*\.?\d+$/.test(v) ||
          "Enter a number or a decimal followed by a number",
        (v) => v != 0 || "Enter a positive number"
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
          Number(this.tileSideLength)
        )
      );
      this.$store.commit( "clearAllInfoOnGrid");

      this.$router.push({ name: "FloorPlan" });
    },
  },
};
</script>
