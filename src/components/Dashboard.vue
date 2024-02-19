<template>

  <div class="center-horizontal" v-if="!isLogin">
    <div>
      <div style="height: 200px"></div>
      <input
          ref="keyinput"
          :value="key"
          placeholder="Dashboard Key"
          class="register-input shadow texture"/>
      <div style="height: 20px"></div>
      <div class="center-horizontal">
        <UIButton title="Login" @click="onClickLogin" color="prim-color-background"/>
      </div>
      <div class="center-horizontal">
        <h2 class="red">{{errorText}}</h2>
      </div>
    </div>
  </div>
  <div v-if="isLogin">
    <div class="center-horizontal">
      <div class="dashboard-room-layout">
        <div v-if="rooms.length === 0">
          <h1 class="red">
            No Rooms
          </h1>
        </div>
        <DashboardRoom
            v-for="(dat) in rooms"
            :hoster="dat.hoster"
            :playerCount="dat.playerCount"
            :rc="dat.rc"
            :vis="dat.vis"
            @delete="deleteClicked"
            @join="joinClicked"
            @watch="watchClicked"
            @selected="selectedClicked"
        />
      </div>
    </div>
    <div style="width: 200px; background: rgba(118,255,186,0.24)">
      <h3>Values</h3>
      <p class="white">start: <span class="dark-blue">{{valueInfo.start}}</span></p>
      <p class="white">turn: <span class="dark-blue">{{valueInfo.turn}}</span></p>
      <p class="white">winner: <span class="dark-blue">{{valueInfo.winner}}</span></p>
      <p class="white">heartcount: <span class="dark-blue">{{valueInfo.heartcount}}</span></p>
      <p class="white">ghostmode: <span class="dark-blue">{{valueInfo.ghostmode}}</span></p>
      <p class="white">usePowerups: <span class="dark-blue">{{valueInfo.usePowerups}}</span></p>
      <p class="white">loggedDice: <span class="dark-blue">{{valueInfo.loggedDice}}</span></p>
    </div>
  </div>

</template>


<script>

import UIButton from "@/components/views/UIButton.vue";
import DashboardRoom from "@/components/views/DashboardRoom.vue";

export default {
    //npm run dev | npm run build
    name: "Dashboard",
    components: {DashboardRoom, UIButton},
    data() {
        return {
          key: "",
          isLogin: false,
          errorText: "",
          rooms: [],
          rc: "",
          valueInfo: {}
        };
    },

    created() {
      this.valueInfo = {
        start: "",
        turn: "",
        winner: "",
        heartcount: "",
        ghostmode: "",
        usePowerups: "",
        loggedDice: "",
      }
    },
    mounted() {

      this.key = this.getCookies("dashboard-key")

        window.addEventListener('beforeunload', this.eventClose);


        this.socket = new WebSocket(import.meta.env.VITE_SERVER_URL);

        this.socket.addEventListener('open', (event) => {
          console.log("socket connected")



        });

        this.socket.addEventListener('message', (event) => {
          const message = JSON.parse(event.data)
          console.log(message)
          if(message.func === "error"){

            console.error(message.text)

          }else if(message.func === "login"){
            if(message.status){
              this.login()
            }else{
              this.errorText = "Wrong Key"
            }
          }else if(message.func === "allRooms"){
            let r = message.rooms
            for(let i = 0; i < r.length; i++){
              this.rooms.push(r[i])
            }
          }else if(message.func === "values"){
            this.valueInfo.start = message.start
            this.valueInfo.turn = message.turn
            this.valueInfo.winner = message.winner
            this.valueInfo.heartcount = message.heartcount
            this.valueInfo.ghostmode = message.ghostmode
            this.valueInfo.usePowerups = message.usePowerups
            this.valueInfo.loggedDice = message.loggedDice
          }
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
        //data.rc = this.getCookies("rc")
        this.socket.send(JSON.stringify(data))
      },

      onClickLogin(){
        let dat = {
          type: "dashboard",
          func: "login",
          key: this.$refs.keyinput.value
        }
        this.send(dat)
      },

      login(){
        this.setCookies("dashboard-key", this.$refs.keyinput.value)
        this.isLogin = true

        let dat = {
          type: "dashboard",
          func: "getAllRooms"
        };
        this.send(dat);
      },

      deleteClicked(rc){

        let dat = {
          type: "engine",
          func: "stop",
          rc: rc
        }
        this.send(dat)

        setTimeout(() => {
          dat = {
            type: "register",
            func: "kickAllPlayers",
            rc: rc
          }
          this.send(dat);
          dat = {
            type: "register",
            func: "clearPlayer",
            rc: rc
          }
          this.send(dat);
        },500)
      },

      joinClicked(rc){
        this.setCookies("host", "false")
        this.setCookies("rc", rc)
        this.addPlayer(rc)
        this.$router.push('/player');
      },

      watchClicked(rc){
        this.setCookies("host", "false")
        this.setCookies("rc", rc)
        this.$router.push('/game');
        let dat = {
          type: "dashboard",
          func: "addWatcher",
          watcher: this.getCookies("username"),
          rc: rc
        }
        this.send(dat)
      },

      selectedClicked(rc){
        this.rc = rc
        let dat = {
          type: "dashboard",
          func: "getCurrentValues",
          rc: rc
        }
        this.send(dat)
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