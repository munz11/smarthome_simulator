<template>
  <div>
    <v-card width="250" class="mx-auto">
      <v-navigation-drawer permanent>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title"
              >Atomic Actions for Activities
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list dense nav>
          <v-list-item
            v-for="item in items"
            :key="item.title"
            @click="executeEvent(item.eventName)"
          >
            <!--<v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>-->
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-divider/>
      <v-list-item>
          <AddInput/>
      </v-list-item>
    </v-card>
  </div>
</template>

<script>
import AddInput from "@/components/widgets/addInput.vue";
export default {
  name: "SimulationMenu",
  components: {AddInput},
  data() {
    return {
      items: [
        { title: "Goto", eventName: "GoTo" },
        { title: "Wait", eventName: "Wait" },
        { title: "Interact", eventName: "Interact" },
      ]
    };
  },
  methods: {
    executeEvent(eventName) {
      this.$root.$emit(eventName);
    },
    submitSimulationInfo() {
      console.log(this.activities);
    }
  }
};
</script>