<template>

<div class="player-card center-horizontal">
    <div>
      <div class="center-horizontal">
        <div>
          <div class="center-horizontal">
            <img src="../../assets/crown.png" class="crown" v-if="winner" style="z-index: 100"/>
            <div class="player-card-space" v-else></div>
          </div>
          <div>
            <img :src="pb" class="pb absolute" style="width: 50px" v-if="!isSad"/>
            <img :src="pbSad" class="pb" style="width: 50px"/>
          </div>
        </div>
      </div>
      <div class="center-horizontal" style="height: 0px; margin-top: -10px; margin-bottom: 10px">
        <p class="white">{{winnerCount}}</p>
      </div>
        <div class="center-horizontal" style="height: 40px">
            <h3 v-if="loose" class="red">{{name}}</h3>
            <h3 v-else-if="turn" class="green">{{name}}</h3>
            <h3 v-else>{{name}}</h3>
        </div>
      <div class="center-horizontal">
        <img
            v-for="(dat) in heartlenght"
            src="../../assets/heart_texture.png" class="heart">
      </div>
        <h1 class="orange">{{dice}}</h1>
    </div>
</div>

</template>


<script>
export default {
    name: "PlayerView",
    data() {
        return {
          heartlenght: [],
          pb: "",
          pbSad: "",
        };
    },

    props:{
        name: String,
        dice: String,
        turn: Boolean,
        loose: Boolean,
      heart: Number,
      img: String,
      winner: Boolean,
      isSad: Boolean,
      winnerCount: Number
    },

  created() {

    },
    mounted() {
      this.pb = "../../src/assets/pb/" + this.img + ".png"
      this.pbSad = "../../src/assets/pb/sad/" + this.img + ".png"

      this.heartlenght = []
      for(let i = 0; i < this.heart; i++){
        this.heartlenght.push("sampel")
      }
    },
    methods: {


        getCookies(key){
            return this.$cookies.get(key);
        },
        setCookies(key, value){
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>