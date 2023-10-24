<template>

  <div class="center-horizontal">
    <div>
      <PublicRoom
          v-for="(dat) in rooms"
          :hoster="dat.hoster"
          :playerCount="dat.playerCount"
          :rc="dat.rc"
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

export default {
    //npm run dev | npm run build
    name: "PublicPage",
    components: {PublicRoom, PlayerView},
    data() {
        return {
            rooms: [],
            socket: null,
          errorText: "",
          lang: langEN
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

        window.addEventListener('beforeunload', this.eventClose);


        this.socket = new WebSocket('ws://212.227.183.160:3000');

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
          console.log(message)
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