<style>
.tut-box {
    width: 200px;
}
</style>

<template>

    <div class="tut-box">
        <p>{{ text }}</p>

        <button class="tutorial-button line1 center" @click="click" v-if="withButton">
            <p style="margin-top: 0px; margin-bottom: 0px;" class="black">{{ lang.playerPage.tutorialNextButton }}</p>
        </button>
    </div>

</template>


<script>

export default {
    name: "GameButton",
    data() {
        return {
        };
    },

    props: {
        text: String,
        withButton: Boolean,
        lang: Object
    },

    created() {
    },
    mounted() {
    },



    methods: {

        click() {
            this.$emit("clicked")
        },


        getCookies(key) {
            return this.$cookies.get(key);
        },
        setCookies(key, value) {
            return this.$cookies.set(key, value, 2147483647);
        },
    }
}
</script>