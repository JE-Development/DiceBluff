<template>
    <div class="button-layout center-horizontal">
        <button class="register-button center-horizontal" @click="onClickLeave">
            <p style="margin-top: 5px">Spiel verlassen</p>
        </button>
    </div>

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

export default {
    //npm run dev | npm run build
    name: "PlayerPage",
    components: {PlayerView},
    data() {
        return {
            names: [],
            isHost: false,
            socket: null
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
            console.log('WebSocket-Verbindung geöffnet');
            this.getPlayers()

            this.startCall()

        });

        this.socket.addEventListener('message', (event) => {
            const message = event.data;
            let check = message.split("---")
            if(check[0] === "engine"){
                if(check[1] === "players"){
                    let split =  check[2].split(";;;")
                    this.names = split
                }else if(check[1] === "start"){
                    if(check[2] === "true"){
                        this.startGame()
                    }else if(check[2] === "false"){

                    }
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
        startGame(){
            this.$router.push('/game');
        },

        startCall(){
            this.getPlayers()
        },

        onClickStart(){
            this.$router.push('/game');
            this.socket.send("engine;;;startGame");
        },

        eventClose(){
            this.socket.send("register;;;removePlayer;;;" + this.getCookies("username"));
        },

        onClickLeave(){
            this.socket.send("register;;;removePlayer;;;" + this.getCookies("username"));
            window.open("http://127.0.0.1:5173/#/", '_self');
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