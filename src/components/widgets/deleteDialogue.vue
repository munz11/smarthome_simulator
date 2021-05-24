<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title
        >Are you sure you want to delete this item?
        <br />
        <v-btn text @click="close"> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-btn outlined rounded text @click="ok">Confirm</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: "DeleteDialogue",
  methods: {
    close() {
      this.$emit("closeCard");
    },
    ok() {
      this.$emit("deleteItem");
    },
  },
};
</script>