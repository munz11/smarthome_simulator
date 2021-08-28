<template>
  <div class="pl-3">
    <v-card v-resize="onResize" class="shadow-none">
      <tbody>
        <tr v-for="row in currentRows" :key="row">
          <td
            v-for="col in currentCols"
            :key="col"
            :id="col + '-' + row"
            :class="getClass(col + '-' + row)"
            @mousedown="startWall(col + '-' + row)"
            @mouseover="mouseover(col + '-' + row)"
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
    <v-overlay :value="sensorForm" :light="true" :dark="false">
      <AddSensor
        :physicalArea="physicalArea"
        :interactArea="interactArea"
        @closeSensorForm="completeAddSensor"
        @closeForm="closeFormSensor"
      />
    </v-overlay>
    <v-overlay :value="entityForm" :light="true" :dark="false">
      <AddEntity
        :physicalArea="physicalArea"
        :interactArea="interactArea"
        @closeEntityForm="completeAddEntity"
        @closeForm="closeFormEntity"
      />
    </v-overlay>
    <v-overlay :value="agentForm" :light="true" :dark="false">
      <AddAgent
        :physicalArea="physicalArea"
        @closeAgentForm="completeAddAgent"
        @closeForm="closeFormAgent"
      />
    </v-overlay>
    <v-overlay :value="dbPhysical" :light="true" :dark="false">
      <DbOnPhysical
        @closeCard="dbPhysical = false"
        @addInteract="addinteract"
        @removePhysical="removephysical"
      />
    </v-overlay>
    <v-overlay :value="dbBoth" :light="true" :dark="false">
      <DbOnBoth
        @closeCard="dbBoth = false"
        @removeOnlyInteract="removeOnlyInteract"
        @removeOnlyPhysical="removeOnlyPhysical"
        @removeBoth="removeBoth"
      />
    </v-overlay>
  </div>
</template>

<script>
import node from "@/models/node";
import position from "@/models/position";
import AddSensor from "@/components/widgets/addSensor.vue";
import AddEntity from "@/components/widgets/addEntity.vue";
import AddAgent from "@/components/widgets/addAgent.vue";
import DbOnPhysical from "@/components/widgets/dbOnPhysical.vue";
import DbOnBoth from "@/components/widgets/dbOnBoth.vue";

