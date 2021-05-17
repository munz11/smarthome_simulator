<template>
  <div>
    <v-card v-resize="onResize" :height="y" :width="x">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">Options </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-divider />
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="executeEvent(item.eventName)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-text-field
            label="Filter"
            hint="Case-sensitive"
            v-model="filterText"
          ></v-text-field>
        </v-list-item>
        <v-list-item @click="showUploadDownload = true">
          <v-list-item-content>
            <v-list-item-title>Upload / Download</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <v-overlay :value="showUploadDownload" :light="true" :dark="false">
      <UploadDownload @closeCard="showUploadDownload=false" />
    </v-overlay>
  </div>
</template>

<script>
import UploadDownload from "@/components/widgets/uploadDownload.vue";
export default {
  name: "FloorPlanMenu",
  components: { UploadDownload },
  data() {
    return {
      items: [
        { title: "Clear", eventName: "gridClear" },
        { title: "Add Sensor", eventName: "gridAddSensor" },
        { title: "Add Entity", eventName: "gridAddEntity" },
        { title: "Move Agent", eventName: "gridMoveAgent" },
        { title: "Up", eventName: "gridPanUp" },
        { title: "Down", eventName: "gridPanDown" },
        { title: "Left", eventName: "gridPanLeft" },
        { title: "Right", eventName: "gridPanRight" },
      ],
      y: window.innerHeight - 57,
      x: window.innerWidth * 0.15,
      filterText: this.$store.state.filterText,
      showUploadDownload: false,
    };
  },
  methods: {
    executeEvent(eventName) {
      this.$root.$emit(eventName);
    },
    onResize() {
      this.y = window.innerHeight - 57;
      this.x = window.innerWidth * 0.15;
    },
  },
  watch: {
    filterText: function (newText) {
      this.$store.commit("updateFilterText", newText);
    },
  },
};
</script>
