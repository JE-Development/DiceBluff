<template>

    <div class="absolute pointer center" style="margin-left: 90px; z-index: 999">
      <div class="audio-border" @click="click">
        <img src="../../assets/speaker.png" v-if="volume > 0">
        <img src="../../assets/speaker-mute.png" v-else>
      </div>
      <div class="center" v-if="sliderShow">
        <div style="width: 10px"></div>
        <div class="audio-slider-border">
          <vue-slider v-model="volume" color="#ffa600" track-color="#FEFEFE" @drag-end="dragEnd"/>
        </div>
        <div style="width: 5px"></div>
        <div>
          {{volume}}%
        </div>
      </div>
    </div>

</template>


<script>

export default {
    name: "AudioSettings",
    data() {
        return {
          volume: 100,
          sliderShow: false,
        };
    },


    created() {
    },

    mounted() {
      if(this.getCookies("volume") === null){
        this.volume = 100
        this.setCookies("volume", "100")
      }else{
        this.volume = this.getCookies("volume")
      }
    },


    methods: {

      dragEnd(){
        this.setCookies("volume", this.volume + "")
      },

        click(){
          this.sliderShow = !this.sliderShow
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