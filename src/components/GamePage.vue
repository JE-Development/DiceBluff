<template>

    <div class="button-layout center-horizontal" v-if="isHost">
        <button class="register-button center-horizontal" @click="onClickStop">
            <p style="margin-top: 5px">Spiel stoppen</p>
        </button>
    </div>
    <div class="button-layout center-horizontal" v-else>
        <button class="register-button center-horizontal" @click="onClickLeave">
            <p style="margin-top: 5px">Spiel verlassen</p>
        </button>
    </div>

    <div class="center-horizontal">
        <PlayerView
            v-for="(dat) in names"
            :name="dat.name"
            :turn="dat.turn"
            :loose="dat.loose"
            :heart="dat.heart"
        />
    </div>

    <div class="center-horizontal" v-if="globalDice !== ''">
        <dice
            :num="globalDice"
            :mode="globalMode"
        />
    </div>

    <div class="relative">
      <div class="absolute" v-if="playerTurn">
        <DiceLayout/>
      </div>
        <div class="center-horizontal">
          <div class="absolute">
            <img :src="src1" class="dice-image" style="margin-right: 10px"/>
            <img :src="src2" class="dice-image"/>
          </div>
          <div :class="shakeAnimationActive ? 'shake' : ''">
            <img src="../assets/cup.png" class="cup-image" ref="cup" />
          </div>
        </div>

    </div>

    <div class="center-horizontal" v-if="youWin">
        <h1 class="green">Du hast gewonnen!</h1>
    </div>

    <div class="relative" v-if="playerTurn">

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
            loosers: [],
            isHost: false,
            socket: null,
            turn: "",
            playerTurn: false,
            dice: "null",
            shakeAnimationActive: false,
            isDrop: true,
            isReveal: false,
            isView: false,
            isMove: false,
            isDiceVisible: false,
            src1: "",
            src2: "",
            loggedDiceNum: "",
            loggedDiceMode: "",
            error: "",
            globalDice: "",
            globalMode: "",
            selfTurn: true,
            allowedLookedAnim: true,
          next: false,
          allNums: [],
            loose: false,
            youWin: false,
        };
    },

    created() {

      this.allNums.push([31,1])
      this.allNums.push([32,2])
      this.allNums.push([41,3])
      this.allNums.push([42,4])
      this.allNums.push([43,5])
      this.allNums.push([51,6])
      this.allNums.push([52,7])
      this.allNums.push([53,8])
      this.allNums.push([54,9])
      this.allNums.push([61,10])
      this.allNums.push([62,11])
      this.allNums.push([63,12])
      this.allNums.push([64,13])
      this.allNums.push([65,14])
      this.allNums.push([11,15])
      this.allNums.push([22,16])
      this.allNums.push([33,17])
      this.allNums.push([44,18])
      this.allNums.push([55,19])
      this.allNums.push([66,20])
      this.allNums.push([21,21])

        EventBus.addEventListener('dice-num', (event) => {
            this.loggedDiceNum = event.data
            if(this.next){
              this.isMove = true
            }else{
              if(!this.isDrop){
                this.isMove = true
              }
            }
            this.error = ""
        })
        EventBus.addEventListener('dice-mode', (event) => {
            this.loggedDiceMode = event.data
        })

    },
    mounted() {
        if(this.getCookies("host") === "true"){
            this.isHost = true
        }

        window.addEventListener('beforeunload', this.eventClose);

        this.socket = new WebSocket('ws://212.227.183.160:3000');

        this.socket.addEventListener('open', (event) => {
            console.log('WebSocket-Verbindung geöffnet');
            this.getPlayers()

            this.startCall()

          if(Number(this.getCookies("hearts")) > 0 && this.isHost){
            this.socket.send("engine;;;defaultheart;;;" + Number(this.getCookies("hearts")))
          }

        });

        this.socket.addEventListener('message', (event) => {
            const message = event.data;
            let check = message.split("---")
            console.log(message)
            if(check[0] === "engine"){
                if(check[1] === "players"){
                    let split =  check[2].split(";;;")
                  let collect = []
                    for(let i = 0; i < split.length; i++){
                        let data
                        if(this.turn === split[i]){
                            data = {
                                name: split[i],
                                turn: true,
                                loose: false,
                                heart: this.getHeart(split[i])
                            }
                        }else{
                            data = {
                                name: split[i],
                                turn: false,
                                loose: false,
                                heart: this.getHeart(split[i])
                            }
                        }
                        if(this.loosers.includes(split[i])){
                            data.loose = true
                        }
                        collect.push(data)
                    }
                    this.names = collect
                  console.log("got names")
                }else if(check[1] === "start"){
                    if(check[2] === "true"){

                    }else if(check[2] === "false"){
                        this.stopGame()
                    }
                }else if(check[1] === "looser"){
                  if(check[2] === "undefined"){
                    this.loosers = []
                  }else{
                    this.loosers.push(check[2])
                  }
                }else if(check[1] === "turn"){
                    console.log("in looked close turn")
                    if(!this.allowedLookedAnim){
                        if(!this.$refs.cup.className.includes("cup-look-close")){
                            this.$refs.cup.className = this.$refs.cup.className.replace("cup-look", "cup-look-close")
                        }
                        this.allowedLookedAnim = true
                    }
                    this.setTurn(check[2])
                }else if(check[1] === "dice"){
                    if(check[2] === "undefined"){
                        console.log("no dice")
                        this.isReveal = false
                        this.isMove = false
                        this.isView = false

                    }else{

                        this.dice = check[2]
                    }
                }else if(check[1] === "vote"){
                    if(check[2] === "undefined"){
                        this.globalDice = ""
                        this.globalMode = ""
                    }else{
                        let trim = check[2].split(";")
                        this.globalDice = trim[0]
                        this.globalMode = trim[1]
                    }
                }else if(check[1] === "next"){
                    if(check[2] === "true"){
                        this.next = true
                        this.isReveal = true
                    }else{
                        this.next = false
                        this.isReveal = false
                    }
                }else if(check[1] === "heart"){
                  for(let i = 0; i < this.names.length; i++){
                    if(this.names[i].name === check[2]){
                      this.names[i].heart = Number(check[3])
                    }
                  }
                  let names1 = this.names
                  this.names = []
                  nextTick().then(() =>{
                    this.names = names1
                  })
                }else if(check[1] === "defaultheart"){
                  for(let i = 0; i < this.names.length; i++){
                    this.names[i].heart = Number(check[2])
                  }
                  let names1 = this.names
                  this.names = []
                  nextTick().then(() =>{
                    this.names = names1
                  })
                  this.setCookies("hearts", check[2])
                }else if(check[1] === "looked"){
                    if(!this.playerTurn){
                        if(check[2] === "true"){
                            if(this.allowedLookedAnim){
                                this.allowedLookedAnim = false
                                console.log("in looked open")
                                if(this.$refs.cup.className.includes("cup-look-close")){
                                    this.$refs.cup.className = this.$refs.cup.className.replace("cup-look-close", "cup-look")
                                }else{
                                    this.$refs.cup.className = this.$refs.cup.className + " cup-look"
                                }
                                this.src1 = "../src/assets/dice_default.png"
                                this.src2 = "../src/assets/dice_default.png"
                            }
                        }
                    }else{
                        if(!this.allowedLookedAnim){
                            console.log("in looked code")
                            if(!this.$refs.cup.className.includes("cup-look-close")){
                                this.$refs.cup.className = this.$refs.cup.className.replace("cup-look", "cup-look-close")
                            }
                            this.allowedLookedAnim = true
                        }
                    }
                }else if(check[1] === "shake"){
                    this.startShakeAnimation()
                }else if(check[1] === "reveal"){
                  this.handleReveal()
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
        eventClose(){
            this.socket.send("register;;;removePlayer;;;" + this.getCookies("username"));
        },

        startCall(){
          this.socket.send("engine;;;setTurnFirst");
          //this.isTurn()
          //this.isDice()
        },

        onClickStop(){
          window.open(document.baseURI.split("/#/")[0] + "/#/player", '_self');
            this.socket.send("engine;;;stopGame");
        },


        stopGame(){
          window.open(document.baseURI.split("/#/")[0] + "/#/player", '_self');
        },

        onClickLeave(){
            this.socket.send("register;;;removePlayer;;;" + this.getCookies("username"));
          window.open(document.baseURI.split("/#/")[0], '_self');
        },

        setTurn(player){
            console.log("player turn: " + player)
            if(this.getCookies("username") === player){
                this.playerTurn = true
                this.selfTurn = false
              this.isDrop = true
              if(this.next){
                this.isReveal = true
              }
                if(this.globalDice === "21"){
                    this.onClickReveal()
                }
            }else{
                this.playerTurn = false
                this.selfTurn = true
            }
            //this.getPlayers()
            this.turn = player
          for(let i = 0; i < this.names.length; i++){
            if(this.names[i].name === player){
              this.names[i].turn = true
            }else{
              this.names[i].turn = false
            }
          }
            if(this.loosers.length === this.names.length -1){
              this.socket.send("engine;;;resetgame;;;" + this.getCookies("hearts"));
            }
        },



        onClickDrop(){
            this.socket.send("engine;;;shake")
            this.isDrop = false
            this.isView = true
            this.isReveal = false

            let num1 = Math.floor(Math.random() * 6)+1;
            let num2 = Math.floor(Math.random() * 6)+1;

            let pos1 = num1
            let pos2 = num2

            if(num1 < num2){
                pos2 = num1
                pos1 = num2
            }

            let sum = pos1 + "" + pos2

            this.socket.send("engine;;;setDice;;;" + sum);

        },

        onClickMove(){
            if(this.loggedDiceNum === ""){
                this.error = "Du hast keine Zahl ausgewählt"
            }else{

              if(this.checkIsBigger()){
                this.error = ""
                let voted = this.loggedDiceNum + ";" + this.loggedDiceMode
                this.socket.send("engine;;;setVotedDice;;;" + voted);

                console.log("in move reset")
                let newName = this.getNewName()

                this.socket.send("engine;;;setPlayerTurn;;;" + newName);
                this.isDiceVisible = false
                this.isMove = false
                this.isView = false
                this.loggedDiceMode = ""
                this.loggedDiceNum = ""

                if(!this.$refs.cup.className.includes("cup-look-close")){
                  console.log("in move")
                  this.$refs.cup.className = this.$refs.cup.className.replace("cup-look", "cup-look-close")
                }

                this.socket.send("engine;;;setLooked;;;false");
              }else{
                this.error = "Die Zahl muss größer sein als vorher gesagt."
              }




            }
        },

        getNewName() {
            let currentIndex = 0
            for(let i = 0; i < this.names.length; i++){
                if(this.names[i].name === this.turn){
                    currentIndex = i
                }
            }
            let next
            let searchIndex = currentIndex+1
            for(let i = 0; i < this.names.length; i++){
                if(searchIndex === this.names.length){
                    searchIndex = 0
                }
                next = this.names[searchIndex].name
                if(this.loosers.includes(next)){
                    searchIndex = searchIndex + 1
                }else{
                    break
                }
            }

            console.log("next --------------------: " + next)

            return next;
        },
        getPrevName() {
            let currentIndex = 0
            for(let i = 0; i < this.names.length; i++){
                if(this.names[i].name === this.turn){
                    currentIndex = i
                }
            }
            let next
            let searchIndex = currentIndex-1
            for(let i = 0; i < this.names.length; i++){
                if(searchIndex === -1){
                    searchIndex = this.names.length-1
                }
                next = this.names[searchIndex].name
                if(this.loosers.includes(next)){
                    searchIndex = searchIndex - 1
                }else{
                    break
                }
            }

            console.log("prev --------------------: " + next)

            return next;
        },

        onClickView(){
            this.isView = false
            this.isDiceVisible = true

            console.log("clicked view")

            let base = "../src/assets/dice_"
            let name1 = ""
            let name2 = ""

            console.log("dice: " + this.dice)

            let d1 = this.dice.charAt(0) + ""
            let d2 = this.dice.charAt(1) + ""

            if(d1 === "1"){
                name1 = "one"
            }else if(d1 === "2"){
                name1 = "two"
            }else if(d1 === "3"){
                name1 = "three"
            }else if(d1 === "4"){
                name1 = "four"
            }else if(d1 === "5"){
                name1 = "five"
            }else if(d1 === "6"){
                name1 = "six"
            }

            if(d2 === "1"){
                name2 = "one"
            }else if(d2 === "2"){
                name2 = "two"
            }else if(d2 === "3"){
                name2 = "three"
            }else if(d2 === "4"){
                name2 = "four"
            }else if(d2 === "5"){
                name2 = "five"
            }else if(d2 === "6"){
                name2 = "six"
            }

            this.src1 = base + name1 + ".png"
            this.src2 = base + name2 + ".png"

            this.isDiceVisible = true
            console.log("in view")
            if(this.$refs.cup.className.includes("cup-look-close")){
                this.$refs.cup.className = this.$refs.cup.className.replace("cup-look-close", "cup-look")
            }else{
                this.$refs.cup.className = this.$refs.cup.className + " cup-look"
            }

            this.socket.send("engine;;;setLooked;;;true");


        },

      handleReveal(){

        let base = "../src/assets/dice_"
        let name1 = ""
        let name2 = ""

        console.log("dice: " + this.dice)

        let d1 = this.dice.charAt(0) + ""
        let d2 = this.dice.charAt(1) + ""
        let num1 = 0
        let num2 = 0

        if(d1 === "1"){
          name1 = "one"
          num1 = 1
        }else if(d1 === "2"){
          name1 = "two"
          num1 = 2
        }else if(d1 === "3"){
          name1 = "three"
          num1 = 3
        }else if(d1 === "4"){
          name1 = "four"
          num1 = 4
        }else if(d1 === "5"){
          name1 = "five"
          num1 = 5
        }else if(d1 === "6"){
          name1 = "six"
          num1 = 6
        }

        if(d2 === "1"){
          name2 = "one"
          num2 = 1
        }else if(d2 === "2"){
          name2 = "two"
          num2 = 2
        }else if(d2 === "3"){
          name2 = "three"
          num2 = 3
        }else if(d2 === "4"){
          name2 = "four"
          num2 = 4
        }else if(d2 === "5"){
          name2 = "five"
          num2 = 5
        }else if(d2 === "6"){
          name2 = "six"
          num2 = 6
        }

        let sum = num1 * 10 + num2
          let gl = this.globalDice

          if(gl === "1 Pasch"){
              gl = "11"
          }else if(gl === "2 Pasch"){
              gl = "22"
          }else if(gl === "3 Pasch"){
              gl = "33"
          }else if(gl === "4 Pasch"){
              gl = "44"
          }else if(gl === "5 Pasch"){
              gl = "55"
          }else if(gl === "6 Pasch"){
              gl = "66"
          }

        let glNum = Number(gl)
        let sumId = 0
        let glId = 0
        for(let i = 0; i < this.allNums.length; i++){
          let n = this.allNums[i]
          if(n[0] === sum){
            sumId = n[1]
          }
          if(n[0] === glNum){
            glId = n[1]
          }
        }
        if(this.turn === this.getCookies("username")){
            if(sumId < glId){
                let nextLooser = this.getPrevName()
                //this.socket.send("engine;;;ingame;;;" + newGame.join(";-;"));
                console.log("another looser: " + nextLooser)
              let heart
              for(let i = 0; i < this.names.length; i++){
                if(this.names[i].name === nextLooser){
                  heart = this.names[i].heart

                }
              }
              heart = heart - 1
              if(heart === 0){
                this.socket.send("engine;;;looser;;;" + nextLooser);
                this.socket.send("engine;;;heart;;;" + nextLooser + ";;;" + heart);
              }else{
                this.socket.send("engine;;;heart;;;" + nextLooser + ";;;" + heart);
              }
                setTimeout(this.reset, 2000)
            }else{

                let myName = this.getCookies("username")
                //this.socket.send("engine;;;ingame;;;" + newGame.join("---"));
              let heart
              for(let i = 0; i < this.names.length; i++){
                if(this.names[i].name === myName){
                  heart = this.names[i].heart

                }
              }
              heart = heart - 1
              if(heart === 0){
                this.socket.send("engine;;;looser;;;" + myName);
                this.socket.send("engine;;;heart;;;" + myName + ";;;" + heart);
              }else{
                this.socket.send("engine;;;heart;;;" + myName + ";;;" + heart);
              }

                setTimeout(this.resetAfter, 2000)
            }
        }

        this.src1 = base + name1 + ".png"
        this.src2 = base + name2 + ".png"

        this.isDiceVisible = true
          console.log("in reveal")
        if(this.$refs.cup.className.includes("cup-look-close")){
          this.$refs.cup.className = "cup-image cup-look"
            console.log("replace: " + this.$refs.cup.className)
        }else{
            console.log("add")
          this.$refs.cup.className = this.$refs.cup.className + " cup-look"
        }


      },

        reset(){
            this.playerTurn = true
            this.socket.send("engine;;;reset");
          this.socket.send("engine;;;setPlayerTurn;;;" + this.turn);
        },

        resetAfter(){
          this.playerTurn = true
          this.socket.send("engine;;;reset");

            console.log("reset after")
            let newName = this.getNewName()

            this.socket.send("engine;;;setPlayerTurn;;;" + newName);

        },

        onClickReveal(){
          this.socket.send("engine;;;reveal");
          this.playerTurn = false
        },

        startShakeAnimation() {
            this.shakeAnimationActive = true;
            setTimeout(() => {
                this.shakeAnimationActive = false;
            }, 1000);
        },
      getHeart(name){
          if(this.names.length > 0){
            for(let i = 0; i < this.names.length; i++){
              if(this.names[i].name === name){
                if(this.names[i].heart === undefined){
                  return this.getCookies("hearts")
                }else{
                  return this.names[i].heart
                }
              }
            }
          }else{
            return this.getCookies("hearts")
          }

      },

      checkIsBigger(){
        let name1 = ""
        let name2 = ""

        let d1 = this.loggedDiceNum.charAt(0) + ""
        let d2 = this.loggedDiceNum.charAt(1) + ""
        let num1 = 0
        let num2 = 0

        console.log("logged dice mode: " + this.loggedDiceMode)

        console.log("dice id 1: " + d1)
        console.log("dice id 2: " + d2)

        if(d1 === "1"){
          name1 = "one"
          num1 = 1
        }else if(d1 === "2"){
          name1 = "two"
          num1 = 2
        }else if(d1 === "3"){
          name1 = "three"
          num1 = 3
        }else if(d1 === "4"){
          name1 = "four"
          num1 = 4
        }else if(d1 === "5"){
          name1 = "five"
          num1 = 5
        }else if(d1 === "6"){
          name1 = "six"
          num1 = 6
        }

        if(d2 === "1"){
          name2 = "one"
          num2 = 1
        }else if(d2 === "2"){
          name2 = "two"
          num2 = 2
        }else if(d2 === "3"){
          name2 = "three"
          num2 = 3
        }else if(d2 === "4"){
          name2 = "four"
          num2 = 4
        }else if(d2 === "5"){
          name2 = "five"
          num2 = 5
        }else if(d2 === "6"){
          name2 = "six"
          num2 = 6
        }

        let sum = num1 * 10 + num2
        let checksum = this.loggedDiceNum
        let gl = this.globalDice

        if(checksum === "1 Pasch"){
          sum = "11"
        }else if(checksum === "2 Pasch"){
          sum = "22"
        }else if(checksum === "3 Pasch"){
          sum = "33"
        }else if(checksum === "4 Pasch"){
          sum = "44"
        }else if(checksum === "5 Pasch"){
          sum = "55"
        }else if(checksum === "6 Pasch"){
          sum = "66"
        }

        sum = Number(sum)

        if(gl === "1 Pasch"){
          gl = "11"
        }else if(gl === "2 Pasch"){
          gl = "22"
        }else if(gl === "3 Pasch"){
          gl = "33"
        }else if(gl === "4 Pasch"){
          gl = "44"
        }else if(gl === "5 Pasch"){
          gl = "55"
        }else if(gl === "6 Pasch"){
          gl = "66"
        }

        let glNum = Number(gl)
        let sumId = 0
        let glId = 0
        for(let i = 0; i < this.allNums.length; i++){
          let n = this.allNums[i]
          if(n[0] === sum){
            sumId = n[1]
          }
          if(n[0] === glNum){
            glId = n[1]
          }
        }

        console.log("sumid in check: " + sumId)
        console.log("glid in check: " + glId)

        if(sumId <= glId){
          return false
        }else{
          return true
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

<style>
.shake {
    animation: shakeAnim 1s;
}

.cup-look{
    transform: translateY(55px);
    animation: lookAnim 1s;
    animation-fill-mode: forwards;
}
.cup-look-close{
    transform: translateY(55px);
    animation: lookCloseAnim 1s;
}


@keyframes shakeAnim {
    0% { transform: translateX(0); }
    25% { transform: translateX(-30px); }
    50% { transform: translateX(30px); }
    75% { transform: translateX(-30px); }
    100% { transform: translateX(0); }
}

@keyframes lookAnim {
    0% { transform: translateY(55px); }
    100% { transform: translateY(0px); }
}

@keyframes lookCloseAnim {
    0% { transform: translateY(0px); }
    100% { transform: translateY(55px); }
}
</style>