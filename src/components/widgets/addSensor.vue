<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title>Please enter further details about the sensor</v-card-title>

      <v-list-item>
        <label>Name: </label>
        <input type="text" class="form-control" v-model="name" />
      </v-list-item>
      <br />
      <v-list-item>
        <label>Trigger Frequency </label>
        <input type="text" class="form-control" v-model="triggerFrequency" />
      </v-list-item>
      <v-card-actions>
        <v-btn outlined rounded text @click="submit"> Submit </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import position from "../../models/position";
import sensor from "../../models/sensor";
export default {
  name: "AddSensor",
  props: ["positions", "triggerArea"],
  data() {
    return {
      name: "",
      triggerFrequency: "",
    };
  },
  methods: {
    submit() {
      let sensorObject = new sensor(uuidv4(),this.name,this.getListPositions(this.positions),this.getListPositions(this.triggerArea),parseInt(this.triggerFrequency));
      this.$store.commit(
        "addSensor",
        sensorObject
      );
      this.$emit("closeSensorForm");
    },
    getListPositions(positions) {
      let positionObjects = [];
      positions.forEach(id=>{
        let coords = id.split("-");
        positionObjects.push(
          new position(parseInt(coords[0]), parseInt(coords[1]))
        );
      });
      return positionObjects;
    }
  },
};
</script>

