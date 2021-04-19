<template>
  <div>
    <v-card height="400" width="200" class="mx-auto">
      <v-navigation-drawer permanent>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">Options </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list dense nav>
          <v-list-item v-for="item in items" :key="item.title" @click="executeEvent(item.eventName)">
            <!--<v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>-->
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "Menu",
  data(){
    return{
      items: [
        { title: "Clear", eventName: "gridClear"},
        { title: "Add Sensor", eventName: "gridAddSensor"},
        { title: "Add Agent", eventName: "gridAddAgent"}
      ]
    }
  },
  methods: {
    executeEvent(eventName){
      this.$root.$emit(eventName);
    }
  }
};
</script>
<style></style>
