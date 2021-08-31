<template>
  <b-modal id="modal-simulation" title="Simulation configuration" @ok="alert(1)">
    <div v-if="infoCard">
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
            <b-form-checkbox
              v-model="instantSimulation"
            >Instant Simulation</b-form-checkbox>
            <v-text-field
              label="Relative Time"
              v-model="relativeTime"
              hint="1.0"
              :rules="[
                (v) => !!v || 'Required',
                (v) => /^\d*\.\d{0,2}$/.test(v) || 'Enter a number with max 2 decimal places',
              ]"
              required
            ></v-text-field>
            <v-text-field
              label="Seed"
              v-model="seed"
              hint="3"
              :rules="[
                (v) => !!v || 'Required',
                (v) => /[123]/.test(v) || 'Enter either 0, 1 or 2',
              ]"
            ></v-text-field>
            <b-form-checkbox v-model="mqttOutput">Mqtt Output</b-form-checkbox>
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
    </div>
    <div v-if="!infoCard">
        <b-form-textarea
          :value="simulationInfo"
          plaintext
          class="editor"
        ></b-form-textarea>
    </div>
        <template #modal-footer>
          <b-button
            variant="secondary"
            class="float-right"
            @click="$bvModal.hide('modal-simulation')"
            v-if="infoCard"
          >Cancel</b-button>
          <b-button
            variant="primary"
            class="float-right"
            @click="submit"
            v-if="infoCard"
          >Start simulation</b-button>
          <b-button
            variant="secondary"
            class="float-right"
            @click="reset()"
            v-if="!infoCard"
          >Reset simulation</b-button>
          <b-button
            variant="primary"
            class="float-right"
            @click="$bvModal.hide('modal-simulation')"
            v-if="!infoCard"
          >Close</b-button>
        </template>
  </b-modal>
</template>

<script>
import axios from "axios";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
export default {
  name: "AddSimulationInfo",
  data: () => {
    return {
      date: "2021-01-01",
      time: "08:00:00",
      instantSimulation: false,
      relativeTime: 0.1,
      mqttOutput: false,
      mqttHost: "broker.hivemq.com",
      mqttPort: "1883",
      rootTopic: "smartHome",
      isValid: true,
      seed: 0,
      simulationInfo: "***  Close this card to see the visual simulation ***",
      infoCard: true,
    };
  },
  methods: {
    reset() {
      this.infoCard = true;
    },
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
        csvOutput: false,
        csvFileName: "test",
      };
      // this.$bvModal.hide('modal-simulation');
      this.socket = new SockJS("http://linac.compute.dtu.dk/websockets");
      this.stompClient = Stomp.over(this.socket);
      this.$store.commit("setVisualSimulation","true");
      this.$root.$emit("visualSimulationUpdated");
      this.stompClient.connect(
        {},
        () => {
          axios
            .post(this.$smartHomeBackend.getUrlSimulation(), simulationJson)
            .then(() => {
              setTimeout(() => {
                this.stompClient.disconnect();
                alert("Simulation has ended.");
                this.$store.commit("setVisualSimulation","false");
                this.$root.$emit("visualSimulationUpdated");
              },
              2000);
            })
            .catch((err) => {
              this.simulationInfo = err;
            });
          this.stompClient.subscribe("/SimulationStatus", (message) => {
            this.simulationInfo = this.simulationInfo +"\n" + message.body;
            this.visual(message.body);
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
    visual(messageBody) {
      this.$store.getters.agentNames.forEach((name) => {
        if (messageBody.includes(name) && messageBody.includes("Position")) {
          let positionStr = messageBody.substring(
            messageBody.lastIndexOf("Position") + 8
          );
          let positionSplit = positionStr.split(",");
          let xVal = parseInt(positionSplit[0].substring(4), 10);
          let yVal = parseInt(
            positionSplit[1].substring(3, positionSplit[1].length - 1),
            10
          );
          this.$root.$emit("visualMoveAgent",name,xVal,yVal);//agentID,x,y
        }
      });
    },
  },
};
</script>

<style scoped>
.editor {
  background: #333;
  color: #ccc;
  /* border: 1px solid rgb(224, 224, 224); */
  width: 100%;
  height: 300px;
  padding: 10px;
  font-size: 10pt;
  font-family: monospace;
  white-space: pre;
  /* white-space: nowrap; will prevent the default wrapping of text to next line */
  overflow-x: auto; /* will make horizontal scroll-bar appear only when needed */
}
.editor:focus {
    outline: none !important;
}
</style>