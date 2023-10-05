<template>
    <div class="button-layout center-horizontal">
        <button class="register-button center-horizontal" @click="onClickLeave">
            <p style="margin-top: 5px">Spiel verlassen</p>
        </button>
    </div>

<div class="center-horizontal">
    <PlayerView
        v-for="(dat) in names"
        :name="dat.name"
        :img="dat.pb"

    />
</div>

    <div class="button-layout center-horizontal" v-if="isHost">
        <div>
          <button class="register-button center-horizontal" @click="onClickStart">
            <p style="margin-top: 5px">Spiel starten</p>
          </button>
          <div class="center-horizontal center">
              <h2 class="white">Herzenanzahl:</h2>
              <input ref="input" placeholder="herzenanzahl" value="3" style="width: 20px">
          </div>
        </div>
    </div>
    <div v-else class="center-horizontal">
        <h1>Warte auf Spieler...</h1>
    </div>

</template>


<script>
import EventBus from "./code/EventBusEvent";
import PlayerView from "@/components/views/PlayerView.vue";
import {nextTick} from "vue";

export default {
    //npm run dev | npm run build
    name: "PlayerPage",
    components: {PlayerView},
    data() {
        return {
            names: [],
            isHost: false,
            socket: null,
          pb: []
        };
    },

    created() {

    },
    mounted() {
        if(this.getCookies("host") === "true"){
            this.isHost = true
        }

        window.addEventListener('beforeunload', this.eventClose);


        this.socket = new WebSocket('ws://212.227.183.160:3000');

        this.socket.addEventListener('open', (event) => {
            console.log('WebSocket-Verbindung geöffnet');
            //this.getPlayers()
          this.getPb()

        });

        this.socket.addEventListener('message', (event) => {
            const message = event.data;
            let check = message.split("---")
            if(check[0] === "engine"){
                if(check[1] === "players"){
                  this.names = []
                    let split = check[2].split(";;;")
                  for(let i = 0; i < split.length; i++){
                    let dat = {
                      name: split[i],
                      pb: this.getPbByName(split[i])
                    }
                    this.names.push(dat)
                  }


                  let names1 = this.names
                  this.names = []
                  nextTick().then(() =>{
                    this.names = names1
                  })

                }else if(check[1] === "start"){
                    if(check[2] === "true"){
                        this.startGame()
                    }else if(check[2] === "false"){

                    }
                }else if(check[1] === "pb"){

                  this.pb = check[2].split(";-;")

                  this.getPlayers()
                }
            }
        });

    },

    beforeUnmount() {
        window.removeEventListener('beforeunload', this.eventClose);
    },


    methods: {

        getPlayers(){
            this.socket.send("ping;;;getPlayers");
        },
      getPb(){
        this.socket.send("ping;;;getPb");
      },
        startGame(){
          window.open(document.baseURI.split("/#/")[0] + "/#/game", '_self');
        },

        startCall(){
            this.getPlayers()
        },

        onClickStart(){
          this.setCookies("hearts", this.$refs.input.value)
          window.open(document.baseURI.split("/#/")[0] + "/#/game", '_self');
            this.socket.send("engine;;;startGame");
        },

        eventClose(){
            this.socket.send("register;;;removePlayer;;;" + this.getCookies("username"));
        },

        onClickLeave(){
          console.log(this.getCookies("username"))
            this.socket.send("register;;;removePlayer;;;" + this.getCookies("username"));
            window.open(document.baseURI.split("/#/")[0], '_self');
        },

      getPbByName(name){
          console.log(this.pb)
          for(let i = 0; i < this.pb.length; i++){
            let n = this.pb[i].split(",,,")[0]
            let img = this.pb[i].split(",,,")[1]
            if(n === name){
              return img
            }
          }
      },






        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>