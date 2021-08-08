<template>
  <div>
    <v-card class="mx-auto" max-width="600" outlined elevation="2" shaped>
      <v-card-title
        >Please enter further details about the Agent
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
          <v-text-field
            label="Speed"
            v-model="speed"
            required
            :rules="speedRules"
          ></v-text-field>
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
import agent from "../../models/agent";
export default {
  name: "AddAgent",
  props: ["physicalArea"],
  data() {
    return {
      name: "",
      speed: "",
      isValid: true,
      nameRules: [
        (v) => !!v || "Required",
        (v) =>
          !this.$store.getters.agentNames.includes(v) || "Enter a unique name",
      ],
      speedRules: [
          (v) => !!v || "Required",
          (v) =>
          /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/.test(v) ||
          "Enter a number with max 2 decimal places",
          (v) => v != 0 || "Enter a positive number"
      ]
    };
  },
  methods: {
    submit() {
      let agentObject = new agent(
        this.name,
        this.getStartPosition(this.physicalArea),
        Number(this.speed)
      );
      this.$store.commit("addAgent", agentObject);
      this.$emit("closeAgentForm");
    },
    close() {
      this.$emit("closeForm");
    },
    getStartPosition(positions) {
      let positionObjects = [];
      positions.forEach((id) => {
        let coords = id.split("-");
        positionObjects.push(
          new position(parseInt(coords[0]), parseInt(coords[1]))
        );
      });
      return positionObjects[0];
    },
  },
};
</script>

