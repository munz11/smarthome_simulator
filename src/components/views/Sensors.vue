<template>
  <div class="Sensors">
    <b-container fluid>
      <v-data-table
        :headers="headers"
        :items="sensors"
        item-key="id"
        class="elevation-1"
        :search="search"
        ><template v-slot:top>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
          ></v-text-field>
        </template>
      </v-data-table>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "Sensors",
  data() {
    return {
      search: "",
      sensors: this.$store.state.sensors,
      headers:[{
          text: "Name",
          sortable: true,
          value: "name",
        },
        {
          text: "Type",
          sortable: true,
          value:"type",
        },
        {
          text:"Walkable",
          sortable:false,
          value:"walkable"
        },
        {
          text: "Trigger Frequency (ns)",
          sortable: true,
          value: "triggerFrequency",
        }]
    };
  }
};
</script>
