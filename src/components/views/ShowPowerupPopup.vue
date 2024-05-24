

<template>
  <HelpPopup v-if="helpShow" :show="helpShow" @close="helpClosed" :pid="helpPid"/>
  <div>
    <div v-if="showAnim" class="modal-mask-saved">
      <div class="modal-wrapper-saved">
        <div class="modal-container-saved" style="background: #00000022">
          <div style="justify-content: center">
            <div class="center full-size" style="margin-top: 20px">
              <div style="margin-bottom: 200px">
                <transition name="powertext">
                  <div class="center-horizontal" v-if="showAnimText">
                    <img :src="'../src/assets/pb/' + pb + '.png'" class="pb pointer"/>
                    <div style="width: 20px"></div>
                    <h1 class="white">{{player}} nutzt diesen Powerup</h1>
                  </div>
                </transition>
                <transition name="poweritem">
                  <div class="center-horizontal" v-if="showAnimPowerup">
                    <PowerupView :title="powerup" :img="pid" :active="true" :enabled="false" @help="helpClicked"/>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>

import UIButton from "@/components/views/UIButton.vue";
import langDE from "../../assets/langDE.json"
import langEN from "../../assets/langEN.json"
import PowerupView from "@/components/views/PowerupView.vue";
import HelpPopup from "@/components/views/HelpPopup.vue";
import {nextTick} from "vue";

export default {
  name: "Showpowertext",
  components: {HelpPopup, PowerupView, UIButton},

  props: {
    show: Boolean,
    player: String,
    pb: String,
    powerup: String,
    pid: String
  },
  data(){
    return{
      names: [],
      lang: langEN,
      showAnimText: false,
      showAnimPowerup: false,
      showAnim: false,
      helpPid: "",
      helpShow: false
    }
  },


  created() {

  },

  mounted() {
    if(this.getCookies("lang") === null || this.getCookies("lang") === "en"){
      this.lang = langEN
    }else{
      this.lang = langDE
    }
  },

  methods: {
    playLeaveAnim(){
      this.showAnimText = false
      this.showAnimPowerup = false
    },

    playEnterAnim(){
      this.showAnim = true
      nextTick(() => {
        this.showAnimText = true
        this.showAnimPowerup = true
      })
      setTimeout(() => {
        this.playLeaveAnim()
        setTimeout(() => {
          this.showAnim = false
        },900)
      },2000)
    },

    helpClosed(){
      this.helpShow = false
    },

    helpClicked(pid){
      this.helpPid = pid
      this.helpShow = true
    },

    getCookies(key){
      return this.$cookies.get(key);
    },
    setCookies(key, value){
      return this.$cookies.set(key, value, 2147483647);
    },
  },

}
</script>

<style>
.modal-mask-saved {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}

.modal-wrapper-saved {
  display: table-cell;
}

.modal-container-saved {
  display: block;
  margin: 0px auto;
  padding: 5px 5px;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.powertext-leave-from{
  transform: translateX(0px);
  opacity: 1;
}
.powertext-leave-to{
  transform: translateX(500px);
  opacity: 0;
}
.powertext-leave-active {
  transition: all 0.8s ease-in;
}

.powertext-enter-from{
  transform: translateX(-500px);
  opacity: 0;
}
.powertext-enter-to{
  transform: translateX(0px);
  opacity: 1;
}
.powertext-enter-active {
  transition: all 0.8s ease-out;
}

.poweritem-leave-from{
  transform: translateX(0px);
  opacity: 1;
}
.poweritem-leave-to{
  transform: translateX(-500px);
  opacity: 0;
}
.poweritem-leave-active {
  transition: all 0.8s ease-in;
}

.poweritem-enter-from{
  transform: translateX(500px);
  opacity: 0;
}
.poweritem-enter-to{
  transform: translateX(0px);
  opacity: 1;
}
.poweritem-enter-active {
  transition: all 0.8s ease-out;
}


@media (max-width: 740px) {
/*
  .modal-container-saved{
    width: 90vw;
  }*/

}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}


.modal-enter-from .modal-container-saved,
.modal-leave-to .modal-container-saved {
  opacity: 0;
}
</style>