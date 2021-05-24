<template>
  <div>
    <v-card class="mx-auto" max-width="500" outlined elevation="2" shaped>
      <v-card-title
        >Choose an option
        <br />
        <v-btn text @click="close"> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-btn outlined rounded text @click="interact">
          Add Interact</v-btn
        >
        <br/>
        <v-btn outlined rounded text @click="remove">
          Remove Phyiscal</v-btn
        >
      </v-card-text>
    </v-card>
  </div>
</template>
<script>

export default {
  name: "DbOnPhysical",
  methods: {
    close() {
      this.$emit("closeCard");
    },
    interact(){
        this.$emit("addInteract");
    },
    remove(){
        this.$emit("removePhysical");
    }
    
  },
};
</script>