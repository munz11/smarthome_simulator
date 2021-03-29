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
            v-bind:nodes[i][j]="id"
            >  </td>
            </tr>
            </tbody>
        </div>
</template>

<script>

export default {
    name: "FloorMap",
    data(){
        return {
            row: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
            column: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37],
            nodes: new Array(22).fill(null).map(() => new Array(38).fill(null)),
            si: 11,
            sj: 8,
            di: 11,
            dj: 29,
            hold: false,
            draw: true
        }
    },
    methods:{
        putWall(id) {
            if (this.hold === true && this.draw == true) {
                let l = document.getElementById(id);
                if(l.className != "sd"){
                    l.setAttribute("class", "wall");
                }
            }
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