<template>
  <div>
    <tbody>
      <tr v-for="i in row" :id="'row' + '-' + i" v-bind:key="i">
        <td
          class="unvisited"
          v-for="j in column"
          :id="i + '-' + j"
          v-bind:key="j"
          @mouseover="putWall(i + '-' + j)"
          v-on:click.exact="hold = !hold"
        ></td>
      </tr>
    </tbody>
  </div>
</template>

<script>


export default {
  name: "Grid",
  data() {
    return {
      height: 22,
      width: 41,
      row: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
      column: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
      occupiedNodes:[],//this needs to be removed or updated when state check is in place 
      hold: false,
      draw: true
    };
  },
  methods: {
    putWall(id) {
      if (this.hold === true && this.draw == true) {
        let l = document.getElementById(id);
        l.setAttribute("class", "wall");
        this.occupiedNodes.push({"id":id,"object":1});//the object 1 is a wall
      }
    },
    clearGrid(){//update when state check is in place
        //need to reset all the data on the grid
        while(this.occupiedNodes.length!==0){
            let id = this.occupiedNodes.pop().id;
            let l = document.getElementById(id);
            l.setAttribute("class","unvisited");
        }
    },
    putSensor(sensor){
        let sensorPositions = sensor.placement.split(",");
        //this sensor object needs to be saved somewhere
        for(let i=0; i < sensorPositions.length; i++){
                let l = document.getElementById(sensorPositions[i]);
                l.setAttribute("class", "sensor");
                this.occupiedNodes.push({"id":sensorPositions[i],"object":sensor.id});//the object at this position is the sensor 
            }
    }
  },
  mounted(){
      //listen to clear grid
      this.$root.$on('clearGid',()=>{
        this.clearGrid();
      });
      this.$root.$on('NewSensorHasBeenSubmitted',(sensor)=>{
        this.putSensor(sensor);
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
@keyframes makesensor {
  from {
    /* transform: scale(0.5); */
    background-color: rgba(253, 253, 253, 0.89);
  }
  to {
    /* transform: scale(1); */
    background-color: rgb(79, 34, 151);
  }
}
.sensor {
  /* display: inline-block; */
  background-color: rgba(255, 255, 255, 0.89);
  animation-name: makesensor;
  animation-duration: 0.5s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
  width: 25px;
  height: 25px;
}
</style>