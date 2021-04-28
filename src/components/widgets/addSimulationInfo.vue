<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title>Please enter details for the simulation</v-card-title>
      <v-list-item>
        <label>Date:</label>
        <v-text-field
          v-model="date"
          outlined
          hint="Format: yyyy-mm-dd"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <label>Time: </label>
        <v-text-field
          v-model="time"
          outlined
          hint="Format: HH:mm:ss"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-checkbox
          v-model="instantSimulation"
          label="Instant Simulation"
        ></v-checkbox>
      </v-list-item>
      <v-list-item>
        <label>Relative Time: </label>
        <v-text-field v-model="relativeTime" outlined></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-checkbox v-model="mqttOutput" label="Mqtt Output"></v-checkbox>
      </v-list-item>
      <v-list-item>
        <label>Mqtt Host: </label>
        <v-text-field v-model="mqttHost" outlined></v-text-field>
      </v-list-item>
      <v-list-item>
        <label>Mqtt Port: </label>
        <v-text-field v-model="mqttPort" outlined></v-text-field>
      </v-list-item>
      <v-list-item>
        <label>Root Topic: </label>
        <v-text-field v-model="rootTopic" outlined></v-text-field>
      </v-list-item>
      <v-card-actions>
        <v-btn outlined rounded text @click="submit"> Submit</v-btn>
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
      date:
        new Date().getFullYear() +
        "-" +
        new Date().getMonth() +
        "-" +
        new Date().getDate(),
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
      text:"",
      btnText:"",
      SnackBar:false
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
        "clock": dateObject.toISOString(),
        "instantSimulation": this.instantSimulation,
        "relativeTime": this.relativeTime,
        "mqttOutput":this.mqttOutput,
        "mqttHost":this.mqttHost,
        "mqttPort":this.mqttPort,
        "rootTopic":this.rootTopic
      };
      axios.post(this.$smartHomeBackend.getUrlSimulation(), simulationJson)
           .then((res) =>{
             this.text="The simulation has started, the data can be found at the mqtt host:"+this.mqttHost;
             this.btnText="Close";
             this.SnackBar=true;
             this.$emit("simulationClose");
           })
           .catch(err=>{
             this.text=err;
             this.btnText="Close";
             this.SnackBar=true;
           })
    },
    closeSnackBar(){
      this.text="";
      this.btnText="";
      this.SnackBar=false;
    }
  },
};
</script>
