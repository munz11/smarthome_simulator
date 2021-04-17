<template>
  <div>
    <nav class="col-lg-2 d-md-block bg-light border-right p-0">
      <div class="pt-3">
        <b-button class="ml-3" @click="sendMessageToClearGrid">Clear</b-button>
      </div>
      <div class="pt-3">
        <b-button class="ml-3" @click="sendMessageToShowSensorForm"
          >Add Sensor</b-button
        >
      </div>
      <div class="pt-3">
        <b-button class="ml-3" @click="sendMessageToShowSensorList"
          >Current Sensors</b-button
        >
      </div>
      <div class="pt-3">
        <b-button class="ml-3" @click="sendMessageToShowInputForm"
          >Run Simulation</b-button
        >
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: "Menu",
  methods: {
    sendMessageToClearGrid() {
      this.$root.$emit("clearGid");
    },
    sendMessageToShowSensorForm() {
      this.$emit("showAddSensorForm");
    },
    sendMessageToShowInputForm() {
      this.$emit("showInputForm");
    },
    sendMessageToShowSensorList() {
      this.$emit("showSensorList");
    },
  },
};
</script>
<style></style>
