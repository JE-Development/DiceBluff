

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask-saved">
      <div class="modal-wrapper-saved">
        <div class="modal-container-saved" style="background: #00000022">
          <div style="justify-content: center">
            <div class="center full-size" style="margin-top: 20px">
              <div>

                <h1 class="white">{{headline}}</h1>
                <div class="button-layout center-horizontal">
                  <UIButton :title="lang.gamePage.cancel" @click="cancelled" color="fifth-color-background"/>
                </div>

                <div class="center-horizontal" v-if="names.length === 0">
                  <h2 class="red">{{errorNoPlayer}}</h2>
                </div>

                <div style="height: 20px"></div>
                <div class="button-layout center-horizontal" v-for="(dat) in names">
                  <UIButton :title="dat" @click="click(dat)" color="prim-color-background"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>



<script>

import UIButton from "@/components/views/UIButton.vue";
import langDE from "../../assets/langDE.json"
import langEN from "../../assets/langEN.json"

export default {
  name: "PlayerSelectPopup",
  components: {UIButton},

  props: {
    show: Boolean,
    players: Array,
    errorNoPlayer: String,
    headline: String
  },
  data(){
    return{
      names: [],
      lang: langEN,
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

    for(let i = 0; i < this.players.length; i++){
      if(!this.players[i].loose){
        this.names.push(this.players[i].name)
      }
    }
  },

  methods: {
    onClose(){
      this.$emit("close")
    },
    getCookies(key){
      return this.$cookies.get(key);
    },
    setCookies(key, value){
      return this.$cookies.set(key, value, 2147483647);
    },

    click(dat){
      this.$emit("clicked", dat)
    },
    cancelled(){
      this.$emit("cancelled")
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
  transition: opacity 0.3s ease;
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
  transition: all 0.3s ease;
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