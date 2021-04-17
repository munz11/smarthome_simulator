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
          v-on:dblclick="handleKeyDown"
        ></td>
      </tr>
    </tbody>
  </div>
</template>

<script>

import position from '@/models/position';
import wall from '@/models/wall';

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
      draw: true,
      drawSensor: false,
      storeDrawSensorIDs: []
    };
  },
  methods: {
    putWall(id) {

      if (this.hold === true && this.draw == true && !this.drawSensor) {
        let l = document.getElementById(id);
        l.setAttribute("class", "wall");
        this.occupiedNodes.push({"id":id});//the object 1 is a wall
        let coords = id.split("-");
        this.$store.commit("addWall",new wall(new position(parseInt(coords[0]),parseInt(coords[1]))));
      }else if( this.hold === true && this.draw == true && this.drawSensor){
       this.drawSensorPositions(id);
      }
    },
    drawSensorPositions(id){
      this.storeDrawSensorIDs.push(id);
      let l = document.getElementById(id);
      l.setAttribute("class", "sensor");
    },
    clearGrid(){//update when state check is in place
        //need to reset all the data on the grid
        while(this.occupiedNodes.length!==0){
            let id = this.occupiedNodes.pop().id;
            let l = document.getElementById(id);
            l.setAttribute("class","unvisited");
        }
        this.$store.commit("clearAllSensorAndWallInfo");
    },
    putSensor(sensor){
        //this sensor object needs to be saved somewhere
        for(let i=0; i < sensor.positions.length; i++){
                let ID = sensor.positions[i].x.toString()+"-"+sensor.positions[i].y.toString();
                let l = document.getElementById(ID);
                l.setAttribute("class", "sensor");
                this.occupiedNodes.push({"id":ID});//the object at this position is the sensor 
            }
        this.$store.commit('addSensor',sensor);
        
    },
    updateGridToStore(){
      let walls = this.$store.state.walls;
      for(let i=0; i<walls.length; i++){
        let position = walls[i].position;
        let id = position.x.toString() + "-" + position.y.toString();
        let l = document.getElementById(id);
        l.setAttribute("class", "wall");
        this.occupiedNodes.push({"id":id});
      }
      let sensors = this.$store.state.sensors;
      for(let i=0; i<sensors.length;i++){
        let positions = sensors[i].positions;
        for(let j=0;j<positions.length;j++){
          let id = positions[j].x.toString()+"-"+positions[j].y.toString();
          let l = document.getElementById(id);
          l.setAttribute("class","sensor");
          this.occupiedNodes.push({"id":id});
        }
      }
    },
    handleKeyDown(){
      if(this.hold === true && this.draw == true && this.drawSensor){
      this.$root.$emit("SensorPositionInfo",this.storeDrawSensorIDs);
      console.log(this.storeDrawSensorIDs);
      this.drawSensor = false;
      for(let j=0; j<this.storeDrawSensorIDs.length;j++){
        let id = this.storeDrawSensorIDs[j]
        let l = document.getElementById(id);
        l.setAttribute("class","unvisited");
      }
      this.storeDrawSensorIDs=[];
      this.$emit("showAddSensorForm");
      }


    }
  },
  mounted(){
      this.updateGridToStore();
      //listen to clear grid
      this.$root.$on('clearGid',()=>{
        this.clearGrid();
      });
      this.$root.$on('NewSensorHasBeenSubmitted',(sensor)=>{
        this.putSensor(sensor);
      });
      this.$root.$on('DrawSensorOnGrid',()=>{
        this.drawSensor = true;
      })
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