<template>
  <div>
    <v-card class="mx-auto" width="600" outlined elevation="2" shaped>
      <v-card-title
        >Edit Sensor
        <v-btn text @click="close" right> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid">
          <v-text-field
            label="Name"
            v-model="name"
            required
            disabled
          ></v-text-field>
          <label>Type: </label>
          <select
            v-model="type"
            class="form-control"
            required
            :rules="typeRules"
          >
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
            :rules="triggerFrequencyRules"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn outlined rounded text :disabled="!isValid" @click="submit">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "EditSensor",
  props: ["sensor"],
  data() {
    return {
      name: "",
      triggerFrequency: "",
      walkable: false,
      typeOptions: [],
      type: "",
      isValid: true,
      typeRules: [(v) => !!v || "Required"],
      triggerFrequencyRules: [
        (v) =>
          /^\d*\.?\d+$/.test(v) ||
          "Enter a number or a decimal followed by a number. You need to add a 0 for active sensors.",
      ],
    };
  },
  methods: {
    submit() {
      this.sensor.name = this.name;
      this.sensor.triggerFrequency = this.triggerFrequency == "" ? 0 : Number(this.triggerFrequency) * 1000000000;
      this.sensor.type=this.typeOptions.find((option) => option.value == this.type).send;
      this.sensor.walkable=this.walkable;
      this.sensor.sensorType=this.isPassiveType() ? "passive" : "active";
      this.$store.commit("editSensor", this.sensor);
      this.$emit("closeForm");
    },
    close() {
      this.$emit("closeForm");
    },
    isPassiveType() {
      if (
        this.$store.state.passiveSensors.includes(
          this.typeOptions.find((option) => option.value == this.type).send
        )
      ) {
        return true;
      }
      return false;
    },
    getTypeOptions() {
      let passiveSensors = this.$store.state.passiveSensors;
      let j = passiveSensors.length;
      for (let i = 0; i < passiveSensors.length; i++) {
        let el = passiveSensors[i].split(".");
        this.typeOptions.push({
          value: i,
          text: el[2],
          send: passiveSensors[i],
        });
      }

      if (this.sensor.interactArea.length > 0) {
        let activeSensors = this.$store.state.activeSensors;
        for (let i = 0; i < activeSensors.length; i++) {
          let el = activeSensors[i].split(".");
          this.typeOptions.push({
            value: i + j,
            text: el[2],
            send: activeSensors[i],
          });
        }
      }
    },
  },
  beforeMount() {
    this.getTypeOptions();
    this.typeOptions.forEach((e) => {
      if (e.send.localeCompare(this.sensor.type) == 0) {
        this.type = e.value;
      }
    });
    this.name = this.sensor.name;
    this.walkable = this.sensor.walkable;
    this.triggerFrequency = this.sensor.triggerFrequency / 1000000000;
  },
};
</script>

