<template>
  <ProfilePopup :show="pbShow" @close="pbClose"/>
  <LangSelection @click="langClicked" :lang="lang.langVis"/>
  <AudioSettings/>
  <div class="center-horizontal full-size">
    <div>

      <div class="center-horizontal">
        <img src="../assets/logo_texture.png" style="width: 400px"/>
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
                :placeholder="lang.register.usernamePlaceholder"
                class="register-input shadow texture"/>
          </div>
        </div>
      </div>
      <div style="margin-top: 10px"/>
      <div class="center-horizontal">
        <div class="center-horizontal">
          <UIButton :title="lang.register.roomButton" @click="onClickRoom" color="third-color-background"/>
        </div>
        <div class="center-horizontal">
          <UIButton :title="lang.register.listButton" @click="onClickPublic" color="fourth-color-background"/>
        </div>
      </div>
      <div style="height: 40px"></div>
      <div class="center-horizontal">
        <UIButton :title="lang.register.gameInstructionsButton" @click="onClickInstruction" color="sec-color"/>
      </div>
      <div class="center-horizontal">
        <h2 class="red">{{unableMessage}}</h2>
      </div>
    </div>
  </div>

</template>


<script>

import ProfilePopup from "@/components/views/ProfilePopup.vue";
import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"
import LangSelection from "@/components/views/LangSelection.vue";
import UIButton from "@/components/views/UIButton.vue";
import AudioSettings from "@/components/views/AudioSettings.vue";

export default {
    //npm run dev | npm run build
    name: "Register",
  components: {AudioSettings, UIButton, LangSelection, ProfilePopup},
    data() {
        return {
            username: "",
            pass: "",
          srcPb: "",
          baseSrc: "../src/assets/pb/",
          pbList: import.meta.env.VITE_PB.split(","),
            socket: null,
            messages: [],
            newMessage: '',
            unableMessage: "",
            clicked: false,
          pbShow: false,
          isStarted: false,
          lang: langEN,
          audioSettingsStatus: true
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

      if(this.getCookies("lang") === null || this.getCookies("lang") === "en"){
        this.lang = langEN
      }else{
        this.lang = langDE
      }



        window.addEventListener('beforeunload', this.eventClose);

        this.socket = new WebSocket(import.meta.env.VITE_SERVER_URL);

        this.socket.addEventListener('open', (event) => {
          this.unableMessage = ""

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

      this.socket.addEventListener('error', (event) => {
        this.unableMessage = this.lang.register.serverDown

      });


        this.socket.addEventListener('message', (event) => {

          const message = JSON.parse(event.data)

          //console.log(message)
          if(message.func === "error"){
            console.error(message.text)
          }else if(message.func === "isStarted"){
            if(message.text === true){
              this.isStarted = true
            }else if(message.text === false || message.text === "undefined"){
              this.isStarted = false
            }
          }else if(message.func === "yesRc"){
            this.$router.push('/player');
          }else if(message.func === "noRc"){
            this.unableMessage = this.lang.register.wrongRoomCode
          }else if(message.func === "roomClosed"){
            this.$notify(this.lang.misc.roomClosed)
          }
        });

        this.username = this.getCookies("username")

    },

    methods: {


        onClickJoin(){
          let username = this.$refs.usernameinput.value
          this.setCookies("username", username)

            this.clicked = true
          if(this.isStarted === true){
            this.joinUnable()
            this.clicked = false
          }else{
            if(this.clicked){
              if(this.checkUsername()){
                if(this.$refs.passinput.value !== ""){
                  this.setCookies("host", "false")
                  this.setCookies("rc", this.$refs.passinput.value)
                  this.join(this.$refs.passinput.value)
                }else{
                  this.unableMessage = this.lang.register.noRoomCode
                }
              }
            }
          }
        },

      addPlayer(rc){
        const message = {
          type: "register",
          func: "addPlayer",
          player: this.getCookies("username"),
          pb: this.getCookies("pb"),
          rc: rc
        };
        this.socket.send(JSON.stringify(message));
      },

      hostPlayer(rc){
        const message = {
          type: "register",
          func: "addPlayerCreator",
          player: this.getCookies("username"),
          pb: this.getCookies("pb"),
          rc: rc
        };
        this.socket.send(JSON.stringify(message));
      },

        join(rc){
            this.unableMessage = ""

          this.addPlayer(rc)


        },

      createJoin(rc){
        this.unableMessage = ""

        let username = this.$refs.usernameinput.value

        this.setCookies("username", username)

        this.hostPlayer(rc)
        this.$router.push('/player');

      },

      createBotJoin(rc){
        this.unableMessage = ""

        let username = this.$refs.usernameinput.value

        this.setCookies("username", username)

        this.hostPlayer(rc)
        this.$router.push('/bot');

      },

      checkUsername(){
        if(this.$refs.usernameinput.value !== ""){
          return true
        }else{
          this.unableMessage = this.lang.register.noUsername
        }
        return false
      },

        joinUnable(){
            this.unableMessage = this.lang.register.gameStarted
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

      getRandomNumbers() {
        const min = 10000000;
        const max = 99999999;

        const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

        return randomNumber + "";
        //return "123456"
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


      pbClose(){
          this.pbShow = false
        this.setPb()
      },

      onClickInstruction(){
        this.$router.push('/instruction');
      },

      onClickRoom(){
          if(this.checkUsername()){
            this.setCookies("host", "true")
            let rc = this.getRandomNumbers()
            this.setCookies("rc", rc)
            this.createJoin(rc)
          }
      },

      onClickBot(){
        if(this.checkUsername()){
          this.setCookies("host", "true")
          let rc = this.getRandomNumbers()
          this.setCookies("rc", rc)
          this.createBotJoin(rc)
        }
      },

      onClickPublic(){
          if(this.checkUsername()){
            let username = this.$refs.usernameinput.value
            this.setCookies("username", username)
            this.$router.push('/public');
          }
      }
    }
}
</script>