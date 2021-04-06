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
                <div class="form-group">
                  <label>Type:</label>
                  <br />
                  <input
                    type="radio"
                    id="passive"
                    value="Passive"
                    v-model="sensorType"
                  />
                  <label for="passive">Passive</label>
                  <br />
                  <input
                    type="radio"
                    id="active"
                    value="Active"
                    v-model="sensorType"
                  />
                  <label for="active">Active</label>
                  <br />
                </div>
                <div class="form-group">
                  <label>Placement:</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="sensorPlacement"
                    placeholder="e.g 12-31,12-32,11-31"
                  />
                </div>
                <br />
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
export default {
  name: "AddSensor",
  data() {
    return {
      sensorFormTitle: "Add a New Sensor",
      sensorName: "",
      sensorType: "",
      sensorPlacement: "",
      actionButton: "Submit",
    };
  },
  methods: {
    closeAddSensor() {
      this.$emit("closeAddSensorForm");
    },
    submitSensorInformation() {
      let sensor = {
        id: uuidv4(),
        name: this.sensorName,
        type: this.sensorType,
        placement: this.sensorPlacement,
      };
      this.$root.$emit("NewSensorHasBeenSubmitted", sensor);
      this.closeAddSensor();
      this.sensorName = "";
      this.sensorType = "";
      this.sensorPlacement = "";
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
     background-color: rgba(0, 0, 0, .5);
     display: table;
     transition: opacity .3s ease;
   }
.modal-wrapper {
     display: table-cell;
     vertical-align: middle;
   }
</style>

