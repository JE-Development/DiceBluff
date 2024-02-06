<template>

    <div class="absolute pointer" style="margin-left: 90px">
      <div class="audio-border">
        <img src="../../assets/speaker.png" v-if="status">
        <img src="../../assets/speaker-mute.png" v-else>
      </div>
    </div>

</template>


<script>

export default {
    name: "AudioSettings",
    data() {
        return {
        };
    },

    props:{
      status: Boolean
    },

    created() {
    },

    mounted() {
    },


    methods: {

        click(){
          this.$emit("click")
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