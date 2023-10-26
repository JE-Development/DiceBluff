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
      <div>
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
        />
      </div>
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
        };
    },

    created() {

    },
    mounted() {

      this.key = this.getCookies("dashboard-key")

        window.addEventListener('beforeunload', this.eventClose);


        this.socket = new WebSocket('ws://212.227.183.160:3000');

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