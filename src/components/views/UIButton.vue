<template>

  <button class="register-button center-horizontal texture" :class="color" @click="click">
    <p style="margin-top: 5px">{{title}}</p>
  </button>
  <button class="register-button center-horizontal shadow absolute on-bottom" @click="click">

  </button>

</template>


<script>

export default {
    name: "UIButton",
    data() {
        return {
        };
    },

    props:{
        title: String,
      color: String
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