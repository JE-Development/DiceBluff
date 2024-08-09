<template>
  <audio ref="audio" :src="audioSrc"></audio>
  <LangSelection @click="langClicked" :lang="lang.langVis"/>
  <AudioSettings/>

  <transition name="toast">
    <Toast color="red" :text="errorText" v-if="showToast" style="z-index: 9999"/>
  </transition>

  <div class="full-size">
    <div class="center-horizontal room-link" v-if="isHost">
      <div class="center-horizontal">
        <div class="absolute">
          <h2 class="link-background link-text center-horizontal">{{baseURI}}/code/{{getCookies("rc")}}</h2>
        </div>
        <div style="height: 60px"></div>
      </div>
    </div>
    <div class="center-horizontal" v-if="isHost">
      <UIButton :title="lang.playerPage.kickEveryoneButton" @click="onClickRemove" color="prim-color-background"/>
    </div>

    <div class="button-layout center-horizontal room-mobile-layout" v-if="!isHost">
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

        <div class="center-horizontal" v-if="allowBot">
          <div class="center-horizontal">
            <UIButton :title="lang.playerPage.addBotButton" @click="onClickAddBot" color="sec-color"/>
          </div>

          <div class="center-horizontal">
            <UIButton :title="lang.playerPage.removeBotButton" @click="onClickRemoveBot" color="sec-color"/>
          </div>
        </div>
        <div class="center-horizontal" v-else>
          <div style="height: 30px; margin-top: 12px; margin-bottom: 12px; background: rgba(0,0,0,0.5)" class="center">
            <div style="width: 5px"></div>
            <h2 class="red">{{lang.playerPage.botNotAllowed}}</h2>
            <div style="width: 5px"></div>
          </div>
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
        <div class="center">
          <h2 class="white">{{lang.playerPage.powerups}}</h2>
          <input type="checkbox" class="check-box" ref="powerups" @change="checkBoxChange">
        </div>
      </div>
    </div>
    <div v-else class="center-horizontal">
      <h1>{{lang.playerPage.waitForPlayer}}</h1>
    </div>
  </div>

</template>


<script>
import EventBus from "./code/EventBusEvent";
import PlayerView from "@/components/views/PlayerView.vue";
import {nextTick} from "vue";
import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"
import UIButton from "@/components/views/UIButton.vue";
import LangSelection from "@/components/views/LangSelection.vue";
import AudioSettings from "@/components/views/AudioSettings.vue";
import Toast from "@/components/views/Toast.vue";

