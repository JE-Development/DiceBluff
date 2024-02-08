<template>
  <LangSelection @click="langClicked" :lang="lang.langVis"/>
  <AudioSettings @click="audioSettingsClicked" :status="audioSettingsStatus"/>
  <audio ref="audio" :src="audioSrc"></audio>

  <div class="center-horizontal">
    <div :style="'width: ' + 100*progressMultiply + 'px; height: 10px'">
      <div :style="'width: ' + 100 * progressMultiply + 'px; height: 10px; background: #eeeeee55'" class="absolute"></div>
      <div :style="'width: ' + progress * progressMultiply + 'px; height: 10px; background: #42b983'" class="absolute"></div>
    </div>
    <div>
      <div>{{progress}}XP</div>
    </div>
  </div>

    <div class="button-layout center-horizontal" v-if="isHost">
      <UIButton :title="lang.gamePage.stopButton" @click="onClickStop" color="prim-color-background"/>
    </div>
    <div class="button-layout center-horizontal" v-else>
      <UIButton :title="lang.gamePage.leaveButton" @click="onClickLeave" color="prim-color-background"/>
    </div>
  <div class="button-layout center-horizontal" v-if="isLooser && !ghostMode && isGhostAllowed === 'true'">
    <UIButton :title="lang.gamePage.enableGhostMode" @click="onClickGhostMode" color="sec-color"/>
  </div>

    <div class="center-horizontal">
        <PlayerView
            v-for="(dat) in names"
            :name="dat.name"
            :turn="dat.turn"
            :loose="dat.loose"
            :heart="dat.heart"
            :img="dat.pb"
            :winner="dat.winner"
            :isSad="dat.sad"
            :winnerCount="dat.winnerCount"
        />
    </div>

    <div class="center-horizontal" v-if="globalDice !== ''">
        <dice
            :num="globalDice"
            :mode="globalMode"
        />
    </div>

    <div class="relative">
      <div class="absolute" v-if="isDiceMenu">
        <DiceLayout :center="false" class="dice-big-layout"/>
      </div>
        <div class="center-horizontal">
          <div :class="shakeAnimationActive ? 'shake' : ''" v-if="ghostMode">
            <img src="../assets/cup_texture.png" class="cup-image cup-look-close" ref="cup" />
          </div>
          <div class="absolute">
            <img :src="src1" class="dice-image" style="margin-right: 10px"/>
            <img :src="src2" class="dice-image"/>
          </div>
          <div :class="shakeAnimationActive ? 'shake' : ''" v-if="!ghostMode">
            <img src="../assets/cup_texture.png" class="cup-image cup-look-close" ref="cup" />
          </div>

        </div>

    </div>

    <div class="relative">

        <div class="absolute center-horizontal" style="width: 100%; margin-top: 50px;">
            <div>
                <div class="center-horizontal" v-if="error !== ''">
                    <h4 class="red">{{error}}</h4>
                </div>
                <div class="center-horizontal" v-if="loggedDiceNum !== ''">
                    <dice
                        :num="loggedDiceNum"
                        :mode="loggedDiceMode"
                    />
                </div>
                <div v-else>
                    <div class="dice-border">

                    </div>
                </div>
                <div class="center-horizontal">
                  <div class="center-horizontal">
                    <GameButton :title="lang.gamePage.dropButton" color="game-button-drop" @click="onClickDrop" v-if="isDrop"/>
                  </div>
                  <div class="center-horizontal">
                    <GameButton :title="lang.gamePage.moveButton" color="game-button-move" @click="onClickMove" v-if="isMove"/>
                  </div>
                </div>
                <div class="center-horizontal">
                  <div class="center-horizontal">
                    <GameButton :title="lang.gamePage.viewButton" color="game-button-view" @click="onClickView" v-if="isView"/>
                  </div>
                  <div class="center-horizontal">
                    <GameButton :title="lang.gamePage.revealButton" color="game-button-reveal" @click="onClickReveal" v-if="isReveal"/>
                  </div>
                </div>
              <div class="center-horizontal dice-small-layout" v-if="isDiceMenu">
                <DiceLayout :center="true"/>
              </div>
            </div>
        </div>


    </div>

</template>


<script>
import PlayerView from "@/components/views/PlayerView.vue";
import EventBus from "@/components/code/EventBusEvent";
import DiceLayout from "@/components/views/DiceLayout.vue";
import Dice from "@/components/views/Dice.vue";
import dice from "@/components/views/Dice.vue";
import {toUnicode} from "punycode";
import {nextTick} from "vue";
import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"
import UIButton from "@/components/views/UIButton.vue";
import GameButton from "@/components/views/GameButton.vue";
import LangSelection from "@/components/views/LangSelection.vue";
import AudioSettings from "@/components/views/AudioSettings.vue";

