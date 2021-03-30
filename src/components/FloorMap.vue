<template>
    <div>
     <b-container fluid>
      <b-row>
        <nav class=" col-lg-2 d-md-block bg-light sidebar border-right p-0">
          <div class="pt-3">
            <b-button
              class="ml-3"
              @click="saveFloorPlan">Save Room Plan</b-button>
          </div>
        </nav>
            <tbody>
            <tr v-for="i in row" :id="'row' + '-' + i" v-bind:key="i">
            <td
                class="unvisited"
                v-for="j in column"
                :id="i + '-' + j"
                v-bind:key="j"
                @mouseover="putWall(i + '-' + j)"
                v-on:click.exact="hold = !hold"
                v-bind:nodes[i][j]="id"
                v-on:click.right="addSensor(i+'-'+j)"
                ></td>
            </tr>
            </tbody>
      </b-row>
    </b-container>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: "FloorMap",
    data(){
        return {
            height: 22,
            width: 40,
            row: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
            column: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39],
            nodes: new Array(22).fill(null).map(() => new Array(40).fill(null)),
            collsionNodes:[],//each node will be stored like (x,y)
            hold: false,
            draw: true
        }
    },
    methods: {
        putWall(id){
            if (this.hold === true && this.draw == true) {
                let l = document.getElementById(id);
                l.setAttribute("class", "wall");
                this.collsionNodes.push(id)
            }
        },
        saveFloorPlan(){
            //send information to the backend 
            console.log(this.collsionNodes);
            axios.post(this.$smartHomeBackend.getUrlRoomConfigFloorPlan(),this.collsionNodes)
                 .then((response) => {
                        console.log("success");
                        console.log(response);//should make a popup..
                        }, (error) => {
                        console.log(error);
                        });       
        },
        addSensor(id){
            console.log("Can add a sensor at tile:");
            console.log(id);
        }



    }


}

</script>
<style>
.unvisited {
  /* display: inline-block; */
  background: rgba(255, 255, 255, 0.89);
  width: 25px;
  height: 25px;
  outline: 1px #d5d6d6;
  outline-style: solid;
  /* margin-right: 1px;
  margin-bottom: 1px;
  margin-left: 1px;
  margin-top: 1px; */
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
  /* margin-right: 1px;
  margin-bottom: 1px; */
  /* outline:rgba(30, 34, 33, 0.884) 1px; */
  /* outline: 1px rgba(0, 0, 0, 0.76); */
  /* outline-style: solid; */
}

</style>