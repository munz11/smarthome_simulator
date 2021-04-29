<template>
  <div>
    <v-card v-resize="onResize" :height="y" width="250" class="mx-auto">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"
            >Atomic Actions for Activities
          </v-list-item-title>
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
      <v-divider/>
      <v-list-item>
        <AddInput />
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
import AddInput from "@/components/widgets/addInput.vue";
export default {
  name: "SimulationMenu",
  components: { AddInput },
  data() {
    return {
      items: [
        { title: "Goto", eventName: "GoTo" },
        { title: "Wait", eventName: "Wait" },
        { title: "Interact", eventName: "Interact" },
      ],
      y: window.innerHeight - 30,
    };
  },
  methods: {
    executeEvent(eventName) {
      this.$root.$emit(eventName);
    },
    onResize() {
      this.y = window.innerHeight - 30;
    },
    zoomIn() {
      this.$root.$emit("gridZoomIn");
    },
    zoomOut() {
      this.$root.$emit("gridZoomOut");
    }
  },
};
</script>