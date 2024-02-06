<template>
  <LangSelection @click="langClicked" :lang="lang.langVis"/>
  <AudioSettings @click="audioSettingsClicked" :status="audioSettingsStatus"/>

  <div class="center-horizontal">
    <div>
      <div v-if="rooms.length === 0">
        <h1 class="red">
          {{lang.misc.noPublicRooms}}
        </h1>
      </div>
      <PublicRoom
          v-for="(dat) in rooms"
          :hoster="dat.hoster"
          :playerCount="dat.playerCount"
          :rc="dat.rc"
          :pb="dat.pb"
          @clicked="clicked"
      />
    </div>
  </div>

</template>


<script>
import EventBus from "./code/EventBusEvent";
import PlayerView from "@/components/views/PlayerView.vue";
import {nextTick} from "vue";
import langDE from "../assets/langDE.json"
import langEN from "../assets/langEN.json"
import PublicRoom from "@/components/views/PublicRoom.vue";
import LangSelection from "@/components/views/LangSelection.vue";
import AudioSettings from "@/components/views/AudioSettings.vue";

export default {
    //npm run dev | npm run build
    name: "PublicPage",
    components: {AudioSettings, LangSelection, PublicRoom, PlayerView},
    data() {
        return {
            rooms: [],
            socket: null,
          errorText: "",
          lang: langEN,
          audioSettingsStatus: true
        };
    },

    created() {

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

        window.addEventListener('beforeunload', this.eventClose);


        this.socket = new WebSocket(import.meta.env.VITE_SERVER_URL);

        this.socket.addEventListener('open', (event) => {
          console.log("socket connected")
          let dat = {
            type: "ping",
            func: "getPublicRooms"
          };
          this.send(dat);

        });

        this.socket.addEventListener('message', (event) => {
          const message = JSON.parse(event.data)
          //console.log(message)
          if(message.func === "error"){

            console.error(message.text)

          }else if(message.func === "allPublicRooms"){
            let r = message.rooms
            for(let i = 0; i < r.length; i++){
              this.rooms.push(r[i])
            }
          }else if(message.func === "yesRc"){
            this.$router.push('/player');
          }else if(message.func === "noRc"){
            //this.unableMessage = this.lang.register.wrongRoomCode
          }
          console.log(this.rooms)
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

      eventClose(){
        let dat = {
          type: "register",
          func: "removePlayer",
          player: this.getCookies("username"),
          pb: this.getCookies("pb")
        }
        this.send(dat);
      },

      send(data){
        data.rc = this.getCookies("rc")
        this.socket.send(JSON.stringify(data))
      },

      clicked(rc){
        this.setCookies("host", "false")
        this.setCookies("rc", rc)
        this.addPlayer(rc)
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





      getCookies(key){
        return this.$cookies.get(key);
      },
      setCookies(key, value){
        return this.$cookies.set(key, value, 2147483647);
      },
    }
}
</script>