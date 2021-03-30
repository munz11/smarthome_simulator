<template>
    <div>
     <b-container fluid>
      <b-row>
        <nav class=" col-lg-2 d-md-block bg-light sidebar border-right p-0">
          <div class="pt-3">
            <b-button
              class="ml-3"
              @click="addSensor=true">Add Sensor</b-button>
          </div>
          <div class="pt-3">
            <b-button
              class="ml-3"
              @click="resetRoomPlan">Reset Room Plan</b-button>
          </div>
          <div class="pt-3">
            <b-button
              class="ml-3"
              @click="saveFloorPlan">Save Room Plan</b-button>
          </div>
          <div v-if="displaySensors"  class="pt-3">
              Currently in-place sensors:
              <!--<ul>
                <li v-repeat="sensor in inUseSensors">
                {{sensor.name}}
                </li>
            </ul>--->
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
                ></td>
            </tr>
            </tbody>
      </b-row>
    </b-container>
    <div v-if="addSensor">
        <transition name="model">
     <div class="modal-mask">
      <div class="modal-wrapper">
       <div class="modal-dialog">
        <div class="modal-content">
         <div class="modal-header">
            <h4 class="modal-title">{{  sensorFormTitle }}</h4>
            <button type="button" class="close" @click="addSensor=false"><span aria-hidden="true">&times;</span></button>
         </div>
         <div class="modal-body">
          <div class="form-group">
           <label>Name:</label>
           <input type="text" class="form-control" v-model="sensorName"/>
          </div>
          <div class="form-group">
            <label>Type:</label>
            <br>
            <input type="radio" id="passive" value="Passive" v-model="sensorType">
            <label for="passive">Passive</label>
            <br>
            <input type="radio" id="active" value="Active" v-model="sensorType">
            <label for="active">Active</label>
            <br>
          </div>
          <div class="form-group">
           <label>Default Value:</label>
            <br>
            <input type="radio" id="on" value="On" v-model="sensorDefault">
            <label for="on">On</label>
            <br>
            <input type="radio" id="off" value="Off" v-model="sensorDefault">
            <label for="off">Off</label>
            <br>
          </div>
          <div class="form-group">
           <label>Placement:</label>
           <input type="text" class="form-control" v-model="sensorPlacement" placeholder="e.g 12-31,12-32,11-31">
          </div>
          <br/>
          <div align="center">
           <input type="button" class="btn btn-success btn-xs" v-model="actionButton" @click="submitData" />
          </div>
         </div>
        </div>
       </div>
      </div>
     </div>
    </transition>
    </div>
    </div>
</template>

<script>

import axios from 'axios';
import {v4 as uuidv4} from 'uuid';

export default {
    name: "FloorMap",
    data(){
        return {
            height: 22,
            width: 41,
            row: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],
            column: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40],
            nodes: new Array(22).fill(null).map(() => new Array(41).fill(null)),
            collsionNodes:[],//each node will be stored like (x,y)
            hold: false,
            draw: true,
            addSensor: false,
            sensorFormTitle: "Add Sensor Details",
            actionButton: "Submit",
            sensorName: "",
            sensorType: "",
            sensorDefault:"",
            sensorPlacement: "",
            inUseSensors:[], //saves the sensor objects
            displaySensors: false
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
            //this.draw = false;
            console.log(this.collsionNodes);
            axios.post(this.$smartHomeBackend.getUrlRoomConfigFloorPlan(),this.collsionNodes)
                 .then((response) => {
                        console.log("success");
                        console.log(response);//should make a popup..
                        }, (error) => {
                        console.log(error);
                        });  
            //needs to send the inusesensor list as well     
        },
        resetRoomPlan(){
            while(this.collsionNodes.length!==0){
                let id = this.collsionNodes.pop();
                let l = document.getElementById(id);
                l.setAttribute("class", "unvisited");
            }
            this.draw=true;
        },
        submitData(){
            //add sensor to the inUseSensor list
            let sensorPositions = this.sensorPlacement.split(",")
            this.inUseSensors.push({
                "id": uuidv4(),
                "name": this.sensorName,
                "type": this.sensorType,
                "default": this.sensorDefault,
                "placement": sensorPositions
            });
            console.log("Sensor added:")
            console.log(this.inUseSensors);
            //display sensor on the grid
            for(let i=0; i < sensorPositions.length; i++){
                let l = document.getElementById(sensorPositions[i]);
                l.setAttribute("class", "sensor");
                this.collsionNodes.push(sensorPositions[i]);
            }
            this.addSensor=false;
            this.sensorName="";
            this.sensorType="";
            this.sensorDefault="";
            this.sensorPlacement="";
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
.modal-mask {
     position: fixed;
     z-index: 9998;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     background-color: rgba(0, 0, 0, .5);
     display: table;
     transition: opacity .3s ease;
   }
.modal-wrapper {
     display: table-cell;
     vertical-align: middle;
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
  /* margin-right: 1px;
  margin-bottom: 1px; */
  /* outline:rgba(30, 34, 33, 0.884) 1px; */
  /* outline: 1px rgba(0, 0, 0, 0.76); */
  /* outline-style: solid; */
}

</style>