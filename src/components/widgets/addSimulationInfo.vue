<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title>Please enter details for the simulation</v-card-title>
      <v-card-text>
        <v-form v-model="isValid">
          <v-row>
            <v-col>
              <v-text-field
                label="Date"
                v-model="date"
                required
                :rules="[
                  (v) => !!v || 'Required',
                  (v) =>
                    /^\d{4}-\d{2}-\d{2}$/.test(v) ||
                    'Enter Date in the correct format: yyyy-mm-dd',
                ]"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Time"
                v-model="time"
                required
                hint="HH:mm:ss"
                :rules="[
                  (v) => !!v || 'Required',
                  (v) =>
                    /^\d{2}:\d{2}:\d{2}$/.test(v) ||
                    'Enter time in the correct format: HH:mm:ss',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-checkbox
            v-model="instantSimulation"
            label="Instant Simulation"
          ></v-checkbox>
          <v-text-field
            label="Relative Time"
            v-model="relativeTime"
            required
            :rules="[
              (v) => !!v || 'Required',
              (v) => /^\d*$/.test(v) || 'Enter a number',
            ]"
          ></v-text-field>
          <v-text-field
            label="Seed"
            v-model="seed"
            required
            hint="156241"
            :rules="[
              (v) => !!v || 'Required',
              (v) => /^\d*$/.test(v) || 'Enter a number',
            ]"
          ></v-text-field>
          <v-checkbox v-model="mqttOutput" label="Mqtt Output"></v-checkbox>
          <v-row>
            <v-col>
              <v-text-field
                label="Mqtt Host"
                v-model="mqttHost"
                required
                :rules="[(v) => !!v || 'Required']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Mqtt Port"
                v-model="mqttPort"
                required
                :rules="[(v) => !!v || 'Required']"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="Root Topic"
                v-model="rootTopic"
                required
                :rules="[(v) => !!v || 'Required']"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn outlined rounded text :disabled="!isValid" @click="submit">
          Submit</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-snackbar v-model="SnackBar" timeout="-1">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeSnackBar">
          {{ btnText }}
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AddSimulationInfo",
  data: () => {
    return {
      date:"",
      time:
        new Date().getHours() +
        ":" +
        new Date().getMinutes() +
        ":" +
        new Date().getSeconds(),
      instantSimulation: false,
      relativeTime: 1,
      mqttOutput: false,
      mqttHost: "broker.hivemq.com",
      mqttPort: "1883",
      rootTopic: "smartHome",
      text: "",
      btnText: "",
      SnackBar: false,
      isValid: true,
      seed: null,
    };
  },
  methods: {
    submit() {
      let dateObject = new Date();
      let datearray = this.date.split("-");
      let timeobject = this.time.split(":");
      dateObject.setFullYear(
        parseInt(datearray[0]),
        parseInt(datearray[1]),
        parseInt(datearray[2])
      );
      dateObject.setHours(
        parseInt(timeobject[0]),
        parseInt(timeobject[1]),
        parseInt(timeobject[2])
      );
      let simulationJson = {
        clock: dateObject.toISOString(),
        instantSimulation: this.instantSimulation,
        relativeTime: this.relativeTime,
        mqttOutput: this.mqttOutput,
        mqttHost: this.mqttHost,
        mqttPort: this.mqttPort,
        rootTopic: this.rootTopic,
        seed: this.seed,
      };
      axios
        .post(this.$smartHomeBackend.getUrlSimulation(), simulationJson)
        .then(() => {
          if(this.mqttOutput){
            this.text =
            "The simulation has started, the data can be found at the mqtt host:" +
            this.mqttHost;
          }else{
            this.text =
            "The simulation has ended."
          }
          this.btnText = "Close";
          this.SnackBar = true;
        })
        .catch((err) => {
          this.text = err;
          this.btnText = "Close";
          this.SnackBar = true;
        });
    },
    closeSnackBar() {
      this.text = "";
      this.btnText = "";
      this.SnackBar = false;
      this.$emit("simulationClose");
    },
  },
};
</script>
