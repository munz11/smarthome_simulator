<template>
  <div class="Sensors">
    <b-container fluid>
      <p>At Sensors</p>
      <div class="pt-3">
        <b-link class="ml-3" :to="{ name: 'AddSensor' }">Add Sensor</b-link>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Sensors",
};
</script>
