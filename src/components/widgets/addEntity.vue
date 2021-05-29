<template>
  <div>
    <v-card class="mx-auto" max-width="600" outlined elevation="2" shaped>
      <v-card-title>Please enter further details about the entity
        <v-btn text @click="close"> &times; </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form v-model="isValid">
          <v-text-field
            label="Name"
            v-model="name"
            required
            :rules="nameRules"
          ></v-text-field>
          <v-checkbox v-model="walkable" label="walkable"></v-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn outlined rounded text :disabled="!isValid" @click="submit">
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import position from "../../models/position";
import entity from "../../models/entity";
export default {
  name: "AddEntity",
  props: ["physicalArea", "interactArea"],
  data() {
    return {
      name: "",
      walkable: false,
      isValid: true,
      nameRules: [(v) => !!v || 'Required', (v)=> !this.$store.getters.entityNames.includes(v)||"Enter a unique name"],
    };
  },
  methods: {
    submit() {
      let entityObject = new entity(
        this.name,
        this.getListPositions(this.interactArea),
        this.getListPositions(this.physicalArea),
        this.walkable
      );
      this.$store.commit("addEntity", entityObject);
      this.$emit("closeEntityForm");
    },
    close(){
      this.$emit("closeForm");
    },
    getListPositions(positions) {
      let positionObjects = [];
      positions.forEach((id) => {
        let coords = id.split("-");
        positionObjects.push(
          new position(parseInt(coords[0]), parseInt(coords[1]))
        );
      });
      return positionObjects;
    },
  }
};
</script>

