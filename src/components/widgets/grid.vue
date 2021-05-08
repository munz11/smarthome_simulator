<template>
  <div>
    <v-card :height="y" :width="x" v-resize="onResize">
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Grid",
  props: ["editGrid"],
  data() {
    return {
      x: window.innerWidth*0.83,
      y: window.innerHeight - 57,
    };
  },
  methods: {
    onResize() {
      this.y = window.innerHeight - 57;
      this.x = window.innerWidth*0.83;
    },
  },
};
</script>
<style>
</style>
