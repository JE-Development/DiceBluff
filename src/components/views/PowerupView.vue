<template>

  <div class="powerup-border round-corner sec-color texture center-vertical pointer" @click="click" v-if="enabled">
    <img :src="'https://dicebluff.inforge.de/src/assets/powerups/' + img + '.png'" class="powerup-icon">
    <div style="font-size: 20px">{{title}}</div>
    <div style="width: 20px"></div>
    <!--<img src="../../assets/help.png" style="height: 50%" @click="helpClicked">/!-->
  </div>
  <div class="powerup-border round-corner prim-color-background texture center-vertical pointer" @click="click" v-else-if="active">
    <img :src="'https://dicebluff.inforge.de/src/assets/powerups/' + img + '.png'" class="powerup-icon">
    <div style="font-size: 20px">{{title}}</div>
    <div style="width: 20px"></div>
    <!--<img src="../../assets/help.png" style="height: 50%" @click="helpClicked">/!-->
  </div>
  <div class="powerup-border powerup-grey round-corner texture center-vertical" v-else>
    <div class="powerup-icon"></div>
    <div style="font-size: 20px">{{title}}</div>
    <div style="width: 20px"></div>
    <!--<img src="../../assets/help.png" style="height: 50%" @click="helpClicked">/!-->
  </div>

</template>


<script>

export default {
    name: "PowerupView",
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
        this.$emit("help", img)
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