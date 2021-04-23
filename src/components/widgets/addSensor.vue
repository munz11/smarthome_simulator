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
        <label>Type: </label>
        <select v-model="type" class="form-control">
          <option v-for="option in typeOptions" v-bind:key="option.value" :value="option.value">{{ option.text }}</option>
        </select>
      </v-list-item>
      <v-list-item>
        <label>Walkable </label>
        <v-checkbox
        v-model="walkable"
        />
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
import position from "../../models/position";
import sensor from "../../models/sensor";
export default {
  name: "AddSensor",
  props: ["positions", "triggerArea"],
  data() {
    return {
      name: "",
      triggerFrequency: "",
      walkable: "false",
      typeOptions: [
        { value: 1, text: "Passive", send:"entities.SensorPassive" },
        { value: 2, text: "Active", send:"entities.SensorActive" },
      ],
      type: "",
    };
  },
  methods: {
    submit() {
      let sensorObject = new sensor(
        this.name,
        this.getListPositions(this.positions),
        this.getListPositions(this.triggerArea),
        parseInt(this.triggerFrequency),
        this.typeOptions.find(option => option.value==this.type).send,
        this.walkable == "true" ? true : false
      );
      this.$store.commit("addSensor", sensorObject);
      this.$emit("closeSensorForm");
    },
    getListPositions(positions) {
      let positionObjects = [];
      positions.forEach((id) => {
        let coords = id.split("-");
        positionObjects.push(
          new position(parseInt(coords[0]), parseInt(coords[1]))
        );
      });
      return positionObjects;
    },
    getType() {
      var values = this.typeOptions.map(function (o) {
        return o;
      });
      var index = values.indexOf(this.selected);
      this.type = this.typeOptions[index];
    },
  },
};
</script>

