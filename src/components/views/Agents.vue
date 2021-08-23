<template>
    <b-row>
        <nav class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse border-right p-0">
            <div class="sidebar-sticky pt-3">
                &nbsp;
            </div>
        </nav>

        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4 pt-3">
            <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 class="h2">Agents</h1>
            </div>
            
    <b-container fluid>
      <v-data-table
        :headers="headers"
        :items="agents"
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
        <v-overlay :value="editAgent" :light="true" :dark="false">
      <EditAgent
      :agent="saveItem"
      @closeForm="editAgent=false"
      />
    </v-overlay>
        </main>
    </b-row>
</template>

<script>
import DeleteDialogue from "@/components/widgets/deleteDialogue.vue";
import EditAgent from "@/components/widgets/editAgent.vue";
export default {
  name: "Agents",
  components: { DeleteDialogue, EditAgent},
  data() {
    return {
      search: "",
      deleteDialogue:false,
      saveItem:null,
      editAgent:false,
      agents: this.$store.state.agents,
      headers: [
        {
          text: "Name",
          sortable: true,
          value: "id",
        },
        {
          text: "Speed",
          sortable: false,
          value: "speed",
        },
        { text: "Actions", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    editItem(item) {
      this.saveItem=item;
      this.editAgent=true;
    },
    deleteItem(item) {
      this.saveItem = item;
      this.deleteDialogue=true;
    },
    deleteItemConfirm(){
      this.$store.commit("removeAgent",this.saveItem);
      this.deleteDialogue=false;
      this.agents=this.$store.state.agents;
    }
  },
};
</script>
