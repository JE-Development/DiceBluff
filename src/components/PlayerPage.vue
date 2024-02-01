<template>

  <div class="center" v-if="isHost">
    <h1 class="prim-color">Code: <span class="sec-color-text">{{getCookies("rc")}}</span></h1>
  </div>
  <div class="center-horizontal" v-if="isHost">
    <UIButton :title="lang.playerPage.kickEveryoneButton" @click="onClickRemove" color="prim-color-background"/>
  </div>

    <div class="button-layout center-horizontal" v-if="!isHost">
      <UIButton :title="lang.playerPage.leaveButton" @click="onClickLeave" color="prim-color-background"/>
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
            <UIButton :title="lang.playerPage.startButton" @click="onClickStart" color="prim-color-background"/>
          </div>
          <div class="center-horizontal center">
              <h2 class="white">{{lang.playerPage.heartCount}}</h2>
              <input ref="input" class="heart-input texture" value="3">
          </div>
          <div class="center">
            <h2 class="white">{{lang.playerPage.allowGhostMode}}</h2>
            <input type="checkbox" class="check-box" ref="isghost" checked>
          </div>
          <div class="center">
            <h2 class="white">{{lang.playerPage.visibility}}</h2>
            <input type="checkbox" class="check-box" ref="vis" checked @click="visClicked">
          </div>
          <h2 class="red">{{errorText}}</h2>
        </div>
    </div>
    <div v-else class="center-horizontal">
        <h1>{{lang.playerPage.waitForPlayer}}</h1>
    </div>

</template>


<script>
import EventBus from "./code/EventBusEvent";
import PlayerView from "@/components/views/PlayerView.vue";
import {nextTick} from "vue";
import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"
import UIButton from "@/components/views/UIButton.vue";

export default {
    //npm run dev | npm run build
    name: "PlayerPage",
    components: {UIButton, PlayerView},
    data() {
        return {
            names: [],
            isHost: false,
            socket: null,
          pb: [],
          errorText: "",
          lang: langEN,
          buttonTrigger: false
        };
    },

    created() {

    },
    mounted() {

      if(this.getCookies("lang") === null || this.getCookies("lang") === "en"){
        this.lang = langEN
      }else{
        this.lang = langDE
      }

        if(this.getCookies("host") === "true"){
            this.isHost = true
        }

        window.addEventListener('beforeunload', this.eventClose);


        this.socket = new WebSocket(import.meta.env.VITE_SERVER_URL);

        this.socket.addEventListener('open', (event) => {
          console.log("socket connected")

          let dat = {
            type: "register",
            func: "replaceClient",
            player: this.getCookies("username"),
            rc: this.getCookies("rc")
          };
          this.send(dat);

          dat = {
            type: "ping",
            func: "getPlayers"
          };
          this.send(dat);



        });

        this.socket.addEventListener('message', (event) => {
          const message = JSON.parse(event.data)
          //console.log(message)
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

            if(message.isStarted){
              this.setCookies("ghostmode", message.ghostmode)
              this.startGame()
            }

          }else if(message.func === "start"){
            this.setCookies("ghostmode", message.ghostmode)
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
        if(this.names.length > 1){
          if(this.$refs.input.value !== ""){
            let checker = Number(this.$refs.input.value)
            if(isNaN(checker)){
              this.errorText = this.lang.playerPage.heartErrorNaN
            }else if(checker < 1){
              this.errorText = this.lang.playerPage.heartErrorWrongNumber
            }else{
              this.setCookies("hearts", this.$refs.input.value)
              this.setCookies("ghostmode", String(this.$refs.isghost.checked))
              this.setCookies("botLayout", "false")
              window.open(document.baseURI.split("/#/")[0] + "/#/game", '_self');
              let dat = {
                type: "engine",
                func: "start",
                args: [this.$refs.input.value, this.$refs.isghost.checked]
              }
              this.send(dat);
            }
          }else{
            this.errorText = this.lang.playerPage.heartErrorEmpty
          }
        }else{
          this.errorText = this.lang.playerPage.needMorePlayers
        }
      },

      eventClose(){
        if(this.isHost && !this.buttonTrigger){
          this.onClickRemove()
        }else{
          let dat = {
            type: "register",
            func: "removePlayer",
            player: this.getCookies("username"),
            pb: this.getCookies("pb")
          }
          this.send(dat);
        }
      },

      onClickLeave(){
        this.eventClose()
        window.open(document.baseURI.split("/#/")[0], '_self');
      },

      onClickRemove(){
        this.buttonTrigger = true
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

      visClicked(){
        let isVis = this.$refs.vis.checked
        if(isVis){
          this.setVis(true)
        }else{
          this.setVis(false)
        }
      },

      setVis(mode){
        let dat = {
          type: "engine",
          func: "setVis",
          args: [mode]
        }
        this.send(dat)
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