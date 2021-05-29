<template>
  <div>
    <v-card v-resize="onResize" :height="y" :width="x">
      <v-list dense>
        <v-list-item>
          <AddInput />
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Options </v-list-item-title>
            <v-list-item-subtitle class="subtitle">{{
              tooltip
            }}</v-list-item-subtitle>
          </v-list-item-content>
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
      </v-list>
      <v-list-item @click="showUploadDownload = true">
        <v-list-item-content>
          <v-list-item-title>Upload / Download</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
    <v-overlay :value="showUploadDownload" :light="true" :dark="false">
      <UploadDownloadActivities @closeCard="showUploadDownload = false" />
    </v-overlay>
  </div>
</template>

<script>
import AddInput from "@/components/widgets/addInput.vue";
import UploadDownloadActivities from "@/components/widgets/uploadDownloadActivities.vue";
export default {
  name: "SimulationMenu",
  components: { AddInput, UploadDownloadActivities },
  data() {
    return {
      items: [
        { title: "Up", eventName: "gridPanUp" },
        { title: "Down", eventName: "gridPanDown" },
        { title: "Left", eventName: "gridPanLeft" },
        { title: "Right", eventName: "gridPanRight" },
      ],
      y: window.innerHeight - 57,
      x: window.innerWidth * 0.15,
      showUploadDownload: false,
      tooltip: "x-y",
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
  mounted() {
    this.$root.$on("tooltip", (data) => {
      this.tooltip = data;
    });
  },
};
</script>