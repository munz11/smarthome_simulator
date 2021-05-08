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
            @dblclick="dbClick(col + '-' + row)"
          ></td>
        </tr>
      </tbody>
    </v-card>
  </div>
</template>

<script>
import node from "@/models/node";
import position from "@/models/position";

export default {
  name: "Grid",
  props: ["editGrid"],
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
    };
  },
  methods: {
    onResize() {
      this.y = window.innerHeight - 57;
      this.x = window.innerWidth * 0.83;
    },
    getClass(ID) {
      return this.displayedNodes.get(ID).type;
    },
    updateClass(ID) {
      let l = document.getElementById(ID);
      l.setAttribute("class", this.displayedNodes.get(ID).type);
    },
    calculateNodesDisplayed() {
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
    dbClick(ID) {
      if (this.action == "wall" && this.displayedNodes.get(ID).type == "wall") {
        this.displayedNodes.get(ID).type = "empty";
        this.$store.commit("removeWall", this.getPosition(ID));
        this.updateClass(ID);
      }
    },
    getPosition(ID) {
      let coords = ID.split("-");
      return new position(parseInt(coords[0]), parseInt(coords[1]));
    },
    startWall(ID) {
      if (
        this.action == "wall" &&
        this.displayedNodes.get(ID).type == "empty"
      ) {
        this.wall = true;
        this.displayedNodes.get(ID).setType("wall");
        this.$store.commit("addWall", this.getPosition(ID));
        this.updateClass(ID);
      }
    },
    continueWall(ID) {
      if (this.action == "wall" && this.wall) {
        if (this.displayedNodes.get(ID).type == "empty") {
          this.displayedNodes.get(ID).setType("wall");
          this.$store.commit("addWall", this.getPosition(ID));
          this.updateClass(ID);
        }
      }
    },
    stopWall(ID) {
      if (this.action == "wall" && this.wall) {
        if (this.displayedNodes.get(ID).type == "empty") {
          this.displayedNodes.get(ID).setType("wall");
          this.$store.commit("addWall", this.getPosition(ID));
          this.updateClass(ID);
        }
        this.wall = false; // so this time need to add wall to this node and then stop adding
      }
    },
    getID(position) {
      return position.x.toString() + "-" + position.y.toString();
    },
    show(ID) {
      if (this.displayedNodes.get(ID).type == "sensor") {
        return ID + ", " + this.displayedNodes.get(ID).sensorName;
      }
      return ID;
    },
    updateNodesToStore() {
      this.displayedNodes
        .get(this.getID(this.$store.state.agent))
        .setType("agent");
      let walls = this.$store.state.walls;
      for (let i = 0; i < walls.length; i++) {
        this.displayedNodes.get(this.getID(walls[i])).setType("wall");
      }
      let sensors = this.$store.state.sensors;
      for (let i = 0; i < sensors.length; i++) {
        for (let j = 0; j < sensors[i].positions.length; j++) {
          this.displayedNodes
            .get(this.getID(sensors[i].positions[j]))
            .setSensor("sensor", sensors[i].name);
        }
      }
    },
    setAllNodesToEmpty() {
      this.displayedNodes
        .get(this.getID(this.$store.state.agent))
        .setType("empty");
      this.updateClass(this.getID(this.$store.state.agent));
      let walls = this.$store.state.walls;
      for (let i = 0; i < walls.length; i++) {
        this.displayedNodes.get(this.getID(walls[i])).setType("empty");
        this.updateClass(this.getID(walls[i]));
      }
      let sensors = this.$store.state.sensors;
      for (let i = 0; i < sensors.length; i++) {
        for (let j = 0; j < sensors[i].positions.length; j++) {
          this.displayedNodes
            .get(this.getID(sensors[i].positions[j]))
            .setType("empty");
          this.updateClass(this.getID(sensors[i].positions[j]));
        }
      }
    },
    clear() {
      this.setAllNodesToEmpty();
      this.$store.commit("clearAllInfoOnGrid");
      this.updateNodesToStore();
      this.displayedNodes
        .get(this.getID(this.$store.state.agent))
        .setType("agent");
      this.updateClass(this.getID(this.$store.state.agent));
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
</style>
