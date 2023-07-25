<template>

<div class="player-card center-horizontal">
    <div>
        <div class="center-horizontal"><img src="../../assets/default_pb.png" class="profile-picture"/></div>
        <div class="center-horizontal">
            <h3 v-if="turn" class="green">{{name}}</h3>
            <h3 v-else>{{name}}</h3>
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
        };
    },

    props:{
        name: String,
        dice: String,
        turn: Boolean,
    },

    created() {

    },
    mounted() {

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