export default {
    //npm run dev | npm run build
    name: "GamePage",
    components: {AudioSettings, LangSelection, GameButton, UIButton, Dice, DiceLayout, PlayerView},
    data() {
        return {
            names: [],
            isHost: false,
            socket: null,
            shakeAnimationActive: false,
            isDiceMenu: false,
            isDrop: false,
            isReveal: false,
            isView: false,
            isMove: false,
            src1: "",
            src2: "",
            loggedDiceNum: "",
            loggedDiceMode: "",
            error: "",
            globalDice: "",
            globalMode: "",
            loose: false,
            youWin: false,
            ghostMode: false,
          isLooser: false,
          isGhostAllowed: false,
          lang: langEN,
          audioBase: "https://dicebluff.inforge.de/sounds/",
          audioSrc: "",
          audios: {},
          audioSettingsStatus: true,
          progressMultiply: 5,
          progress: 0,
        };
    },

    created() {
      this.audios = {
        "join-left": this.audioBase + "join-left" + ".mp3",
        "heart-loose": this.audioBase + "heart-loose" + ".mp3",
        "pass": this.audioBase + "pass" + ".mp3",
        "reveal": this.audioBase + "reveal" + ".mp3",
        "rolling": this.audioBase + "rolling" + ".mp3",
        "turn": this.audioBase + "turn" + ".mp3",
        "view": this.audioBase + "view" + ".mp3",
        "winning": this.audioBase + "winning" + ".mp3",
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

        EventBus.addEventListener('dice-num', (event) => {
            this.loggedDiceNum = event.data
          if(!this.isDrop || this.isReveal){
            this.isMove = true
          }
            this.error = ""
        })
        EventBus.addEventListener('dice-mode', (event) => {
            this.loggedDiceMode = event.data
          //this.audioSrc = this.audioBase + "view" + ".mp3"
          //this.playSound()
        })

    },
    mounted() {
      if(this.getCookies("lang") === null || this.getCookies("lang") === "en"){
        this.lang = langEN
      }else{
        this.lang = langDE
      }

      if(this.getCookies("audioSettings") === null || this.getCookies("audioSettings") === "true"){
        this.audioSettingsStatus = true
      }else{
        this.audioSettingsStatus = false
      }

      this.isGhostAllowed = this.getCookies("ghostmode")

        if(this.getCookies("host") === "true"){
            this.isHost = true
        }

        window.addEventListener('beforeunload', this.eventClose);

        this.socket = new WebSocket(import.meta.env.VITE_SERVER_URL);

        this.socket.addEventListener('open', (event) => {
            console.log('WebSocket-Verbindung geöffnet');

          let dat = {
            type: "register",
            func: "replaceClient",
            player: this.getCookies("username"),
            rc: this.getCookies("rc")
          };
          this.send(dat);
            this.getPlayers()
            this.startSession()

        });

        this.socket.addEventListener('message', (event) => {
          const message = JSON.parse(event.data)
          console.log(message)
          if(message.func === "notBiggerError"){

            if(message.player === this.getCookies("username")){
              this.error = this.lang.gamePage.errorNotBigger
            }

          }else if(message.func === "stop"){

            this.stopGame()

          }else if(message.func === "allPlayers"){
            this.handlePlayers(message)
            let names1 = this.names
            this.names = []
            nextTick().then(() =>{
              this.names = names1
            })

          }else if(message.func === "visSettings"){
            this.updateSettings(message)

          }else if(message.func === "anim"){
            switch (message.type){
              case "cupShake":
                this.shakeCup()
                break;
              case "cupUp":
                this.upCup()
                break;
              case "cupDown":
                this.downCup()
                break;
            }

          }else if(message.func === "showDice"){
            let base = "../src/assets/dice_"
            if(message.player === this.getCookies("username") || message.player === "--everyone--"){
              let word = message.dice.split(";")


              this.src1 = base + word[0] + ".png"
              this.src2 = base + word[1] + ".png"
            }else{
              if(!this.ghostMode){
                this.src1 = base + "default.png"
                this.src2 = base + "default.png"
              }
            }

          }else if(message.func === "setGlobalDice"){
            this.globalDice = message.dice
            this.globalMode = message.mode

          }else if(message.func === "setSad"){
            this.handleSad(message.player)

          }else if(message.func === "showGhostDice"){
            let base = "../src/assets/dice_"
            for(let i = 0; i < message.player.length; i++){
              if(message.player[i] === this.getCookies("username") || message.player[i] === "--everyone--"){
                let word = message.dice.split(";")


                this.src1 = base + word[0] + ".png"
                this.src2 = base + word[1] + ".png"
              }else{
                this.src1 = base + "default.png"
                this.src2 = base + "default.png"
              }
            }

          }else if(message.func === "enableGhostMode"){
            if(message.player === this.getCookies("username")){
              this.ghostMode = true
            }

          }else if(message.func === "removed"){
            this.onClickLeave()
            this.eventClose()
            window.open(document.baseURI.split("/#/")[0], '_self');
          }else if(message.func === "playSound"){
            if(this.audioSettingsStatus){
              this.playSound(message.sound)
            }
          }else if(message.func === "playSoundPlayer"){
            if(message.player === this.getCookies("username") && this.audioSettingsStatus){
              this.playSound(message.sound)
            }
          }else if(message.func === "addXP"){
            if(message.player === this.getCookies("username")){
              this.progress = this.progress + message.xp
              if(this.progress > 100){
                this.progress = 100
                let dat = {
                  type: "engine",
                  func: "fullXP",
                  player: this.getCookies("username")
                }
                this.send(dat)
              }
            }
          }
        });

    },

    beforeUnmount() {
        window.removeEventListener('beforeunload', this.eventClose);
    },


    methods: {
      audioSettingsClicked(){
        if(this.audioSettingsStatus){
          this.audioSettingsStatus = false
          this.setCookies("audioSettings", "false")
        }else{
          this.audioSettingsStatus = true
          this.setCookies("audioSettings", "true")
        }
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
        this.audios[sound].currentTime = 0
        this.audios[sound].play()
      },

        getPlayers(){
          const message = {
            type: "engine",
            func: "getAllPlayersInfo"
          };
          this.send(message);
        },

      handlePlayers(message){
        let allPlayers = message.players
        let collect = []
        for(let i = 0; i < allPlayers.length; i++){
          let p = allPlayers[i]
          let data = {
            name: p.name,
            turn: p.turn,
            loose: p.looser,
            heart: p.heart,
            pb: p.pb,
            winner: p.winner,
            sad: false,
            winnerCount: p.winnerCount
          }
          if(p.name === this.getCookies("username") && p.looser){
            this.isLooser = true
          }
          if(p.name === this.getCookies("username") && !p.looser){
            this.isLooser = false
            this.ghostMode = false
          }

          collect.push(data)
        }
        this.names = collect
      },

      handleSad(player){
        for(let i = 0; i < this.names.length; i++){
          if(this.names[i].name === player){
            this.names[i].sad = true
          }
        }

        let names1 = this.names
        this.names = []
        nextTick().then(() =>{
          this.names = names1
        })

        setTimeout(() => {
          for(let i = 0; i < this.names.length; i++){
            this.names[i].sad = false
          }
          let names1 = this.names
          this.names = []
          nextTick().then(() =>{
            this.names = names1
          })
        }, 2000)

      },

        eventClose(){
          if(this.isHost){
            //this.onClickStop()
            this.killRoom()
          }
          let dat = {
            type: "register",
            func: "removePlayer",
            player: this.getCookies("username"),
            pb: this.getCookies("pb")
          }
          this.send(dat)
        },

      startSession(){
        let dat = {
          type: "engine",
          func: "startSession"
        }
        this.send(dat)
      },

      updateSettings(message){
          if(message.player === this.getCookies("username")){
            this.isDiceMenu = message.diceMenu
            this.isDrop = message.dropButton
            this.isMove = message.moveButton
            this.isView = message.viewButton
            this.isReveal = message.revealButton
          }
      },

      upCup(){
        this.$refs.cup.className = this.$refs.cup.className.replace("cup-look-close", "cup-look-open")
      },

      downCup(){
        this.$refs.cup.className = this.$refs.cup.className.replace("cup-look-open", "cup-look-close")
      },


        onClickStop(){
          let dat = {
            type: "engine",
            func: "stop"
          }
          this.send(dat)
        },

      killRoom(){
        let dat = {
          type: "engine",
          func: "kill"
        }
        this.send(dat)
      },


        stopGame(){
          if(this.getCookies("botLayout") === "true"){
            window.open(document.baseURI.split("/#/")[0] + "/#/bot", '_self');
          }else{
            window.open(document.baseURI.split("/#/")[0] + "/#/player", '_self');
          }

        },

        onClickLeave(){
          let dat = {
            type: "register",
            func: "removePlayer",
            player: this.getCookies("username"),
            pb: this.getCookies("pb")
          }
          this.send(dat)
          window.open(document.baseURI.split("/#/")[0], '_self');
        },

        onClickDrop(){
          let dat = {
            type: "engine",
            func: "buttonClicked",
            args: ["drop"]
          }

            this.send(dat);

        },

        onClickMove(){
          if(this.loggedDiceNum === ""){
            this.error = this.lang.gamePage.errorNoNumberSelected
          }else{
            let dat = {
              type: "engine",
              func: "buttonClicked",
              args: ["move", this.loggedDiceNum]
            }

            this.loggedDiceNum = ""

            this.send(dat);
          }

        },

        onClickView(){

          let dat = {
            type: "engine",
            func: "buttonClicked",
            args: ["view"]
          }

          this.send(dat);

        },

        onClickReveal(){
          let dat = {
            type: "engine",
            func: "buttonClicked",
            args: ["reveal"]
          }

          this.send(dat);

        },

        shakeCup() {
            this.shakeAnimationActive = true;
            setTimeout(() => {
                this.shakeAnimationActive = false;
            }, 1000);
        },

      onClickGhostMode(){
          let dat = {
            type: "engine",
            func: "activeGhostMode",
            args: [this.getCookies("username")]
          }
          this.send(dat)
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
