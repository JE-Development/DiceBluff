<template>
  <ProfilePopup :show="pbShow" @close="pbClose"/>
<div class="center-horizontal full-size">
    <div>

        <div class="center-horizontal">
          <img src="../assets/logo.png" style="width: 400px"/>
        </div>
      <div class="center-horizontal">
        <img :src="srcPb" class="pb pointer" @click="pbShow = true"/>
      </div>
      <div style="height: 20px"></div>
        <div class="center-horizontal">
          <div>
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
          </div>
        </div>
        <div style="margin-top: 10px"/>
        <div class="center-horizontal">
            <button class="register-button center-horizontal" @click="onClickJoin">
                <p style="margin-top: 5px">Spiel beitreten</p>
            </button>
        </div>
      <div style="height: 20px"></div>
      <div class="center-horizontal">
        <button class="register-button center-horizontal sec-color" @click="onClickInstruction">
          <p style="margin-top: 5px">Spielanleitung</p>
        </button>
      </div>
        <div class="center-horizontal">
          <h2 class="red">{{unableMessage}}</h2>
        </div>
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
          pbList: ["bugs", "dog", "glow", "mike", "sigma", "sponge", "squid", "stick",
            "stick", "stonks", "sus", "calling", "pou", "futurama", "sweat", "confused"],
            socket: null,
            messages: [],
            newMessage: '',
            unableMessage: "",
            clicked: false,
          pbShow: false,
          isStarted: false,
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

          let dat = {
            type: "register",
            func: "removePlayer",
            player: this.getCookies("username"),
            pb: this.getCookies("pb")
          }
          this.socket.send(JSON.stringify(dat));

          const message = {
            type: "ping",
            func: "isStarted"
          };
          this.socket.send(JSON.stringify(message));

        });


        this.socket.addEventListener('message', (event) => {

          const message = JSON.parse(event.data)

          console.log(message)
          if(message.func === "error"){
            console.error(message.text)
          }else if(message.func === "isStarted"){
            if(message.text === true){
              this.isStarted = true
            }else if(message.text === false || message.text === "undefined"){
              this.isStarted = false
            }

          if(message.func === "error"){
            console.error(message.text)
          }else if(message.func === "isStarted"){
            console.log(message.text)
          }
          }
        });

        this.username = this.getCookies("username")
        this.pass = this.getCookies("pass")

    },

    methods: {

        onClickJoin(){
            this.clicked = true
          if(this.isStarted === true){
            this.joinUnable()
            this.clicked = false
          }else{
            if(this.clicked){
              this.join()
            }
          }
        },

      addPlayer(){
        const message = {
          type: "register",
          func: "addPlayer",
          player: this.getCookies("username"),
          pb: this.getCookies("pb")
        };
        this.socket.send(JSON.stringify(message));
      },

        join(){
            this.unableMessage = ""

            let username = this.$refs.usernameinput.value;
            let pass = this.$refs.passinput.value;

            if(pass === "lost mafia"){
                this.setCookies("username", username)
                this.setCookies("pass", pass)
                this.setCookies("host", "false")
            }else if(pass === "lost mafia host"){
                this.setCookies("username", username)
                this.setCookies("pass", pass)
                this.setCookies("host", "true")

            }

          this.addPlayer()
          this.$router.push('/player');

        },

        joinUnable(){
            this.unableMessage = "Spiel ist bereits gestartet."
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
          this.srcPb = this.baseSrc + item + ".png"
          this.setCookies("pb", this.pbList[random].split(".")[0])
        }else{
          this.srcPb = this.baseSrc + this.getCookies("pb") + ".png"
        }
      },
      pbClose(){
          this.pbShow = false
        this.setPb()
      },

      onClickInstruction(){
        this.$router.push('/instruction');
      }
    }
}
</script>