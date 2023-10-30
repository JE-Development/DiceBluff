<template>

  <div style="height: 50px"></div>

    <div class="center-horizontal">
      <div class="prim-color-background round-corner dashboard-room center-vertical texture shadow">
        <div style="width: 70%" class="flex">
          <div style="width: 10px"></div>
          <h2>{{hoster}}</h2>
          <div style="width: 10px"></div>
          <h2 class="sec-color-text">{{rc}}</h2>
          <div style="width: 10px"></div>
          <h2 class="green" v-if="vis">Vis: True</h2>
          <h2 class="red" v-else>Vis: False</h2>
        </div>
        <div style="width: 30%" class="center">
          <img src="../../assets/default_pb.png" style="width: 35px; height: 35px">
          <div style="width: 5px"></div>
          <h2>{{playerCount}}</h2>
        </div>
      </div>
    </div>
  <div class="center-horizontal" style="margin-top: -20px">
    <button class="register-button center-horizontal texture prim-color-background shadow" @click="deleteClicked" style="width: 26%; margin-top: 15px">
      <p style="margin-top: 5px">Delete</p>
    </button>
    <div style="width: 6%"></div>
    <button class="register-button center-horizontal texture prim-color-background shadow" @click="joinClicked" style="width: 26%; margin-top: 15px">
      <p style="margin-top: 5px">Join</p>
    </button>
    <div style="width: 6%"></div>
    <button class="register-button center-horizontal texture prim-color-background shadow" @click="watchClicked" style="width: 26%; margin-top: 15px">
      <p style="margin-top: 5px">Watch</p>
    </button>
  </div>

</template>


<script>

import UIButton from "@/components/views/UIButton.vue";

export default {
    name: "DashboardRoom",
  components: {UIButton},
    data() {
        return {
        };
    },

    props:{
        hoster: String,
        playerCount: String,
      rc: String,
      vis: Boolean
    },

    created() {
    },

    mounted() {
    },

    updated() {
    },

    methods: {

      deleteClicked(){
        this.$emit("delete", this.rc)
      },

      joinClicked(){
        this.$emit("join", this.rc)
      },

      watchClicked(){
        this.$emit("watch", this.rc)
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