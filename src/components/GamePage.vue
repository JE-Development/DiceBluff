<template>

    <div class="button-layout center-horizontal" v-if="isHost">
        <button class="register-button center-horizontal prim-color-background" @click="onClickStop">
            <p style="margin-top: 5px">Spiel stoppen</p>
        </button>
    </div>
    <div class="button-layout center-horizontal" v-else>
        <button class="register-button center-horizontal prim-color-background" @click="onClickLeave">
            <p style="margin-top: 5px">Spiel verlassen</p>
        </button>
    </div>
  <div class="button-layout center-horizontal" v-if="isLooser && !ghostMode && isGhostAllowed === 'true'">
    <button class="register-button center-horizontal sec-color" @click="onClickGhostMode">
      <p style="margin-top: 5px">Ghost Mode aktivieren</p>
    </button>
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
            <img src="../assets/cup.png" class="cup-image cup-look-close" ref="cup" />
          </div>
          <div class="absolute">
            <img :src="src1" class="dice-image" style="margin-right: 10px"/>
            <img :src="src2" class="dice-image"/>
          </div>
          <div :class="shakeAnimationActive ? 'shake' : ''" v-if="!ghostMode">
            <img src="../assets/cup.png" class="cup-image cup-look-close" ref="cup" />
          </div>

        </div>

    </div>

    <div class="center-horizontal" v-if="youWin">
        <h1 class="green">Du hast gewonnen!</h1>
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
                    <button class="game-button-drop center-horizontal" @click="onClickDrop" v-if="isDrop">
                        <p style="margin-top: 5px">würflen</p>
                    </button>
                    <button class="game-button-move center-horizontal" @click="onClickMove" v-if="isMove">
                        <p style="margin-top: 5px">schieben</p>
                    </button>
                </div>
                <div class="center-horizontal">
                    <button class="game-button-view center-horizontal" @click="onClickView" v-if="isView">
                        <p style="margin-top: 5px">gucken</p>
                    </button>
                    <button class="game-button-reveal center-horizontal" @click="onClickReveal" v-if="isReveal">
                        <p style="margin-top: 5px">aufdecken</p>
                    </button>
                </div>
              <div class="center-horizontal dice-small-layout">
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

export default {
    //npm run dev | npm run build
    name: "GamePage",
    components: {Dice, DiceLayout, PlayerView},
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
          isGhostAllowed: false
        };
    },

    created() {

        EventBus.addEventListener('dice-num', (event) => {
            this.loggedDiceNum = event.data
          if(!this.isDrop || this.isReveal){
            this.isMove = true
          }
            this.error = ""
        })
        EventBus.addEventListener('dice-mode', (event) => {
            this.loggedDiceMode = event.data
        })

    },
    mounted() {
      this.isGhostAllowed = this.getCookies("ghostmode")

        if(this.getCookies("host") === "true"){
            this.isHost = true
        }

        window.addEventListener('beforeunload', this.eventClose);

        this.socket = new WebSocket('ws://212.227.183.160:3000');

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
          if(message.func === "error"){

            if(message.player === this.getCookies("username")){
              this.error = message.text
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
            if(message.player === this.getCookies("username") || message.player === "--everyone--"){
              let word = message.dice.split(";")


              this.src1 = base + word[0] + ".png"
              this.src2 = base + word[1] + ".png"
            }else{
              this.src1 = base + "default.png"
              this.src2 = base + "default.png"
            }

          }else if(message.func === "enableGhostMode"){
            if(message.player === this.getCookies("username")){
              this.ghostMode = true
            }

          }
        });

    },

    beforeUnmount() {
        window.removeEventListener('beforeunload', this.eventClose);
    },


    methods: {
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
            sad: false
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
          window.open(document.baseURI.split("/#/")[0] + "/#/player", '_self');
        },


        stopGame(){
          window.open(document.baseURI.split("/#/")[0] + "/#/player", '_self');
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
            this.error = "Du hast keine Zahl ausgewählt"
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
