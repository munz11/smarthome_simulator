<template>
    <b-row>
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse border-right p-0">
            <div class="sidebar-sticky pt-3">
                &nbsp;
            </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4 pt-3">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Sensors</h1>
            </div>

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
        <template v-slot:[`item.actions`]="{ item }">
          <b-button variant="link" @click="editItem(item)"><font-awesome-icon icon="edit" /></b-button>
          <b-button variant="link" @click="deleteItem(item)"><font-awesome-icon icon="trash" /></b-button>
        </template>
      </v-data-table>
    </b-container>
    <v-overlay :value="deleteDialogue" :light="true" :dark="false">
      <DeleteDialogue
        @closeCard="deleteDialogue = false"
        @deleteItem="deleteItemConfirm"
      />
    </v-overlay>
    <v-overlay :value="editSensor" :light="true" :dark="false">
      <EditSensor :sensor="saveItem" @closeForm="editSensor = false" />
    </v-overlay>
        </main>
    </b-row>
</template>

<script>
import DeleteDialogue from "@/components/widgets/deleteDialogue.vue";
import EditSensor from "@/components/widgets/editSensor.vue";
export default {
  name: "Sensors",
  components: { DeleteDialogue, EditSensor },
  data() {
    return {
      search: "",
      deleteDialogue: false,
      saveItem: null,
      editSensor:false,
      sensors: this.$store.getters.listSensors,
      headers: [
        {
          text: "Name",
          sortable: true,
          value: "name",
        },
        {
          text: "Type",
          sortable: true,
          value: "type",
        },
        {
          text: "Walkable",
          sortable: false,
          value: "walkable",
        },
        {
          text: "Trigger Frequency (ns)",
          sortable: true,
          value: "triggerFrequency",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    editItem(item) {
      this.saveItem=item;
      this.editSensor=true;
    },
    deleteItem(item) {
      this.saveItem = item;
      this.deleteDialogue = true;
    },
    deleteItemConfirm() {
      this.$store.commit("removeSensor", this.saveItem);
      this.deleteDialogue = false;
      this.sensors = this.$store.getters.listSensors;
    },
  },
};
</script>