export default {
    //npm run dev | npm run build
    name: "PlayerPage",
    components: {Toast, AudioSettings, LangSelection, UIButton, PlayerView},
    data() {
        return {
            names: [],
            isHost: false,
            socket: null,
          pb: [],
          errorText: "",
          lang: langEN,
          buttonTrigger: false,
          baseURI: "",
          audioBase: "https://dicebluff.inforge.de/sounds/",
          audioSrc: "",
          audios: {},
          audioSettingsStatus: true,
          showToast: false,
          allowBot: true
        };
    },

    created() {
      this.audios = {
        "join-left": this.audioBase + "join-left" + ".mp3"
      }

      let promises = [];
      Object.keys(this.audios).forEach(s => {
        promises.push(new Promise((resolve, reject) => {
          let url = this.audios[s];
          this.audios[s] = new Audio();
          this.audios[s].addEventListener('canplaythrough', resolve, false);
          this.audios[s].src = url;
        }));
      });

      Promise.all(promises).then(() => {
        //stats.innerText = `All audio files loaded!  Drag mouse over the keys`;
      }).catch(e => {
        console.log('error loading audio files: ', e);
      });

    },
    mounted() {
      this.baseURI = document.baseURI.split("#")[0] + "#"

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

      this.socket.addEventListener('error', (event) => {
        this.$router.push("/")
      });

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

          dat = {
            type: "ping",
            func: "existRoom"
          };
          this.send(dat);



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

            if(message.isStarted){
              this.setCookies("ghostmode", message.ghostmode)
              this.setCookies("powerups", message.powerups)
              this.startGame()
            }

          }else if(message.func === "start"){
            this.setCookies("ghostmode", message.powerups)
            this.setCookies("powerups", message.powerups)
            this.startGame()

          }else if(message.func === "removed"){
            this.onClickLeave()
          }else if(message.func === "playSound"){
            if(this.audioSettingsStatus){
              this.playSound(message.sound)
            }
          }else if(message.func === "existRoom"){
            if(!message.exist){
              this.$router.push("/")
            }
          }else if(message.func === "notExistToReplace"){
            let message = {
              type: "register",
              func: "addPlayer",
              player: this.getCookies("username"),
              pb: this.getCookies("pb"),
            };
            this.send(message)
          }else if(message.func === "botLimit" && this.getCookies("username") === message.player){
            this.errorText = this.lang.playerPage.botLimitError
            this.displayToast()
          }
        });

    },

    beforeUnmount() {
      window.removeEventListener('beforeunload', this.eventClose);
    },


    methods: {


      displayToast(){
        this.showToast = true
        setTimeout(() => {
          this.showToast = false
        }, 4000)
      },

      langClicked(){
        if(this.getCookies("lang") === null || this.getCookies("lang") === "en"){
          this.setCookies("lang", "de")
          this.lang = langDE
        }else{
          this.setCookies("lang", "en")
          this.lang = langEN
        }
      },

      playSound(sound) {
        let val = this.getCookies("volume")
        let volume = 1
        try{
          volume = Number(val) / 100
        }catch (e){

        }
        this.audios[sound].currentTime = 0
        this.audios[sound].volume = volume
        this.audios[sound].play()
      },

      startGame(){
        window.open(document.baseURI.split("/#/")[0] + "/#/game", '_self');
      },

      onClickStart(){
        if(this.names.length > 1){
          if(this.$refs.input.value !== ""){
            let checker = Number(this.$refs.input.value)
            if(isNaN(checker)){
              this.errorText = this.lang.playerPage.heartErrorNaN
              this.displayToast()
            }else if(checker < 1){
              this.errorText = this.lang.playerPage.heartErrorWrongNumber
              this.displayToast()
            }else{
              this.setCookies("hearts", this.$refs.input.value)
              this.setCookies("ghostmode", String(this.$refs.isghost.checked))
              this.setCookies("powerups", String(this.$refs.powerups.checked))
              this.setCookies("botLayout", "false")
              window.open(document.baseURI.split("/#/")[0] + "/#/game", '_self');
              let dat = {
                type: "engine",
                func: "start",
                args: [this.$refs.input.value, this.$refs.isghost.checked, this.$refs.powerups.checked]
              }
              this.send(dat);
            }
          }else{
            this.errorText = this.lang.playerPage.heartErrorEmpty
            this.displayToast()
          }
        }else{
          this.errorText = this.lang.playerPage.needMorePlayers
          this.displayToast()
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


      onClickAddBot(){
        let dat = {
          type: "register",
          func: "addBot",
          pb: this.getRandomPB(),
          player: this.getCookies("username")
        };
        this.send(dat)
      },

      onClickRemoveBot(){
        this.errorText = ""
        let dat = {
          type: "register",
          func: "removeBot"
        };
        this.send(dat)
      },

      onClickRemoveAllBots(){
        let dat = {
          type: "register",
          func: "removeAllBots"
        };
        this.send(dat)
      },


      getRandomPB(){
        let pbs = import.meta.env.VITE_PB.split(",")
        let random = Math.floor(Math.random() * pbs.length)
        return pbs[random]
      },

      checkBoxChange(){
        let isPowerup = this.$refs.powerups.checked
        this.allowBot = !isPowerup
        if(!this.allowBot){
          this.onClickRemoveAllBots()
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