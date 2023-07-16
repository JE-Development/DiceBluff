<script>

import Register from "@/components/Register.vue";
import GamePage from "@/components/GamePage.vue";

export default {
  //npm run dev | npm run build
  name: "App",
  components: {GamePage, Register, WebSocket},

  created() {
  },

  mounted() {

  },
  data() {
    return {
    }
  },

  updated() {
  },

  methods: {


  }
}
</script>

<template>

  <main>
      <router-view />
  </main>
</template>

<style scoped>
</style>
