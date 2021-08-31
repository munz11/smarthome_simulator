<template>
  <b-list-group flush>
    <b-list-group-item>
      <p>Download the Json of the floor map</p>
      <b-button @click="download">Download</b-button>
    </b-list-group-item>
    
    <b-list-group-item>
      <p>Upload the floor map</p>
      <b-form-file
        v-model="File"
        :state="Boolean(File)"
        accept=".json"
        placeholder="Choose a file or drop it here..."
        drop-placeholder="Drop file here..."
        class="mb-2"
      ></b-form-file>
      <b-button @click="upload">Upload</b-button>
      <p :v-if="messageFromUpload.length > 0">{{ messageFromUpload }}</p>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
import exportFromJSON from "export-from-json";
import * as validator from "is-my-json-valid";
import floorPlanDetails from "@/models/floorPlanDetails";
import position from "@/models/position";
import sensor from "@/models/sensor";
import entity from "@/models/entity";
import agent from "@/models/agent";
export default {
  name: "UploadDownload",
  data() {
    return {
      passiveSensors: [],
      activeSensors: [],
      File: null,
      errors: null,
      messageFromUpload: "",
      jsonData: null,
      data: null,
    };
  },
  methods: {
    close() {
      this.$emit("closeCard");
    },
    upload() {
      if (!this.File) {
        this.messageFromUpload = "No File Chosen";
      } else {
        var reader = new FileReader();
        reader.readAsText(this.File);
        reader.onload = () => {
          this.data = reader.result;
        };
        setTimeout(() => {
          this.valid();
        }, 1500);
      }
    },
    updateStore() {
      this.$store.commit("clearAllInfoOnGrid");
      this.$store.commit(
        "updateFloorPlanDetails",
        new floorPlanDetails(
          this.jsonData.width,
          this.jsonData.height,
          this.jsonData.tileSideLength
        )
      );
      for (let i = 0; i < this.jsonData.passiveSensors.length; i++) {
        let newSensor = this.jsonData.passiveSensors[i];
        this.$store.commit(
          "addSensor",
          new sensor(
            newSensor.name,
            newSensor.physicalArea,
            newSensor.interactArea,
            newSensor.triggerFrequency,
            newSensor.type,
            newSensor.walkable,
            "passive"
          )
        );
      }
      for (let i = 0; i < this.jsonData.activeSensors.length; i++) {
        let newSensor = this.jsonData.activeSensors[i];
        this.$store.commit(
          "addSensor",
          new sensor(
            newSensor.name,
            newSensor.physicalArea,
            newSensor.interactArea,
            0,
            newSensor.type,
            newSensor.walkable,
            "active"
          )
        );
      }
      for (let i = 0; i < this.jsonData.entities.length; i++) {
        let newEntity = this.jsonData.entities[i];
        this.$store.commit(
          "addEntity",
          new entity(
            newEntity.name,
            newEntity.interactArea,
            newEntity.physicalArea,
            newEntity.walkable
          )
        );
      }
      for (let i = 0; i < this.jsonData.walls.length; i++) {
        let wall = this.jsonData.walls[i];
        this.$store.commit("addWall", new position(wall.x, wall.y));
      }
      for (let i = 0; i < this.jsonData.agents.length; i++) {
        let newAgent = this.jsonData.agents[i];
        this.$store.commit(
          "addAgent",
          new agent(newAgent.id, newAgent.initialPosition, newAgent.speed)
        );
      }
    },
    download() {
      this.getPassiveActiveSensors();
      let data = {
        tileSideLength: this.$store.state.floorPlanDetails.tileSideLenght,
        width: this.$store.state.floorPlanDetails.width,
        height: this.$store.state.floorPlanDetails.height,
        agents: this.$store.state.agents,
        passiveSensors: this.passiveSensors,
        activeSensors: this.activeSensors,
        walls: this.$store.state.walls,
        entities: this.$store.state.entities,
      };
      const fileName = "floorPlan";
      const exportType = "json";
      exportFromJSON({ data, fileName, exportType });
    },
    getPassiveActiveSensors() {
      let sensors = this.$store.getters.listSensors;
      for (let i = 0; i < sensors.length; i++) {
        if (sensors[i].isPassive()) {
          this.passiveSensors.push(sensors[i].getPassiveSensor());
        } else {
          this.activeSensors.push(sensors[i].getActiveSensor());
        }
      }
    },
    valid() {
      var validate = validator({
        required: true,
        type: "object",
        properties: {
          tileSideLength: {
            required: true,
            type: "number",
            minimum: 0,
          },
          width: {
            required: true,
            type: "number",
            minimum: 1,
          },
          height: {
            required: true,
            type: "number",
            minimum: 1,
          },
          agents: {
            type: "array",
            required: true,
            items: { $ref: "#/$defs/agent" },
          },
          passiveSensors: {
            type: "array",
            required: true,
            items: { $ref: "#/$defs/passive" },
          },
          activeSensors: {
            type: "array",
            required: true,
            items: { $ref: "#/$defs/active" },
          },
          walls: {
            type: "array",
            required: true,
            items: { $ref: "#/$defs/position" },
          },
          entities: {
            type: "array",
            required: true,
            items: { $ref: "#/$defs/entity" },
          },
        },
        $defs: {
          passive: {
            type: "object",
            required: [
              "type",
              "name",
              "physicalArea",
              "interactArea",
              "walkable",
              "triggerFrequency",
            ],
            properties: {
              type: {
                type: "string",
              },
              name: {
                type: "string",
              },
              physicalArea: {
                type: "array",
                items: { $ref: "#/$defs/position" },
              },
              interactArea: {
                type: "array",
                items: { $ref: "#/$defs/position" },
              },
              walkable: {
                type: "boolean",
              },
              triggerFrequency: {
                type: "number",
              },
            },
          },
          position: {
            required: true,
            type: "object",
            properties: {
              x: {
                required: true,
                type: "number",
                minimum: 0,
              },
              y: {
                required: true,
                type: "number",
                minimum: 0,
              },
            },
          },
          active: {
            type: "object",
            required: [
              "type",
              "name",
              "physicalArea",
              "interactArea",
              "walkable",
            ],
            properties: {
              type: {
                type: "string",
              },
              name: {
                type: "string",
              },
              physicalArea: {
                type: "array",
                items: { $ref: "#/$defs/position" },
              },
              interactArea: {
                type: "array",
                items: { $ref: "#/$defs/position" },
              },
              walkable: {
                type: "boolean",
              },
            },
          },
          entity: {
            type: "object",
            required: ["name", "physicalArea", "interactArea", "walkable"],
            properties: {
              name: {
                type: "string",
              },
              physicalArea: {
                type: "array",
                items: { $ref: "#/$defs/position" },
              },
              interactArea: {
                type: "array",
                items: { $ref: "#/$defs/position" },
              },
              walkable: {
                type: "boolean",
              },
            },
          },
          agent: {
            type: "object",
            required: ["id", "initialPosition", "speed"],
            properties: {
              id: {
                type: "string",
              },
              initialPostion: {
                type: "object",
                properties: {
                  x: {
                    required: true,
                    type: "number",
                    minimum: 0,
                  },
                  y: {
                    required: true,
                    type: "number",
                    minimum: 0,
                  },
                },
              },
              speed: {
                type: "number",
                minimum: "0",
              },
            },
          },
        },
      });

      try {
        this.jsonData = JSON.parse(this.data);

        let isValid = validate(this.jsonData);
        
        if (!isValid) {
          this.messageFromUpload =
            "Errors in the json format, could not be validated.";
        } else {
          if (this.checkErrors()) {
            this.updateStore();
            this.messageFromUpload = "Success.";
            this.$router.go();
          }
        }
      } catch (err) {
        this.messageFromUpload = err;
      }
    },
    checkErrors() {
      
      let width = 0;
      if (this.jsonData.width < 1 || this.jsonData.width > 100) {
        this.messageFromUpload = "The width is not within the range 1-100.";
        return false;
      } else {
        width = this.jsonData.width;
      }
      let height = 0;
      if (this.jsonData.height < 1 || this.jsonData.height > 100) {
        this.messageFromUpload = "The height is not within the range 1-100.";
        return false;
      } else {
        height = this.jsonData.height;
      }
      
      const sensorName = [];
      const entityName = [];
      const agentName = [];
      for (let i = 0; i < this.jsonData.passiveSensors.length; i++) {
        let newSensor = this.jsonData.passiveSensors[i];
        if (sensorName.includes(newSensor.name)) {
          this.messageFromUpload = "One of the sensor name is not unique";
          return false;
        }
        sensorName.push(newSensor.name);
        for (let j = 0; j < newSensor.physicalArea.length; j++) {
          if (
            newSensor.physicalArea[j].x >= width ||
            newSensor.physicalArea[j].y >= height
          ) {
            this.messageFromUpload =
              "A sensor area is not positioned correctly";
            return false;
          }
        }

        for (let j = 0; j < newSensor.interactArea.length; j++) {
          if (
            newSensor.interactArea[j].x >= width ||
            newSensor.interactArea[j].y >= height
          ) {
            this.messageFromUpload =
              "A sensor area is not positioned correctly";
            return false;
          }
        }
      }
      for (let i = 0; i < this.jsonData.activeSensors.length; i++) {
        let newSensor = this.jsonData.activeSensors[i];
        if (sensorName.includes(newSensor.name)) {
          this.messageFromUpload = "One of the sensor name is not unique";
          return false;
        }
        sensorName.push(newSensor.name);
        for (let j = 0; j < newSensor.physicalArea.length; j++) {
          if (
            newSensor.physicalArea[j].x >= width ||
            newSensor.physicalArea[j].y >= height
          ) {
            this.messageFromUpload =
              "A sensor area is not positioned correctly";
            return false;
          }
        }
        for (let j = 0; j < newSensor.interactArea.length; j++) {
          if (
            newSensor.interactArea[j].x >= width ||
            newSensor.interactArea[j].y >= height
          ) {
            this.messageFromUpload =
              "A sensor area is not positioned correctly";
            return false;
          }
        }
      }

      for (let i = 0; i < this.jsonData.entities.length; i++) {
        let newEntity = this.jsonData.entities[i];
        if (entityName.includes(newEntity.name)) {
          this.messageFromUpload = "One of the entity name is not unique";
          return false;
        }
        entityName.push(newEntity.name);
        for (let j = 0; j < newEntity.physicalArea.length; j++) {
          if (
            newEntity.physicalArea[j].x >= width ||
            newEntity.physicalArea[j].y >= height
          ) {
            this.messageFromUpload =
              "An entity area is not positioned correctly";
            return false;
          }
        }
        for (let j = 0; j < newEntity.interactArea.length; j++) {
          if (
            newEntity.interactArea[j].x >= width ||
            newEntity.interactArea[j].y >= height
          ) {
            this.messageFromUpload =
              "An entity area is not positioned correctly";
            return false;
          }
        }
      }
      for (let i = 0; i < this.jsonData.walls.length; i++) {
        if (
          this.jsonData.walls[i].x >= width ||
          this.jsonData.walls[i].y >= height
        ) {
          this.messageFromUpload = "A wall is not positioned correctly";
          return false;
        }
      }
      for (let i = 0; i < this.jsonData.agents.length; i++) {
        let newAgent = this.jsonData.agents[i];
        if (agentName.includes(newAgent.id)) {
          this.messageFromUpload = "One of the agent name is not unique";
          return false;
        }
        agentName.push(newAgent.id);
        if (
          newAgent.initialPosition.x >= width ||
          newAgent.initialPosition.y >= height
        ) {
          this.messageFromUpload = "An agent is not positioned correctly";
          return false;
        }
      }
      return true;
    },
  },
  watch: {
    File: function () {
      this.messageFromUpload = "";
    },
  },
};
</script>
