<template>

    <button class="game-button-default center" @click="click" :class="color">
        <p style="margin-top: 0px; margin-bottom: 0px;" class="black">{{ title }}</p>
    </button>
    <button class="game-button-default center-horizontal absolute on-bottom" @click="click">

    </button>

</template>


<script>

export default {
    name: "GameButton",
    data() {
        return {
        };
    },

    props: {
        title: String,
        color: String
    },

    created() {
    },
    mounted() {
    },



    methods: {

        click() {
            this.$emit("click")
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