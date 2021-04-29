<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title>Please enter further details about the sensor</v-card-title>
      <v-card-text>
        <v-form v-model="isValid">
          <v-text-field
            label="Name"
            v-model="name"
            required
            :rules="[(v) => !!v || 'Required']"
          ></v-text-field>
          <label>Type: </label>
          <select v-model="type" class="form-control" required :rules="[(v) => !!v || 'Required']">
            <option
              v-for="option in typeOptions"
              v-bind:key="option.value"
              :value="option.value"
            >
              {{ option.text }}
            </option>
          </select>
          <v-checkbox v-model="walkable" label="walkable"></v-checkbox>
          <v-text-field
            label="Trigger Frequency (s)"
            v-model="triggerFrequency"
            required
            hint="e.g: 5"
            :rules="[(v) => !!v || 'Required']"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn outlined rounded text :disabled="!isValid" @click="submit">
          Submit
        </v-btn>
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
      walkable: "true",
      typeOptions: [
        { value: 1, text: "Passive", send: "entities.SensorPassive" },
        { value: 2, text: "Active", send: "entities.SensorActive" },
      ],
      type: "",
      isValid: true,
    };
  },
  methods: {
    submit() {
      let sensorObject = new sensor(
        this.name,
        this.getListPositions(this.positions),
        this.getListPositions(this.triggerArea),
        parseInt(this.triggerFrequency) * 1000000000,
        this.typeOptions.find((option) => option.value == this.type).send,
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

