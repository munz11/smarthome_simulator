<template>
  <div>
    <v-card class="mx-auto" max-width="600" outlined elevation="2">
      <v-card-title>Edit Entity
        <v-btn text @click="close"> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid">
          <v-text-field
            label="Name"
            v-model="name"
            required
            disabled
          ></v-text-field>
          <b-checkbox v-model="walkable">Walkable</b-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn outlined rounded text :disabled="!isValid" @click="save">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "EditEntity",
  props: ["entity"],
  data() {
    return {
      name: "",
      walkable: "",
      isValid: true,
    };
  },
  methods: {
    save() {
      this.entity.name=this.name;
      this.entity.walkable=this.walkable;  
      this.$store.commit("editEntity", this.entity);
      this.$emit("closeForm");
    },
    close(){
      this.$emit("closeForm");
    },
  },
  beforeMount() {
      this.name=this.entity.name;
      this.walkable=this.entity.walkable;
  }
};
</script>

