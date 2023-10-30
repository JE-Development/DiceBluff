<template>

    <div class="absolute pointer">
      <div class="lang-border">
        <img src="../../assets/lang_icon.svg" style="width: 30px">
        <h3 style="transform: translateY(-15px); margin-left: 5px">{{lang}}</h3>
      </div>
    </div>

</template>


<script>

export default {
    name: "LangSelection",
    data() {
        return {
        };
    },

    props:{
      lang: String
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