export default {
  name: "Grid",
  props: ["editGrid"],
  components: { AddSensor, AddEntity, DbOnPhysical, DbOnBoth, AddAgent },
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
      entityForm: false,
      agentForm: false,
      clickCount: 0,
      clickTimer: null,
      delay: 250,
      filterText: this.$store.state.filterText,
      dbPhysical: false,
      saveNode: null,
      dbBoth: false,
      agentsPositions: new Map(),
      visual: this.$store.state.visualSimulation,
    };
  },
  methods: {
    handleClick(ID) {
      if (this.editGrid) {
        this.clickCount++;
        if (this.clickCount === 1) {
          this.clickTimer = setTimeout(() => {
            this.clickCount = 0;
            this.click(ID);
          }, this.delay);
        } else if (this.clickCount === 2) {
          clearTimeout(this.clickTimer);
          this.clickCount = 0;
          this.dbClick(ID);
        }
      }
    },
    onResize() {
      this.y = window.innerHeight - 57;
      this.x = window.innerWidth * 0.83;
      this.calculateNodesDisplayed();
    },
    getClass(ID) {
      return this.displayedNodes
        .get(ID)
        .getTypeofNode(this.$store.state.filterText, this.visual);
    },
    updateClass(ID) {
      let l = document.getElementById(ID);
      if (l != null) {
        l.setAttribute(
          "class",
          this.displayedNodes
            .get(ID)
            .getTypeofNode(this.$store.state.filterText, this.visual)
        );
      }
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
        if (this.interactArea.size == 0) {
          //check if the passive sensors types are present:
          let numlength = this.$store.state.passiveSensors.length;
          if (numlength > 0) {
            this.continueAddSensor();
          } else {
            this.action = "cantAdd";
            this.text = "No sensor types are available";
            this.btnText = "Close";
            this.snackBar = true;
          }
        }
        this.continueAddSensor();
      }
      if (this.action == "entity") {
        if (this.interactArea.size > 0 || this.physicalArea.size > 0) {
          this.continueAddEntity(); //should have atleast one interact node or a physical node
        }
      }
      if (this.action == "agent" && this.physicalArea.size > 0) {
        this.continueAddAgent(); //should have a physical area
      }
      this.action = "wall";
      this.snackBar = false;
      this.text = "";
      this.btnText = "";
    },
    click(ID) {
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
      if (
        this.action == "entity" &&
        this.displayedNodes.get(ID).canAddEntityPhysical()
      ) {
        this.physicalArea.add(ID);
        if (this.interactArea.has(ID)) {
          this.updateClassTemp(ID, "overlap");
        } else {
          this.updateClassTemp(ID, "entityPhysical");
        }
      }
      if (
        this.action == "agent" &&
        this.displayedNodes.get(ID).canAddAgentHere()
      ) {
        if (this.physicalArea.size > 0) {
          this.physicalArea.forEach((previd) => {
            this.updateClass(previd);
          });
          this.physicalArea.clear();
          this.physicalArea.add(ID);
          this.updateClassTemp(ID, "agent");
        } else {
          this.physicalArea.add(ID);
          this.updateClassTemp(ID, "agent");
        }
      }
    },
    dbClick(ID) {
      if (this.action == "wall" && this.displayedNodes.get(ID).hasWall()) {
        this.displayedNodes.get(ID).removeWall();
        this.$store.commit("removeWall", this.getPosition(ID));
        this.updateClass(ID);
      } else if (
        (this.action == "sensor" || this.action == "entity") &&
        this.interactArea.has(ID) &&
        !this.physicalArea.has(ID)
      ) {
        this.interactArea.delete(ID);
        this.updateClass(ID);
      } else if (
        (this.action == "sensor" || this.action == "entity") &&
        !this.interactArea.has(ID) &&
        this.physicalArea.has(ID)
      ) {
        this.dbPhysical = true;
        this.saveNode = ID;
      } else if (
        (this.action == "sensor" || this.action == "entity") &&
        this.interactArea.has(ID) &&
        this.physicalArea.has(ID)
      ) {
        this.dbBoth = true;
        this.saveNode = ID;
      } else if (
        this.action == "sensor" &&
        this.displayedNodes.get(ID).canAddSensorInteract()
      ) {
        this.interactArea.add(ID);
        if (this.physicalArea.has(ID)) {
          this.updateClassTemp(ID, "overlap");
        } else {
          this.updateClassTemp(ID, "interact");
        }
      } else if (
        this.action == "entity" &&
        this.displayedNodes.get(ID).canAddEntityInteract()
      ) {
        this.interactArea.add(ID);
        if (this.physicalArea.has(ID)) {
          this.updateClassTemp(ID, "overlap");
        } else {
          this.updateClassTemp(ID, "interact");
        }
      }
    },
    removephysical() {
      this.physicalArea.delete(this.saveNode);
      this.updateClass(this.saveNode);
      this.dbPhysical = false;
      this.saveNode = null;
    },
    removeOnlyInteract() {
      this.interactArea.delete(this.saveNode);
      if (this.action == "sensor") {
        this.updateClassTemp(this.saveNode, "sensorPhysical");
      } else {
        this.updateClassTemp(this.saveNode, "entityPhysical");
      }
      this.dbBoth = false;
      this.saveNode = null;
    },
    removeOnlyPhysical() {
      this.physicalArea.delete(this.saveNode);
      this.updateClassTemp(this.saveNode, "interact");
      this.dbBoth = false;
      this.saveNode = null;
    },
    removeBoth() {
      this.physicalArea.delete(this.saveNode);
      this.interactArea.delete(this.saveNode);
      this.updateClass(this.saveNode);
      this.dbBoth = false;
      this.saveNode = null;
    },
    addinteract() {
      if (
        this.action == "sensor" &&
        this.displayedNodes.get(this.saveNode).canAddSensorInteract()
      ) {
        this.interactArea.add(this.saveNode);
        if (this.physicalArea.has(this.saveNode)) {
          this.updateClassTemp(this.saveNode, "overlap");
        } else {
          this.updateClassTemp(this.saveNode, "interact");
        }
      } else if (
        this.action == "entity" &&
        this.displayedNodes.get(this.saveNode).canAddEntityInteract()
      ) {
        this.interactArea.add(this.saveNode);
        if (this.physicalArea.has(this.saveNode)) {
          this.updateClassTemp(this.saveNode, "overlap");
        } else {
          this.updateClassTemp(this.saveNode, "interact");
        }
      }
      this.dbPhysical = false;
      this.saveNode = null;
    },
    getPosition(ID) {
      let coords = ID.split("-");
      return new position(parseInt(coords[0]), parseInt(coords[1]));
    },
    startWall(ID) {
      if (
        this.editGrid &&
        this.action == "wall" &&
        this.displayedNodes.get(ID).canAddWallHere()
      ) {
        this.wall = true;
        this.displayedNodes.get(ID).setType("wall");
        this.$store.commit("addWall", this.getPosition(ID));
        this.updateClass(ID);
      }
    },
    mouseover(ID) {
      this.show(ID);
      this.continueWall(ID);
    },
    continueWall(ID) {
      if (this.editGrid && this.action == "wall" && this.wall) {
        if (this.displayedNodes.get(ID).canAddWallHere()) {
          this.displayedNodes.get(ID).setType("wall");
          this.$store.commit("addWall", this.getPosition(ID));
          this.updateClass(ID);
        }
      }
    },
    stopWall(ID) {
      if (this.editGrid && this.action == "wall" && this.wall) {
        if (this.displayedNodes.get(ID).canAddWallHere()) {
          this.displayedNodes.get(ID).setType("wall");
          this.$store.commit("addWall", this.getPosition(ID));
          this.updateClass(ID);
        }
        this.wall = false;
      }
    },
    addSensor() {
      this.physicalArea.clear();
      this.interactArea.clear();
      //check if any type of sensor is available:
      let numTypes =
        this.$store.state.passiveSensors.length +
        this.$store.state.activeSensors.length;
      if (numTypes == 0) {
        //cannot add sensor so give warning
        this.action = "cantAdd";
        this.text = "No sensor types are available";
        this.btnText = "Close";
        this.snackBar = true;
      } else {
        this.action = "sensor";
        this.text =
          "Add physical area by single click and interact area by double click, then continue to finish adding the sensor.";
        this.btnText = "Continue";
        this.snackBar = true;
      }
    },
    continueAddSensor() {
      this.sensorForm = true;
      //reset the interact and physical area of the nodes to what they were previously
      this.interactArea.forEach((ID) => {
        this.updateClass(ID);
      });
      this.physicalArea.forEach((ID) => {
        this.updateClass(ID);
      });
    },
    completeAddSensor() {
      this.sensorForm = false;
      let sensorAdded = this.$store.getters.lastSensorAdded;
      this.showSensorOnNode(sensorAdded);
      this.physicalArea.forEach((ID) => {
        this.updateClass(ID);
      });
      this.interactArea.forEach((ID) => {
        this.updateClass(ID);
      });
      this.physicalArea.clear();
      this.interactArea.clear();
    },
    closeFormSensor() {
      this.sensorForm = false;
      this.physicalArea.clear();
      this.interactArea.clear();
    },
    showSensorOnNode(sensor) {
      for (let i = 0; i < sensor.interactArea.length; i++) {
        this.displayedNodes
          .get(this.getID(sensor.interactArea[i]))
          .setType("sensorInteract");
        this.displayedNodes
          .get(this.getID(sensor.interactArea[i]))
          .setSensor(sensor.name, sensor.walkable);
      }
      for (let j = 0; j < sensor.physicalArea.length; j++) {
        this.displayedNodes
          .get(this.getID(sensor.physicalArea[j]))
          .setType("sensorPhysical");
        this.displayedNodes
          .get(this.getID(sensor.physicalArea[j]))
          .setSensor(sensor.name, sensor.walkable);
      }
    },
    addEntity() {
      this.physicalArea.clear();
      this.interactArea.clear();
      this.action = "entity";
      this.text =
        "Add physical area by single click and interact area by double click, then continue to finish adding the entity.";
      this.btnText = "Continue";
      this.snackBar = true;
    },
    continueAddEntity() {
      this.entityForm = true;
      //reset the interact and physical area of the nodes to what they were previously
      this.interactArea.forEach((ID) => {
        this.updateClass(ID);
      });
      this.physicalArea.forEach((ID) => {
        this.updateClass(ID);
      });
    },
    completeAddEntity() {
      this.entityForm = false;
      let entityAdded = this.$store.getters.lastEntityAdded;
      this.showEntityOnNode(entityAdded);
      this.physicalArea.forEach((ID) => {
        this.updateClass(ID);
      });
      this.interactArea.forEach((ID) => {
        this.updateClass(ID);
      });
      this.physicalArea.clear();
      this.interactArea.clear();
    },
    closeFormEntity() {
      this.entityForm = false;
      this.physicalArea.clear();
      this.interactArea.clear();
    },
    showEntityOnNode(entity) {
      for (let i = 0; i < entity.interactArea.length; i++) {
        this.displayedNodes
          .get(this.getID(entity.interactArea[i]))
          .setType("entityInteract");
        this.displayedNodes
          .get(this.getID(entity.interactArea[i]))
          .setEntity(entity.name, entity.walkable);
      }
      for (let j = 0; j < entity.physicalArea.length; j++) {
        this.displayedNodes
          .get(this.getID(entity.physicalArea[j]))
          .setType("entityPhysical");
        this.displayedNodes
          .get(this.getID(entity.physicalArea[j]))
          .setEntity(entity.name, entity.walkable);
      }
    },
    addAgent() {
      this.physicalArea.clear();
      this.interactArea.clear();
      this.action = "agent";
      this.text =
        "Add start position of agent by single click, then continue to finish adding the agent.";
      this.btnText = "Continue";
      this.snackBar = true;
    },
    continueAddAgent() {
      this.agentForm = true;
      this.physicalArea.forEach((ID) => {
        this.updateClass(ID);
      });
    },
    completeAddAgent() {
      this.agentForm = false;
      let agentAdded = this.$store.getters.lastAgentAdded;
      this.showAgentOnNode(agentAdded);
      this.physicalArea.forEach((ID) => {
        this.updateClass(ID);
      });
      this.physicalArea.clear();
    },
    closeFormAgent() {
      this.agentForm = false;
      this.physicalArea.clear();
    },
    showAgentOnNode(agentAdded) {
      this.displayedNodes
        .get(this.getID(agentAdded.initialPosition))
        .setType("agent");
      this.displayedNodes
        .get(this.getID(agentAdded.initialPosition))
        .setAgentName(agentAdded.id);
    },
    getID(position) {
      return position.x.toString() + "-" + position.y.toString();
    },
    show(ID) {
      this.$root.$emit(
        "tooltip",
        this.displayedNodes.get(ID).displayNodeInfo()
      );
    },
    updateNodesToStore() {
      //assumes that the store contains the allowed node types
      let walls = this.$store.state.walls;
      for (let i = 0; i < walls.length; i++) {
        this.displayedNodes.get(this.getID(walls[i])).setType("wall");
      }
      let sensors = this.$store.getters.listSensors;
      for (let i = 0; i < sensors.length; i++) {
        this.showSensorOnNode(sensors[i]);
      }
      let entities = this.$store.state.entities;
      for (let i = 0; i < entities.length; i++) {
        this.showEntityOnNode(entities[i]);
      }
      let agents = this.$store.state.agents;
      for (let i = 0; i < agents.length; i++) {
        this.showAgentOnNode(agents[i]);
      }
    },
    setAllNodesToEmpty() {
      //reset all the nodes which contained something

      let walls = this.$store.state.walls;
      for (let i = 0; i < walls.length; i++) {
        this.displayedNodes.get(this.getID(walls[i])).reset();
        this.updateClass(this.getID(walls[i]));
      }
      let sensors = this.$store.getters.listSensors;
      for (let i = 0; i < sensors.length; i++) {
        for (let j = 0; j < sensors[i].physicalArea.length; j++) {
          this.displayedNodes
            .get(this.getID(sensors[i].physicalArea[j]))
            .reset();
          this.updateClass(this.getID(sensors[i].physicalArea[j]));
        }
        for (let j = 0; j < sensors[i].interactArea.length; j++) {
          this.displayedNodes
            .get(this.getID(sensors[i].interactArea[j]))
            .reset();
          this.updateClass(this.getID(sensors[i].interactArea[j]));
        }
      }
      let entities = this.$store.state.entities;
      for (let i = 0; i < entities.length; i++) {
        for (let j = 0; j < entities[i].physicalArea.length; j++) {
          this.displayedNodes
            .get(this.getID(entities[i].physicalArea[j]))
            .reset();
          this.updateClass(this.getID(entities[i].physicalArea[j]));
        }
        for (let j = 0; j < entities[i].interactArea.length; j++) {
          this.displayedNodes
            .get(this.getID(entities[i].interactArea[j]))
            .reset();
          this.updateClass(this.getID(entities[i].interactArea[j]));
        }
      }
      let agents = this.$store.state.agents;
      for (let i = 0; i < agents.length; i++) {
        this.displayedNodes.get(this.getID(agents[i].initialPosition)).reset();
        this.updateClass(this.getID(agents[i].initialPosition));
      }
    },
    clear() {
      this.setAllNodesToEmpty();
      this.$store.commit("clearAllInfoOnGrid");
    },

    panRight() {
      let val = this.currentCols.length;
      if (
        this.maxCol - this.currentCols.length > 0 &&
        this.currentCols[val - 1] !== this.maxCol - 1
      ) {
        let el = this.currentCols[val - 1] + 1;
        this.currentCols.shift();
        this.currentCols.push(el);
      } else {
        this.text = "Cannot move towards right.";
        this.btnText = "Close";
        this.snackBar = true;
      }
    },
    panLeft() {
      if (
        this.maxCol - this.currentCols.length > 0 &&
        this.currentCols[0] !== 0
      ) {
        let el = this.currentCols[0] - 1;
        this.currentCols.pop();
        this.currentCols.unshift(el);
      } else {
        this.text = "Cannot move towards left.";
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
    updateSensorEntityNodes() {
      let sensors = this.$store.getters.listSensors;
      for (let i = 0; i < sensors.length; i++) {
        for (let j = 0; j < sensors[i].physicalArea.length; j++) {
          this.updateClass(this.getID(sensors[i].physicalArea[j]));
        }
        for (let j = 0; j < sensors[i].interactArea.length; j++) {
          this.updateClass(this.getID(sensors[i].interactArea[j]));
        }
      }
      let entities = this.$store.state.entities;
      for (let i = 0; i < entities.length; i++) {
        for (let j = 0; j < entities[i].physicalArea.length; j++) {
          this.updateClass(this.getID(entities[i].physicalArea[j]));
        }
        for (let j = 0; j < entities[i].interactArea.length; j++) {
          this.updateClass(this.getID(entities[i].interactArea[j]));
        }
      }
    },
    updateAgentNodes() {
      let agents = this.$store.state.agents;
      for (let i = 0; i < agents.length; i++) {
        this.showAgentOnNode(agents[i]);
        this.updateClass(this.getID(agents[i].initialPosition));
      }
    },
    updateAgentsPositionsList(){
      this.agentsPositions = new Map();
      let agents = this.$store.state.agents;
      for (let i = 0; i < agents.length; i++) {
        this.agentsPositions.set(agents[i].id,agents[i].initialPosition);
      };
    },
    visualAgentOnNewNode(newPosition, agentName) {
      this.displayedNodes.get(this.getID(newPosition)).setType("agent");
      this.displayedNodes.get(this.getID(newPosition)).setAgentName(agentName);
      this.updateClass(this.getID(newPosition));
    },
    visualRemoveAgent(position,agentName) {
      this.displayedNodes.get(this.getID(position)).removeAgent(agentName);
      this.updateClass(this.getID(position));
    },
    visualMoveAgent(agentName, newX, newY) {
      let oldPosition = this.agentsPositions.get(agentName);
      this.visualRemoveAgent(oldPosition,agentName);
      let newPosition = new position(newX, newY);
      this.visualAgentOnNewNode(newPosition, agentName);
      this.agentsPositions.set(agentName, newPosition);
    },
    updateGridForVisualSimulation() {
      if (this.visual == "true") {
        this.updateAgentsPositionsList();
        this.updateSensorEntityNodes();
      } else {
        this.agentsPositions.forEach((value) => {
          this.visualRemoveAgent(value);
        });
        this.updateAgentsPositionsList();
        this.updateSensorEntityNodes();
        this.updateAgentNodes();
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
    this.updateGridForVisualSimulation();
    this.$root.$on("visualMoveAgent", (agentName, x, y) => {
      if (this.visual == "true") {
        this.visualMoveAgent(agentName, x, y);
      }
    });
    this.$root.$on("gridClear", () => {
      this.clear();
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
    this.$root.$on("gridAddEntity", () => {
      this.addEntity();
    });
    this.$root.$on("gridAddAgent", () => {
      this.addAgent();
    });
    this.$root.$on("visualSimulationUpdated", () => {
      this.visual = this.$store.state.visualSimulation;
      this.updateGridForVisualSimulation();
    });
  },
  watch: {
    filterText: function () {
      this.updateSensorEntityNodes();
    },
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
.entityPhysical {
  /* display: inline-block; */
  background-color: rgba(66, 22, 228, 0.89);
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
