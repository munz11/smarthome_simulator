<template>
  <div>
    <v-card :height="y" :width="x" v-resize="onResize">
      <tbody>
        <tr v-for="row in currentRows" :key="row">
          <td
            v-for="col in currentCols"
            :key="col"
            :id="col + '-' + row"
            :class="getClass(col + '-' + row)"
            v-tooltip.hover="show(col + '-' + row)"
            @mousedown="startWall(col + '-' + row)"
            @mouseover="continueWall(col + '-' + row)"
            @mouseup="stopWall(col + '-' + row)"
            @click="handleClick(col + '-' + row)"
          ></td>
        </tr>
      </tbody>
    </v-card>
    <v-snackbar v-model="snackBar" timeout="-1" bottom>
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="closeSnackBar">
          {{ btnText }}
        </v-btn>
      </template>
    </v-snackbar>
    <!--v-overlay :value="sensorForm" :light="true" :dark="false">
      <AddSensor
        :physicalArea="physicalArea"
        :interactArea="interactArea"
        @closeSensorForm="completeAddSensor"
      />
    </v-overlay-->
  </div>
</template>

<script>
import node from "@/models/node";
import position from "@/models/position";
import AddSensor from "@/components/widgets/addSensor.vue";

export default {
  name: "Grid",
  props: ["editGrid"],
  //components: { AddSensor },
  data() {
    return {
      x: window.innerWidth * 0.83,
      y: window.innerHeight - 57,
      displayedNodes: new Map(),
      currentRows: [],
      currentCols: [],
      maxRow: this.$store.state.floorPlanDetails.height,
      maxCol: this.$store.state.floorPlanDetails.width,
      action: "wall",
      wall: false,
      snackBar: false,
      text: "",
      btnText: "",
      physicalArea: new Set(),
      interactArea: new Set(),
      sensorForm: false,
      clickCount: 0,
      clickTimer: null,
      delay: 250,
    };
  },
  methods: {
    handleClick(ID) {
      this.clickCount++
      if (this.clickCount === 1) {
        this.clickTimer = setTimeout(() => {
          this.clickCount = 0
          this.click(ID)
        }, this.delay)
      } else if (this.clickCount === 2) {
        clearTimeout(this.clickTimer)
        this.clickCount = 0
        this.dbClick(ID);
      }
    },
    onResize() {
      this.y = window.innerHeight - 57;
      this.x = window.innerWidth * 0.83;
      this.calculateNodesDisplayed();
    },
    getClass(ID) {
      return this.displayedNodes.get(ID).getTypeofNode();
    },
    updateClass(ID) {
      let l = document.getElementById(ID);
      l.setAttribute("class", this.displayedNodes.get(ID).getTypeofNode());
    },
    updateClassTemp(ID, type) {
      let l = document.getElementById(ID);
      l.setAttribute("class", type);
    },
    calculateNodesDisplayed() {
      this.currentCols = [];
      this.currentRows = [];
      let displayCol = Math.floor((42 * this.x) / 1062);
      let displayRow = Math.floor((21 * this.y) / 553);
      if (displayCol > this.maxCol) {
        displayCol = this.maxCol;
      }
      if (displayRow > this.maxRow) {
        displayRow = this.maxRow;
      }
      for (let j = 0; j < displayCol; j++) {
        this.currentCols.push(j);
      }
      for (let j = 0; j < displayRow; j++) {
        this.currentRows.push(j);
      }
    },
    closeSnackBar() {
      if (this.action == "sensor") {
        console.log(this.physicalArea);
        console.log(this.interactArea);
      }
      this.action = "wall";
      this.snackBar = false;
      this.text = "";
      this.btnText = "";
    },
    click(ID) {
      if (
        this.action == "agent" &&
        this.displayedNodes.get(ID).canMoveAgentHere()
      ) {
        this.updateAgentNodes(ID);
      }
      if (
        this.action == "sensor" &&
        this.displayedNodes.get(ID).canAddSensorPhysical()
      ) {
        this.physicalArea.add(ID);
        if (this.interactArea.has(ID)) {
          this.updateClassTemp(ID, "overlap");
        } else {
          this.updateClassTemp(ID, "sensorPhysical");
        }
      }
    },
    updateAgentNodes(ID) {
      this.displayedNodes
        .get(this.getID(this.$store.state.agent))
        .removeAgent(); // remove the agent from this node
      this.updateClass(this.getID(this.$store.state.agent)); //update the node class
      this.displayedNodes.get(ID).setType("agent"); //update the new agent node
      this.updateClass(ID); //update the class of new agent node
      this.$store.commit("updateAgent", this.getPosition(ID)); //update store
    },
    dbClick(ID) {
      if (
        this.action == "wall" &&
        this.displayedNodes.get(ID).type.includes("wall")
      ) {
        this.displayedNodes.get(ID).removeWall();
        this.$store.commit("removeWall", this.getPosition(ID));
        this.updateClass(ID);
      }
      if (
        this.action == "sensor" &&
        this.displayedNodes.get(ID).canAddSensorInteract()
      ) {
        this.interactArea.add(ID);
        if (this.physicalArea.has(ID)) {
          this.updateClassTemp(ID, "overlap");
        } else {
          this.updateClassTemp(ID, "interact");
        }
      }
    },
    getPosition(ID) {
      let coords = ID.split("-");
      return new position(parseInt(coords[0]), parseInt(coords[1]));
    },
    startWall(ID) {
      if (
        this.action == "wall" &&
        this.displayedNodes.get(ID).canAddWallHere()
      ) {
        this.wall = true;
        this.displayedNodes.get(ID).setType("wall");
        this.$store.commit("addWall", this.getPosition(ID));
        this.updateClass(ID);
      }
    },
    continueWall(ID) {
      if (this.action == "wall" && this.wall) {
        if (this.displayedNodes.get(ID).canAddWallHere()) {
          this.displayedNodes.get(ID).setType("wall");
          this.$store.commit("addWall", this.getPosition(ID));
          this.updateClass(ID);
        }
      }
    },
    stopWall(ID) {
      if (this.action == "wall" && this.wall) {
        if (this.displayedNodes.get(ID).canAddWallHere()) {
          this.displayedNodes.get(ID).setType("wall");
          this.$store.commit("addWall", this.getPosition(ID));
          this.updateClass(ID);
        }
        this.wall = false;
      }
    },
    addSensor() {
      //check if any type of sensor is available:
      let numTypes =
        this.$store.state.passiveSensors.length +
        this.$store.state.activeSensors.length;
      console.log(numTypes);
      /*if (numTypes == 0) {
        //cannot add sensor so give warning
        this.action = "cantAdd";
        this.text = "No sensor types are available";
        this.btnText = "Close";
        this.snackBar = true;
      } else {*/
        this.action = "sensor";
        this.text =
          "Add sensor physical area by single click and interact area by double click, then continue to finish adding the sensor.";
        this.btnText = "Continue";
        this.snackBar = true;
      //}
    },
    getID(position) {
      return position.x.toString() + "-" + position.y.toString();
    },
    show(ID) {
      return this.displayedNodes.get(ID).displayNodeInfo();
    },
    updateNodesToStore() {
      //assumes that the store contains the allowed node types, so no need to check if the agent or a wall can be added here
      this.displayedNodes
        .get(this.getID(this.$store.state.agent))
        .setType("agent");
      let walls = this.$store.state.walls;
      for (let i = 0; i < walls.length; i++) {
        this.displayedNodes.get(this.getID(walls[i])).setType("wall");
      }
    },
    setAllNodesToEmpty() {
      //reset all the nodes which contained something - removes agent and wall atm
      this.displayedNodes.get(this.getID(this.$store.state.agent)).reset();
      this.updateClass(this.getID(this.$store.state.agent));
      let walls = this.$store.state.walls;
      for (let i = 0; i < walls.length; i++) {
        this.displayedNodes.get(this.getID(walls[i])).reset();
        this.updateClass(this.getID(walls[i]));
      }
    },
    clear() {
      this.setAllNodesToEmpty();
      this.$store.commit("clearAllInfoOnGrid");
      this.displayedNodes
        .get(this.getID(this.$store.state.agent))
        .setType("agent"); //reset agent position according to store
      this.updateClass(this.getID(this.$store.state.agent));
    },
    moveAgent() {
      this.action = "agent";
      this.text = "Move the agent by clicking on a new tile.";
      this.btnText = "Done";
      this.snackBar = true;
    },
    panLeft() {
      let val = this.currentCols.length;
      if (this.maxCol - this.currentCols.length > 0) {
        let el = this.currentCols[val - 1] + 1;
        this.currentCols.shift();
        this.currentCols.push(el);
      } else {
        this.text = "Cannot move towards left.";
        this.btnText = "Close";
        this.snackBar = true;
      }
    },
    panRight() {
      if (
        this.maxCol - this.currentCols.length > 0 &&
        this.currentCols[0] !== 0
      ) {
        let el = this.currentCols[0] - 1;
        this.currentCols.pop();
        this.currentCols.unshift(el);
      } else {
        this.text = "Cannot move towards right.";
        this.btnText = "Close";
        this.snackBar = true;
      }
    },
    panDown() {
      let val = this.currentRows.length;
      if (this.maxRow - this.currentRows.length > 0) {
        let el = this.currentRows[val - 1] + 1;
        this.currentRows.shift();
        this.currentRows.push(el);
      } else {
        this.text = "Cannot move down.";
        this.btnText = "Close";
        this.snackBar = true;
      }
    },
    panUp() {
      if (
        this.maxRow - this.currentRows.length > 0 &&
        this.currentRows[0] !== 0
      ) {
        let el = this.currentRows[0] - 1;
        this.currentRows.pop();
        this.currentRows.unshift(el);
      } else {
        this.text = "Cannot move up.";
        this.btnText = "Close";
        this.snackBar = true;
      }
    },
  },
  beforeMount() {
    for (let i = 0; i < this.maxRow; i++) {
      for (let j = 0; j < this.maxCol; j++) {
        let key = j.toString() + "-" + i.toString();
        this.displayedNodes.set(key, new node(key));
      }
    }
  },
  mounted() {
    this.calculateNodesDisplayed();
    this.updateNodesToStore();
    this.$root.$on("gridClear", () => {
      this.clear();
    });
    this.$root.$on("gridMoveAgent", () => {
      this.moveAgent();
    });
    this.$root.$on("gridPanLeft", () => {
      this.panLeft();
    });
    this.$root.$on("gridPanRight", () => {
      this.panRight();
    });
    this.$root.$on("gridPanDown", () => {
      this.panDown();
    });
    this.$root.$on("gridPanUp", () => {
      this.panUp();
    });
    this.$root.$on("gridAddSensor", () => {
      this.addSensor();
    });
  },
};
</script>
<style>
.empty {
  /* display: inline-block; */
  background: rgba(255, 255, 255, 0.89);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
}
.agent {
  /* display: inline-block; */
  background-color: rgb(22, 230, 84);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
}
.wall {
  /* display: inline-block; */
  background-color: rgba(10, 2, 2, 0.89);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
}
.sensorPhysical {
  /* display: inline-block; */
  background-color: rgba(160, 17, 179, 0.89);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
}
.interact {
  /* display: inline-block; */
  background-color: rgba(238, 153, 231, 0.89);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
}
.overlap {
  /* display: inline-block; */
  background-color: rgba(240, 13, 32, 0.89);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
}
</style>
