<template>
  <div>
    <tbody>
      <tr v-for="i in row" :id="'row' + '-' + i" v-bind:key="i">
        <td
          class="unvisited"
          v-for="j in col"
          :id="i + '-' + j"
          v-bind:key="j"
          v-on:click.exact="addObject(i + '-' + j)"
          v-tooltip="i+'-'+j"
        ></td>
      </tr>
    </tbody>
  </div>
</template>

<script>


export default {
  name: "Grid",
  props: ["widthNodes", "heightNodes","objectBeingAdded"],
  data(){
    return {
      row: this.widthNodes,
      col: this.heightNodes,
      occupiedNodes: []
    }
  },
  methods: {
    addObject(id){
      if (this.objectBeingAdded!="activities"){
        let l = document.getElementById(id);
        l.setAttribute("class", this.objectBeingAdded); 
        this.occupiedNodes.push(id);
        //need to save in store
      }
    },
    clear(){
      for(let i=0;i<this.occupiedNodes.length;i++){
        let l = document.getElementById(this.occupiedNodes[i]);
        l.setAttribute("class","unvisited");
        //need to save in store
      }
      this.occupiedNodes=[];
    }
  },
  mounted(){
    this.$root.$on("gridClear", () => {
      this.clear();
    });
  }
};
</script>
<style>
.unvisited {
  /* display: inline-block; */
  background: rgba(255, 255, 255, 0.89);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
}

@keyframes makewall {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(32, 34, 32);
  }
}
.wall {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makewall;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
@keyframes makeSensorPosition {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(79, 34, 151);
  }
}
.sensorPosition {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makeSensorPosition;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
@keyframes makeSensorTrigger {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(129, 21, 84);
  }
}
.sensorTrigger {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makeSensorTrigger;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
</style>
