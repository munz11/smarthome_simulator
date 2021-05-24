<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title
        >Choose an option
        <br />
        <v-btn text @click="close"> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-btn outlined rounded text @click="both"> Remove Both</v-btn>
        <br />
        <v-btn outlined rounded text @click="interact"> Remove Interact</v-btn>
        <br />
        <v-btn outlined rounded text @click="physical"> Remove Phyiscal</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "DbOnBoth",
  methods: {
    close() {
      this.$emit("closeCard");
    },
    interact() {
      this.$emit("removeOnlyInteract");
    },
    physical() {
      this.$emit("removeOnlyPhysical");
    },
    both() {
      this.$emit("removeBoth");
    },
  },
};
</script>