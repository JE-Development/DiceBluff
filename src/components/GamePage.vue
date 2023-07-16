<template>

    <div class="button-layout center-horizontal" v-if="isHost">
        <button class="register-button center-horizontal" @click="onClickStop">
            <p style="margin-top: 5px">Spiel stoppen</p>
        </button>
    </div>

    <div class="center-horizontal">
        <PlayerView
            v-for="(dat) in names"
            :name="dat"

        />
    </div>

</template>


<script>
import PlayerView from "@/components/views/PlayerView.vue";
import {Engine} from "@/components/code/Engine";
import EventBus from "@/components/code/EventBusEvent";

export default {
    //npm run dev | npm run build
    name: "GamePage",
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

        EventBus.addEventListener('is-running', (event) => {
            if(event.data){
                //this.startGame()
            }else{
                this.stopGame();
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
        this.stopInterval()
    },
    methods: {
        getPlayers(){
            this.engine.getPlayers()
        },
        eventClose(){
            this.stopInterval()
            this.engine.removePlayer(this.getCookies("username"))
        },

        startInterval(){
            this.playerInterval = setInterval(this.getPlayers, 5000)
            this.breakInterval = setInterval(this.isStop, 5000)
        },

        stopInterval() {
            clearInterval(this.playerInterval);
            clearInterval(this.breakInterval);
        },

        onClickStop(){
            this.$router.push('/player');
            this.engine.stopGame()
        },

        isStop(){
            this.engine.isStop()
        },
        stopGame(){
            this.$router.push('/player');
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