<template>

  <div class=" line3 powerup-border round-corner sec-color center-vertical pointer" @click="click" v-if="enabled">
    <img :src="'https://dicebluff.inforge.de/src/assets/powerups/' + img + '.png'" class="powerup-icon">
    <div style="font-size: 20px">{{title}}</div>
    <div style="width: 20px"></div>
  </div>
  <div class="line4 powerup-border round-corner center-vertical pointer" @click="click" v-else-if="active">
    <img :src="'https://dicebluff.inforge.de/src/assets/powerups/' + img + '.png'" class="powerup-icon">
    <div style="font-size: 20px">{{title}}</div>
    <div style="width: 20px"></div>
  </div>
  <div class="powerup-border powerup-grey round-corner center-vertical" v-else>
    <div class="powerup-icon"></div>
    <div style="font-size: 20px">{{title}}</div>
    <div style="width: 20px"></div>
  </div>
  <div class="center" style="margin-left: 10px">
    <img src="../../assets/help.png" style="height: 30px" @click="helpClicked" class="pointer">
  </div>

</template>


<script>

import HelpPopup from "@/components/views/HelpPopup.vue";

export default {
    name: "PowerupView",
  components: {HelpPopup},
    data() {
        return {
        };
    },

    props:{
        title: String,
      img: String,
      enabled: Boolean,
      active: Boolean
    },

    created() {
    },
    mounted() {
    },



    methods: {

        click(){
            this.$emit("clicked")
        },

      helpClicked(){
          this.$emit("help", this.img)
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