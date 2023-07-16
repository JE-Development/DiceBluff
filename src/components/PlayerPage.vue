<template>

<div class="center-horizontal">
    <PlayerView
        v-for="(dat) in names"
        :name="dat"

    />
</div>

    <div class="button-layout center-horizontal" v-if="isHost">
        <button class="register-button center-horizontal" @click="onClickStart">
            <p style="margin-top: 5px">Spiel starten</p>
        </button>
    </div>
    <div v-else class="center-horizontal">
        <h1>Warte auf Spieler...</h1>
    </div>

</template>


<script>
import EventBus from "./code/EventBusEvent";
import PlayerView from "@/components/views/PlayerView.vue";
import {Engine} from "@/components/code/Engine";

export default {
    //npm run dev | npm run build
    name: "PlayerPage",
    components: {PlayerView},
    data() {
        return {
            engine: new Engine(),
            names: [],
            isHost: false
        };
    },

    created() {

        EventBus.addEventListener('players', (event) => {
            this.names = event.data
        })

        EventBus.addEventListener('game-start', (event) => {
            if(event.data){
                this.startGame()
            }else{
                //console.log("not started: " + event.data)
            }
        })
    },
    mounted() {
        if(this.getCookies("host") === "true"){
            this.isHost = true
        }

        window.addEventListener('beforeunload', this.eventClose);
        this.getPlayers()

        this.startInterval()

    },

    beforeUnmount() {
        window.removeEventListener('beforeunload', this.eventClose);
    },


    unmounted() {
        this.startInterval()
    },


    methods: {

        getPlayers(){
            this.engine.getPlayers()
        },
        isStarted(){
            this.engine.isStarted()
        },
        startGame(){
            this.$router.push('/game');
        },

        eventClose(){
            this.stopInterval()
            this.engine.removePlayer(this.getCookies("username"))
        },

        startInterval(){
            this.playerInterval = setInterval(this.getPlayers, 5000)
            this.stInterval = setInterval(this.isStarted, 5000)
        },

        stopInterval() {
            clearInterval(this.playerInterval);
            clearInterval(this.stInterval);
        },
        onClickStart(){
            this.$router.push('/game');
            this.engine.startGame()
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