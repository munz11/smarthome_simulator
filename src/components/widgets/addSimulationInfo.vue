<template>
  <div>
    <v-card
      class="mx-auto"
      width="500"
      height="550"
      outlined
      elevation="2"
      shaped
    >
      <div v-if="infoCard">
        <v-card-title
          >Please enter details for the simulation
          <v-btn text @click="close"> &times; </v-btn></v-card-title
        >
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
              hint="3"
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
      </div>
      <div v-if="!infoCard">
        <v-card-title
          >Server output
          <v-btn text @click="close"> &times; </v-btn>
        </v-card-title>
        <v-card-text>
          <b-form-textarea
            :value="simulationInfo"
            plaintext
            rows="18"
            max-rows="18"
          ></b-form-textarea>
        </v-card-text>
      </div>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
export default {
  name: "AddSimulationInfo",
  data: () => {
    return {
      date: "",
      time: "",
      instantSimulation: false,
      relativeTime: 1,
      mqttOutput: false,
      mqttHost: "broker.hivemq.com",
      mqttPort: "1883",
      rootTopic: "smartHome",
      isValid: true,
      seed: "",
      simulationInfo: "",
      infoCard: true,
    };
  },
  methods: {
    submit() {
      this.infoCard = false;
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
      this.socket = new SockJS("https://smart-home-simulator-backend.herokuapp.com/websockets");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        () => {
          axios
            .post(this.$smartHomeBackend.getUrlSimulation(), simulationJson)
            .then(() => {
              setTimeout(() => this.stompClient.disconnect(), 2000);
            })
            .catch((err) => {
              this.simulationInfo = err;
            });
          this.stompClient.subscribe("/SimulationStatus", (message) => {
            this.simulationInfo = this.simulationInfo + "\n" + message.body;
          });
        },
        (error) => {
          this.simulationInfo = error;
        }
      );
    },
    close() {
      this.$emit("simulationClose");
    },
  },
};
</script>
