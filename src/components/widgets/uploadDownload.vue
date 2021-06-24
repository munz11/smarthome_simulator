<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped >
      <v-card-title
        >Upload or Download the FloorPlan
        <br />
        <v-btn text @click="close"> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-file-input
          accept=".json"
          label="Select File"
          outlined
          v-model="File"
        >
        </v-file-input>
        <v-btn outlined rounded text @click="upload"> Upload JSON</v-btn>
        <v-btn outlined rounded text @click="download"> Download</v-btn>
        <br />
        {{ messageFromUpload }}
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import exportFromJSON from "export-from-json";
import * as validator from "is-my-json-valid";
import floorPlanDetails from "@/models/floorPlanDetails";
import position from "@/models/position";
import sensor from "@/models/sensor";
import entity from "@/models/entity";
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
        "updateAgent",
        new position(
          this.jsonData.agent.position.x,
          this.jsonData.agent.position.y
        )
      );
      this.$store.commit(
        "updateFloorPlanDetails",
        new floorPlanDetails(
          this.jsonData.width,
          this.jsonData.height,
          this.jsonData.tileSideLength
        )
      );
      this.$store.commit(
        "updateAgentSpeed",
        this.jsonData.agent.speed.toString()
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
    },
    download() {
      this.getPassiveActiveSensors();
      let data = {
        tileSideLength: this.$store.state.floorPlanDetails.tileSideLenght,
        width: this.$store.state.floorPlanDetails.width,
        height: this.$store.state.floorPlanDetails.height,
        agent: {
          position: this.$store.state.agent,
          speed: parseInt(this.$store.state.agentSpeed),
        },
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
          agent: {
            required: true,
            type: "object",
            properties: {
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
              speed: {
                required: true,
                type: "number",
              },
            },
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
        },
      });

      try {
        this.jsonData = JSON.parse(this.data);
        
        let isValid = validate(this.jsonData);
        if (!isValid) {
          this.messageFromUpload = "Errors in the json format, could not be validated.";
        } else {
          if (this.checkErrors()) {
            this.updateStore();
            this.messageFromUpload =
              "Success.";
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
      if (
        this.jsonData.agent.position.x >= width ||
        this.jsonData.agent.position.y >= height
      ) {
        this.messageFromUpload = "The agent is not positioned correctly";
        return false;
      }
      const sensorName = [];
      const entityName = [];
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
            this.messageFromUpload = "A sensor area is not positioned correctly";
            return false;
          }
        }

        for (let j = 0; j <newSensor.interactArea.length; j++) {
          if (
            newSensor.interactArea[j].x >= width ||
            newSensor.interactArea[j].y >= height
          ) {
            this.messageFromUpload = "A sensor area is not positioned correctly";
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
        for (let j = 0; j <newSensor.physicalArea.length; j++) {
          if (
            newSensor.physicalArea[j].x >= width ||
            newSensor.physicalArea[j].y >= height
          ) {
            this.messageFromUpload = "A sensor area is not positioned correctly";
            return false;
          }
        }
        for (let j = 0; j < newSensor.interactArea.length; j++) {
          if (
            newSensor.interactArea[j].x >= width ||
            newSensor.interactArea[j].y >= height
          ) {
            this.messageFromUpload = "A sensor area is not positioned correctly";
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
            this.messageFromUpload = "An entity area is not positioned correctly";
            return false;
          }
        }
        for (let j = 0; j < newEntity.interactArea.length; j++) {
          if (
            newEntity.interactArea[j].x >= width ||
            newEntity.interactArea[j].y >= height
          ) {
            this.messageFromUpload = "An entity area is not positioned correctly";
            return false;
          }
        }
      }
      for(let i=0;i<this.jsonData.walls.length;i++){
        if (
            this.jsonData.walls[i].x >= width ||
            this.jsonData.walls[i].y >= height
          ) {
            this.messageFromUpload = "A wall is not positioned correctly";
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
