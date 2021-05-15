<template>
  <div>
    <v-card v-resize="onResize" :height="y" :width="x">
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
        <v-list-item>
          <v-text-field
            label="Filter"
            hint="Case-sensitive"
            v-model="filterText"
          ></v-text-field>
        </v-list-item>
      </v-list>
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
        { title: "Add Entity", eventName: "gridAddEntity" },
        { title: "Move Agent", eventName: "gridMoveAgent" },
        { title: "Up", eventName: "gridPanUp" },
        { title: "Down", eventName: "gridPanDown" },
        { title: "Left", eventName: "gridPanLeft" },
        { title: "Right", eventName: "gridPanRight" },
      ],
      y: window.innerHeight - 57,
      x: window.innerWidth * 0.15,
      filterText:this.$store.state.filterText,
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
    filterText: function(newText) {
      this.$store.commit("updateFilterText",newText);
    }
  } 
};
</script>
