<template>
  <div>
    <v-card v-resize="onResize" class="m-3">
      <v-list dense>
        <AddInput />
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
          class="float-left"
          @click="executeEvent(item.eventName)"
        >
          <v-list-item-content>
            <v-list-item-title><font-awesome-icon :icon=item.icon /></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      
      <v-list-item @click="{}" v-b-modal.modal-upload style="clear: both">
          <v-list-item-content>
            <v-list-item-title>
              <font-awesome-icon icon="upload" /> Upload / Download
            </v-list-item-title>
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

    <b-modal id="modal-upload" title="Upload or download the simulation">
      <UploadDownloadActivities @closeCard="showUploadDownload = false" />
    </b-modal>
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
        { eventName: "gridPanUp", icon: "angle-up" },
        { eventName: "gridPanDown", icon: "angle-down" },
        { eventName: "gridPanLeft", icon: "angle-left" },
        { eventName: "gridPanRight", icon: "angle-right" },
      ],
      y: window.innerHeight - 57,
      x: window.innerWidth * 0.15,
      showUploadDownload: false,
      tooltip: "x-y",
      filterText: this.$store.state.filterText,
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
  watch: {
    filterText: function (newText) {
      this.$store.commit("updateFilterText", newText);
    },
  },
};
</script>
