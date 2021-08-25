<template>
  <div>
    <v-card class="mx-auto" max-width="600" outlined elevation="2">
      <v-card-title
        >Edit Agent
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
          <v-text-field
            label="Speed"
            v-model="speed"
            required
            :rules="speedRules"
          ></v-text-field>
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
  name: "EditAgent",
  props: ["agent"],
  data() {
    return {
      name: "",
      speed: "",
      isValid: true,
      speedRules: [
        (v) => !!v || "Required",
        (v) =>
          /^(\d+(\.\d{0,2})?|\.?\d{1,2})$/.test(v) ||
          "Enter a number with max 2 decimal places",
        (v) => v != 0 || "Enter a positive number",
      ],
    };
  },
  methods: {
    save() {
      this.agent.id = this.name;
      this.agent.speed = this.speed;
      this.$store.commit("editAgent", this.agent);
      this.$emit("closeForm");
    },
    close() {
      this.$emit("closeForm");
    },
  },
  beforeMount() {
    this.name = this.agent.id;
    this.speed = this.agent.speed;
  },
};
</script>

