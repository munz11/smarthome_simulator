<template>
  <div class="Entities">
    <b-container fluid>
      <v-data-table
        :headers="headers"
        :items="entities"
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
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </b-container>
        <v-overlay :value="deleteDialogue" :light="true" :dark="false">
      <DeleteDialogue
        @closeCard="deleteDialogue = false"
        @deleteItem="deleteItemConfirm"
      />
    </v-overlay>
        <v-overlay :value="editEntity" :light="true" :dark="false">
      <EditEntity
      :entity="saveItem"
      @closeForm="editEntity=false"
      />
    </v-overlay>
  </div>
</template>

<script>
import DeleteDialogue from "@/components/widgets/deleteDialogue.vue";
import EditEntity from "@/components/widgets/editEntity.vue";
export default {
  name: "Entities",
  components: { DeleteDialogue, EditEntity},
  data() {
    return {
      search: "",
      deleteDialogue:false,
      saveItem:null,
      editEntity:false,
      entities: this.$store.state.entities,
      headers: [
        {
          text: "Name",
          sortable: true,
          value: "name",
        },
        {
          text: "Walkable",
          sortable: false,
          value: "walkable",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    editItem(item) {
      this.saveItem=item;
      this.editEntity=true;
    },
    deleteItem(item) {
      this.saveItem = item;
      this.deleteDialogue=true;
    },
    deleteItemConfirm(){
      this.$store.commit("removeEntity",this.saveItem);
      this.deleteDialogue=false;
      this.entities=this.$store.state.entities;
    }
  },
};
</script>
