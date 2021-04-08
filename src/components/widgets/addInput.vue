<template>
  <div>
    <transition name="model">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">
                    Add the activities
                </h4>
                <button type="button" class="close" @click="closeAddInput">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div v-if="!submitted">
                  <b-container fluid>
                    <b-row>
                        <b-form-textarea
                          id="activities"
                          placeholder="e.g: goto(12,32);interact(light1);wait(1000)"
                          rows="2"
                          max-rows="30"
                          v-model="activties"
                        />
                    </b-row>
                  </b-container>
                  <br />
                  <div align="center">
                    <input
                      type="button"
                      class="btn btn-success btn-xs"
                      @click="submitInputInformation"
                      v-model="actionButton"
                    />
                  </div>
                </div>
                <div v-if="submitted">
                  <p class="modal-body">
                      {{responseFromSubmission}}
                  </p>
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
import axios from "axios";

export default {
  name: "AddInput",
  data() {
    return {
      activties: "",
      actionButton: "Submit",
      submitted: false,
      responseFromSubmission:""
    };
  },
  methods: {
    closeAddInput() {
      this.$emit("closeAddInput");
    },
    submitInputInformation() {
      axios.post(this.$smartHomeBackend.getUrlInput(), this.activties).then(
        (response) => {
            console.log(response) //should make a popup..
            this.responseFromSubmission="Request sent to the server";
        },
        (error) => {
          this.responseFromSubmission=error;
        }
      );
      this.submitted=true;
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