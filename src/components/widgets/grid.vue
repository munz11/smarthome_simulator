<template>
  <div v-resize="onResize" :height="y">
    <div id="Grid">
      <tbody>
        <tr v-for="i in row" :id="'row' + '-' + i" v-bind:key="i">
          <td
            class="unvisited"
            v-for="j in col"
            :id="j + '-' + i"
            v-bind:key="j"
            @mouseover="addWall(j + '-' + i)"
            v-on:click.exact="addObject(j + '-' + i)"
            v-on:dblclick.exact="addSensorTrigger(j + '-' + i)"
            v-tooltip.hover.focus="j + '-' + i"
          ></td>
        </tr>
      </tbody>
    </div>
    <v-snackbar v-model="SnackBar" timeout="-1">
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeSnackBar">
          {{ btnText }}
        </v-btn>
      </template>
    </v-snackbar>
    <v-overlay :value="sensorForm" :light="true" :dark="false">
      <AddSensor
        :positions="sensorPositionNodes"
        :triggerArea="sensorTriggerNodes"
        @closeSensorForm="closeSensorForm"
      />
    </v-overlay>
  </div>
</template>

<script>
import wall from "@/models/wall";
import position from "@/models/position";
import AddSensor from "@/components/widgets/addSensor.vue";
import Panzoom from "@panzoom/panzoom";

