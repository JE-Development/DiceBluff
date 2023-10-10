<template>

  <div class="center" v-if="isHost">
    <h1 class="prim-color">Code: <span class="sec-color-text">{{getCookies("rc")}}</span></h1>
  </div>
  <div class="center-horizontal" v-if="isHost">
    <button class="register-button center-horizontal prim-color-background" @click="onClickRemove">
      <p style="margin-top: 5px">Alle Spieler entfernen</p>
    </button>
  </div>

    <div class="button-layout center-horizontal">
        <button class="register-button center-horizontal prim-color-background" @click="onClickLeave">
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
          <div class="center-horizontal">
            <button class="register-button center-horizontal prim-color-background" @click="onClickStart">
              <p style="margin-top: 5px">Spiel starten</p>
            </button>
          </div>
          <div class="center-horizontal center">
              <h2 class="white">Herzenanzahl:</h2>
              <input ref="input" class="heart-input" value="3">
          </div>
          <div class="center">
            <h2 class="white">Ghost Mode erlauben</h2>
            <input type="checkbox" class="check-box" ref="isghost" checked>
          </div>
          <h2 class="red">{{errorText}}</h2>
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
          pb: [],
          errorText: ""
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
          this.send(dat);

          dat = {
            type: "register",
            func: "replaceClient",
            player: this.getCookies("username"),
            rc: this.getCookies("rc")
          };
          this.send(dat);

              /*if(this.getCookies("host") === "true"){
                dat = {
                  type: "engine",
                  func: "stop"
                }
                this.send(dat)
              }

          const message = {
            type: "engine",
            func: "clearGameEngine"
          };
          this.send(message)*/

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

          }else if(message.func === "removed"){
            this.onClickLeave()

          }
        });

    },

    beforeUnmount() {
      window.removeEventListener('beforeunload', this.eventClose);
    },


    methods: {

      startGame(){
        window.open(document.baseURI.split("/#/")[0] + "/#/game", '_self');
      },

      onClickStart(){
        if(this.$refs.input.value !== ""){
          let checker = Number(this.$refs.input.value)
          if(isNaN(checker)){
            this.errorText = "Der Wert für die Herzenanzahl ist ungültig."
          }else if(checker < 1){
            this.errorText = "Der Wert für die Herzenanzahl darf nicht kleiner als '1' sein."
          }else{
            this.setCookies("hearts", this.$refs.input.value)
            this.setCookies("ghostmode", String(this.$refs.isghost.checked))
            window.open(document.baseURI.split("/#/")[0] + "/#/game", '_self');
            let dat = {
              type: "engine",
              func: "start",
              args: [this.$refs.input.value]
            }
            this.send(dat);
          }
        }else{
          this.errorText = "Das Textfeld für die Herzenanzahl darf nicht leer sein."
        }
      },

      eventClose(){
        let dat = {
          type: "register",
          func: "removePlayer",
          player: this.getCookies("username"),
          pb: this.getCookies("pb")
        }
        this.send(dat);
      },

      onClickLeave(){
        this.eventClose()
        window.open(document.baseURI.split("/#/")[0], '_self');
      },

      onClickRemove(){
        let dat = {
          type: "register",
          func: "kickAllPlayers"
        }
        this.send(dat);
        dat = {
          type: "register",
          func: "clearPlayer"
        }
        this.send(dat);
      },




      send(data){
        data.rc = this.getCookies("rc")
        this.socket.send(JSON.stringify(data))
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