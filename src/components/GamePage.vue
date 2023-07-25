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
        />
    </div>

    <div class="center-horizontal" v-if="globalDice !== ''">
        <dice
            :num="globalDice"
            :mode="globalMode"
        />
    </div>

    <div class="relative center-horizontal">
        <div class="absolute">
            <img :src="src1" class="dice-image"/>
            <img :src="src2" class="dice-image"/>
        </div>
        <div :class="shakeAnimationActive ? 'shake' : ''">
            <img src="../assets/cup.png" class="cup-image" ref="cup" />
        </div>
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

        <div class="absolute">
            <DiceLayout/>
        </div>

    </div>

</template>


<script>
import PlayerView from "@/components/views/PlayerView.vue";
import EventBus from "@/components/code/EventBusEvent";
import DiceLayout from "@/components/views/DiceLayout.vue";
import Dice from "@/components/views/Dice.vue";

export default {
    //npm run dev | npm run build
    name: "GamePage",
    components: {Dice, DiceLayout, PlayerView},
    data() {
        return {
            names: [],
            isHost: false,
            socket: null,
            turn: "",
            playerTurn: false,
            dice: "null",
            shakeAnimationActive: false,
            isDrop: true,
            isReveal: true,
            isView: true,
            isMove: true,
            isDiceVisible: false,
            src1: "",
            src2: "",
            loggedDiceNum: "",
            loggedDiceMode: "",
            error: "",
            globalDice: "",
            globalMode: "",
            selfTurn: true,
            allowedLookedAnim: true
        };
    },

    created() {

        EventBus.addEventListener('dice-num', (event) => {
            this.loggedDiceNum = event.data
            this.isMove = true
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

        });

        this.socket.addEventListener('message', (event) => {
            const message = event.data;
            let check = message.split("---")
            console.log(message)
            if(check[0] === "engine"){
                if(check[1] === "players"){
                    let split =  check[2].split(";;;")
                    this.names = []
                    for(let i = 0; i < split.length; i++){
                        let data
                        if(this.turn === split[i]){
                            data = {
                                name: split[i],
                                turn: true
                            }
                        }else{
                            data = {
                                name: split[i],
                                turn: false
                            }
                        }
                        this.names.push(data)
                    }
                }else if(check[1] === "start"){
                    if(check[2] === "true"){

                    }else if(check[2] === "false"){
                        this.stopGame()
                    }
                }else if(check[1] === "turn"){
                    if(check[2] === "undefined"){
                        this.socket.send("engine;;;setTurnFirst");
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

                    }else{
                        let trim = check[2].split(";")
                        this.globalDice = trim[0]
                        this.globalMode = trim[1]
                    }
                }else if(check[1] === "next"){
                    if(check[2] === "true"){
                        if(this.isDrop){
                            this.isReveal = true
                        }
                        if(this.selfTurn){
                            this.selfTurn = false
                            this.isDrop = true
                        }
                    }
                }else if(check[1] === "looked"){
                    if(!this.playerTurn){
                        if(check[2] === "true"){
                            if(this.allowedLookedAnim){
                                this.allowedLookedAnim = false
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
                            if(this.$refs.cup.className.includes("cup-look")){
                                this.$refs.cup.className = this.$refs.cup.className.replace("cup-look", "cup-look-close")
                            }
                            this.allowedLookedAnim = true
                        }
                    }
                }else if(check[1] === "shake"){
                    this.startShakeAnimation()
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
            this.getPlayers()
            this.isStop()
            this.isTurn()
            this.isDice()
            this.isDiceVote()
            this.hasLooked()
        },

        onClickStop(){
            this.$router.push('/player');
            this.socket.send("engine;;;stopGame");
        },

        hasLooked(){
            this.socket.send("ping;;;hasLooked");
        },

        isDice(){
            this.socket.send("ping;;;getDice");
        },

        isDiceVote(){
            this.socket.send("ping;;;getVotedDice");
        },

        isStop(){
            this.socket.send("ping;;;isStarted");
        },

        isTurn(){
            this.socket.send("ping;;;getTurn");
        },

        stopGame(){
            this.$router.push('/player');
        },

        onClickLeave(){
            this.socket.send("register;;;removePlayer;;;" + this.getCookies("username"));
            this.$router.push('/');
        },

        setTurn(player){
            if(this.getCookies("username") === player){
                this.playerTurn = true
                this.selfTurn = false
            }else{
                this.playerTurn = false
                this.selfTurn = true
            }
            this.turn = player
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
                this.error = ""
                let voted = this.loggedDiceNum + ";" + this.loggedDiceMode
                this.socket.send("engine;;;setVotedDice;;;" + voted);

                let newName = ""

                for(let i = 0; i < this.names.length; i++){
                    let name = this.names[i].name
                    if(name === this.turn){
                        if(i === this.names.length-1){
                            newName = this.names[0].name
                        }else{
                            let index = i + 1
                            newName = this.names[index].name
                        }
                    }
                }

                this.socket.send("engine;;;setPlayerTurn;;;" + newName);
                this.isDiceVisible = false
                this.isMove = false
                this.loggedDiceMode = ""
                this.loggedDiceNum = ""

                if(this.$refs.cup.className.includes("cup-look")){
                    this.$refs.cup.className = this.$refs.cup.className.replace("cup-look", "cup-look-close")
                }

                this.socket.send("engine;;;setLooked;;;false");


            }
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
            if(this.$refs.cup.className.includes("cup-look-close")){
                this.$refs.cup.className = this.$refs.cup.className.replace("cup-look-close", "cup-look")
            }else{
                this.$refs.cup.className = this.$refs.cup.className + " cup-look"
            }

            this.socket.send("engine;;;setLooked;;;true");


        },

        onClickReveal(){

        },

        startShakeAnimation() {
            this.shakeAnimationActive = true;
            setTimeout(() => {
                this.shakeAnimationActive = false;
            }, 1000);
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