export default {
  name: "Grid",
  props: ["widthNodes", "heightNodes", "editPlan"],
  components: {
    AddSensor,
  },
  data() {
    return {
      x: window.innerWidth,
      y: window.innerHeight - 57,
      row: this.heightNodes,
      col: this.widthNodes,
      occupiedNodes: [],
      SnackBar: false,
      sensorTriggerNodes: new Set(),
      sensorPositionNodes: new Set(),
      text: "",
      btnText: "",
      lastAddedAgentID: "",
      objectBeingAdded: "wall",
      sensorForm: false,
      multiwall: false,
      selectedNode: "",
      panzoom: null,
    };
  },
  methods: {
    onResize() {
      this.y = window.innerHeight - 57;
    },
    addObject(id) {
      if (this.editPlan) {
        let l = document.getElementById(id);
        l.setAttribute("class", this.objectBeingAdded);

        if (this.objectBeingAdded === "sensorPosition") {
          this.sensorPositionNodes.add(id);
        }
        this.occupiedNodes.push(id);
        this.updateStore(id);

        if (this.objectBeingAdded == "wall") {
          this.multiwall = !this.multiwall;
        }
      } else if (
        this.objectBeingAdded === "GoTo" ||
        this.objectBeingAdded === "Interact"
      ) {
        if(!this.selectedNode=="" && this.objectBeingAdded === "GoTo" ){
          let l=document.getElementById(this.selectedNode);
          l.setAttribute("class", "unvisited");
        }
        this.selectedNode = id;
        let l = document.getElementById(id);
        l.setAttribute("class", "Selected");
      }
    },
    addWall(id) {
      if (this.multiwall && this.objectBeingAdded == "wall") {
        let l = document.getElementById(id);
        l.setAttribute("class", this.objectBeingAdded);
        this.occupiedNodes.push(id);
        this.updateStore(id);
      }
    },
    updateStore(id) {
      let coords = id.split("-");
      if (this.objectBeingAdded === "wall") {
        this.$store.commit(
          "addWall",
          new wall(new position(parseInt(coords[0]), parseInt(coords[1])))
        );
      } else if (this.objectBeingAdded === "agent") {
        this.updateAgentNodes(id);
        this.$store.commit(
          "updateAgent",
          new position(parseInt(coords[0]), parseInt(coords[1]))
        );
      }
    },
    updateAgentNodes(id) {
      if (this.lastAddedAgentID != "") {
        let l2 = document.getElementById(this.lastAddedAgentID);
        l2.setAttribute("class", "unvisited");
      }
      this.lastAddedAgentID = id;
    },
    addSensorTrigger(id) {
      if (this.objectBeingAdded === "sensorPosition") {
        let l = document.getElementById(id);
        l.setAttribute("class", "sensorTrigger");
        this.sensorTriggerNodes.add(id);
        if (this.sensorPositionNodes.has(id)) {
          this.sensorPositionNodes.delete(id);
        }
      }
    },
    clear() {
      for (let i = 0; i < this.occupiedNodes.length; i++) {
        let l = document.getElementById(this.occupiedNodes[i]);
        l.setAttribute("class", "unvisited");
        //need to save in store
      }
      this.occupiedNodes = [];
      this.$store.commit("clearAllInfoOnGrid");
      this.updateGridToStore(); 
    },
    alertSensorForm() {
      this.sensorForm = true;
    },
    closeSensorForm() {
      this.sensorForm = false;
      this.sensorTriggerNodes.forEach((id) => {
        let l = document.getElementById(id);
        l.setAttribute("class", "unvisited");
      });
      this.sensorTriggerNodes.clear();
      this.sensorPositionNodes.clear();
    },
    updateAgentTileForSimulation(newTile) {
      let l = document.getElementById(this.lastAddedAgentID);
      l.setAttribute("class", "unvisited");
      l = document.getElementById(newTile);
      l.setAttribute("class", "agent");
      this.lastAddedAgentID = newTile;
    },
    closeSnackBar() {
      if (this.objectBeingAdded === "sensorPosition") {
        this.alertSensorForm();
      } else if (this.objectBeingAdded === "GoTo") {
        this.$root.$emit("TileGoTo", this.selectedNode);
        this.updateAgentTileForSimulation(this.selectedNode);
        this.selectedNode = "";
      } else if (this.objectBeingAdded === "Interact") {
        this.$root.$emit("SensorInteract", this.selectedNode);
        let l = document.getElementById(this.selectedNode);
        l.setAttribute("class", "sensorPosition");
        this.selectedNode = "";
      }
      this.objectBeingAdded = "wall";
      this.SnackBar = false;
    },
    updateTile(position, object) {
      let id = position.x.toString() + "-" + position.y.toString();
      let l = document.getElementById(id);
      l.setAttribute("class", object);
      this.occupiedNodes.push(id);
    },
    updateGridToStore() {
      let agent = this.$store.state.agent;
      this.updateTile(agent, "agent");
      this.lastAddedAgentID = agent.x.toString() + "-" + agent.y.toString();
      let walls = this.$store.state.walls;
      for (let i = 0; i < walls.length; i++) {
        this.updateTile(walls[i].position, "wall");
      }
      let sensors = this.$store.state.sensors;
      for (let i = 0; i < sensors.length; i++) {
        for (let j = 0; j < sensors[i].positions.length; j++) {
          this.updateTile(sensors[i].positions[j], "sensorPosition");
        }
      }
    },
  },
  mounted() {
    this.panzoom = Panzoom(document.getElementById("Grid"), {
      maxScale: 5,
    });
    this.updateGridToStore();
    this.$root.$on("gridZoomIn", () => {
      this.panzoom.zoomIn();
    });
    this.$root.$on("gridZoomOut", () => {
      this.panzoom.zoomOut();
    });
    this.$root.$on("gridClear", () => {
      this.clear();
    });
    this.$root.$on("gridAddSensor", () => {
      this.objectBeingAdded = "sensorPosition";
      this.SnackBar = true;
      this.text = "Add further details about the sensor.";
      this.btnText = "Continue";
    });
    this.$root.$on("gridAddAgent", () => {
      this.objectBeingAdded = "agent";
      this.SnackBar = true;
      this.text = "Finish adding the agent.";
      this.btnText = "Done";
    });
    this.$root.$on("GoTo", () => {
      this.objectBeingAdded = "GoTo";
      this.SnackBar = true;
      this.text = "Select tile to which you want the agent to move to.";
      this.btnText = "Done";
    });
    this.$root.$on("Interact", () => {
      this.objectBeingAdded = "Interact";
      this.SnackBar = true;
      this.text =
        "Select the sensor you want agent to interact with, the selected tile will turn red.";
      this.btnText = "Done";
    });
  },
};
</script>
<style>
.unvisited {
  /* display: inline-block; */
  background: rgba(255, 255, 255, 0.89);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
}

@keyframes makewall {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(32, 34, 32);
  }
}
.wall {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makewall;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
@keyframes makeagent {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(22, 230, 84);
  }
}
.agent {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makeagent;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
@keyframes makeSensorPosition {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(79, 34, 151);
  }
}
.sensorPosition {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makeSensorPosition;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
@keyframes makeSensorTrigger {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(204, 90, 226);
  }
}
.sensorTrigger {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makeSensorTrigger;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
@keyframes makeSelected {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(182, 46, 5);
  }
}
.Selected {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makeSelected;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
</style>
