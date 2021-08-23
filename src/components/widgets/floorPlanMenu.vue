<template>
  <div>
    <v-card class="m-3">
      <v-list dense>
        <v-list-item>
          <v-text-field
            label="Filter"
            hint="Case-sensitive"
            v-model="filterText"
          ></v-text-field>
        </v-list-item>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="executeEvent(item.eventName)"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="showUploadDownload = true">
          <v-list-item-content>
            <v-list-item-title>Upload / Download</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle class="text-wrap">{{
            tooltip
          }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-overlay :value="showUploadDownload" :light="true" :dark="false">
      <UploadDownload @closeCard="closeCardRefresh" />
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
        { title: "Add Sensor", eventName: "gridAddSensor" },
        { title: "Add Entity", eventName: "gridAddEntity" },
        { title: "Add Agent", eventName: "gridAddAgent" },
        { title: "Clear", eventName: "gridClear" },
        { title: "Up", eventName: "gridPanUp" },
        { title: "Down", eventName: "gridPanDown" },
        { title: "Left", eventName: "gridPanLeft" },
        { title: "Right", eventName: "gridPanRight" },
      ],
      y: window.innerHeight - 57,
      x: window.innerWidth * 0.15,
      filterText: this.$store.state.filterText,
      showUploadDownload: false,
      tooltip: "x-y",
    };
  },
  methods: {
    executeEvent(eventName) {
      this.$root.$emit(eventName);
    },
    closeCardRefresh() {
      this.showUploadDownload = false;
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
  mounted() {
    this.$root.$on("tooltip", (data) => {
      this.tooltip = data;
    });
  },
};
</script>
