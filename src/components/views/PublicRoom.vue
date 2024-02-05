<template>

    <div class="prim-color-background round-corner pointer public-room center-vertical texture shadow"  @click="clicked">
      <div style="width: 70%" class="flex">
        <div style="width: 10px"></div>
        <h2>{{hoster}}</h2>
      </div>
      <div style="width: 30%" class="center">
        <img :src="'../../src/assets/pb/' + this.pb + '.png'" style="width: 35px; height: 35px; border-radius: 50%">
        <div style="width: 5px"></div>
        <h2>{{playerCount}}</h2>
      </div>
    </div>

</template>


<script>

export default {
    name: "PublicRoom",
    data() {
        return {
        };
    },

    props:{
        hoster: String,
        playerCount: String,
      rc: String,
      pb: String
    },

    created() {
    },

    mounted() {
    },

    updated() {
    },

    methods: {

      clicked(){
        this.$emit("clicked", this.rc)
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