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
          console.log("socket connected")
          let dat = {
            type: "ping",
            func: "getPlayers"
          };
          this.socket.send(JSON.stringify(dat));

          const message = {
            type: "engine",
            func: "clearGameEngine"
          };
          this.socket.send(JSON.stringify(message));

        });

        this.socket.addEventListener('message', (event) => {
          const message = JSON.parse(event.data)
          console.log(message)
          if(message.func === "error"){

            console.error(message.text)

          }else if(message.func === "allPlayers"){
            this.names = []

            let allPlayers = message.players
            for(let i = 0; i < allPlayers.length; i++){
              let dat = {
                name: allPlayers[i].name,
                pb: allPlayers[i].pb
              }
              this.names.push(dat)
            }

            let names1 = this.names
            this.names = []
            nextTick().then(() =>{
              this.names = names1
            })

          }else if(message.func === "start"){
            this.startGame()

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
        let dat = {
          type: "engine",
          func: "start",
          args: [this.$refs.input.value]
        }
        this.socket.send(JSON.stringify(dat));
      },

      eventClose(){
        let dat = {
          type: "register",
          func: "removePlayer",
          player: this.getCookies("username"),
          pb: this.getCookies("pb")
        }
        this.socket.send(JSON.stringify(dat));
      },

      onClickLeave(){
        this.eventClose()
        window.open(document.baseURI.split("/#/")[0], '_self');
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