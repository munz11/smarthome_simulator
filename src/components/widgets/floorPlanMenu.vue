<template>
  <div>
    <v-card v-resize="onResize" :height="y" width="200" class="mx-auto">
      <v-navigation-drawer absolute permanent left>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Options </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list dense nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="executeEvent(item.eventName)"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="zoomIn">
            <v-list-item-content>
              <v-list-item-title> Zoom In </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="zoomOut">
            <v-list-item-content>
              <v-list-item-title> Zoom Out </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "FloorPlanMenu",
  data() {
    return {
      items: [
        { title: "Clear", eventName: "gridClear" },
        { title: "Add Sensor", eventName: "gridAddSensor" },
        { title: "Move Agent", eventName: "gridAddAgent" },
      ],
      y: window.innerHeight - 57,
    };
  },
  methods: {
    executeEvent(eventName) {
      this.$root.$emit(eventName);
    },
    onResize() {
      this.y = window.innerHeight - 57;
    },
    zoomIn() {
      this.$root.$emit("gridZoomIn");
    },
    zoomOut() {
      this.$root.$emit("gridZoomOut");
    },
  },
};
</script>
