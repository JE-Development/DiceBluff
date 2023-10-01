<template>
  <ProfilePopup :show="pbShow" @close="pbClose"/>
<div class="center full-size">
    <div style="margin-bottom: 300px">

        <div class="center-horizontal">
            <h1>Dice Bluff</h1>
        </div>
      <div class="center-horizontal">
        <img :src="srcPb" class="pb pointer" @click="pbShow = true"/>
      </div>
      <div style="height: 20px"></div>
        <div>
            <input
                ref="usernameinput"
                :value="username"
                placeholder="Nutzername"
                class="register-input"/>
        </div>
        <div style="margin-top: 10px"/>
        <div>
            <input
                ref="passinput"
                :value="pass"
                placeholder="Passwort"
                class="register-input"/>
        </div>
        <div style="margin-top: 10px"/>
        <div class="button-layout center-horizontal">
            <button class="register-button center-horizontal" @click="onClickJoin">
                <p style="margin-top: 5px">Spiel beitreten</p>
            </button>
        </div>
        <h2 class="red">{{unableMessage}}</h2>
    </div>
</div>

</template>


<script>

import ProfilePopup from "@/components/views/ProfilePopup.vue";

export default {
    //npm run dev | npm run build
    name: "Register",
  components: {ProfilePopup},
    data() {
        return {
            username: "",
            pass: "",
          srcPb: "",
          baseSrc: "../src/assets/pb/",
          pbList: ["bugs.png", "dog.png", "glow.png", "mike.png", "sigma.png", "sponge.png", "squid.png", "stick.png", "stick.png", "stonks.png", "sus.png"],
            socket: null,
            messages: [],
            newMessage: '',
            unableMessage: "",
            clicked: false,
          pbShow: false
        };
    },

    created() {
      this.setPb()
    },

    beforeUnmount() {
        window.removeEventListener('beforeunload', this.eventClose);
    },


    unmounted() {
        this.socket.close()
    },

    mounted() {
        window.addEventListener('beforeunload', this.eventClose);

        this.socket = new WebSocket('ws://212.227.183.160:3000');

        this.socket.addEventListener('open', (event) => {
            console.log('WebSocket-Verbindung geöffnet');
            this.socket.send("register;;;removePlayer;;;" + this.getCookies("username") + ",,," + this.getCookies("pb"));
        });


        this.socket.addEventListener('message', (event) => {
            const message = event.data;
            let check = message.split("---")
            console.log(message)
            if(check[0] === "engine"){
                if(check[1] === "start"){
                    if(check[2] === "true"){
                        this.joinUnable()
                        this.clicked = false
                    }else if(check[2] === "false" || check[2] === "undefined"){
                        if(this.clicked){
                            this.join()
                        }
                    }
                }
            }
        });

        this.username = this.getCookies("username")
        this.pass = this.getCookies("pass")

    },
    methods: {

        onClickJoin(){
            this.clicked = true
            this.socket.send("ping;;;isStarted");
        },

        join(){
            this.unableMessage = ""

            let username = this.$refs.usernameinput.value;
            let pass = this.$refs.passinput.value;

            if(pass === "lost mafia"){
                this.setCookies("username", username)
                this.setCookies("pass", pass)
                this.setCookies("host", "false")

                this.registerPlayer()

                this.$router.push('/player');
            }else if(pass === "lost mafia host"){
                this.setCookies("username", username)
                this.setCookies("pass", pass)
                this.setCookies("host", "true")

                this.registerPlayer()

                this.$router.push('/player');
            }
        },

        joinUnable(){
            this.unableMessage = "Spiel ist bereits gestartet."
        },

        registerPlayer(){
            this.socket.send("register;;;addPlayer;;;" + this.$refs.usernameinput.value + ",,," + this.getCookies("pb"));
        },

        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },
        eventClose(){
            this.socket.close()
        },
      setPb(){
        if(this.getCookies("pb") === null){
          let random = Math.floor(Math.random() * this.pbList.length)
          let item = this.pbList[random]
          this.srcPb = this.baseSrc + item
          this.setCookies("pb", this.pbList[random].split(".")[0])
        }else{
          this.srcPb = this.baseSrc + this.getCookies("pb") + ".png"
        }
      },
      pbClose(){
          this.pbShow = false
        this.setPb()
      }
    }
}
</script>