<template>
  <div>
    <transition name="model">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">{{ sensorFormTitle }}</h4>
                <button type="button" class="close" @click="closeAddSensor">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label>Name:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="sensorName"
                  />
                </div>
                <br />
                <div class="form-group">
                  <label>Positions:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="sensorPosition"
                    placeholder="e.g 12-31,12-32,11-31"
                  />
                </div>
                <br />
                <div class="form-group">
                  <label>Trigger Area:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="sensorTriggerArea"
                    placeholder="e.g 12-31,12-32,11-31"
                  />
                </div>
                <div align="center">
                  <input
                    type="button"
                    class="btn btn-success btn-xs"
                    v-model="actionButton"
                    @click="submitSensorInformation"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import position from "../../models/position";
import sensor from "../../models/sensor";
export default {
  name: "AddSensor",
  data() {
    return {
      sensorFormTitle: "Add a New Sensor",
      sensorName: "",
      sensorPosition: "",
      sensorTriggerArea: "",
      actionButton: "Submit",
    };
  },
  methods: {
    closeAddSensor() {
      this.$emit("closeAddSensorForm");
    },
    getListPositions(stringPositions) {
      let positions = stringPositions.split(",");
      let positionObjects = [];
      for (let i = 0; i < positions.length; i++) {
        let coords = positions[i].split("-");
        positionObjects.push(
          new position(parseInt(coords[0]), parseInt(coords[1]))
        );
      }
      return positionObjects;
    },
    submitSensorInformation() {
      let newSensor = new sensor(
        uuidv4(),
        this.sensorName,
        this.getListPositions(this.sensorPosition),
        this.getListPositions(this.sensorTriggerArea)
      );
      this.$root.$emit("NewSensorHasBeenSubmitted", newSensor);
      this.closeAddSensor();
      this.sensorName = "";
      this.sensorType = "";
      this.sensorPosition = "";
      this.sensorTriggerArea = "";
    },
  },
};
</script>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
</style>

