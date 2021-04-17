<template>
  <div>
    <transition name="model">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">Current Sensors</h4>
                <button type="button" class="close" @click="closeSensorList">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <ol class="list-group">
                  <li
                    class="list-group-item"
                    v-for="sensor of SensorLists"
                    :key="sensor.id"
                  >
                    {{ sensor.name }}
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SensorList",
  data() {
    return {
      SensorLists: this.$store.state.sensors,
    };
  },
  methods: {
    closeSensorList() {
      this.$emit("closeSensorList");
    },
  },
};
</script>
