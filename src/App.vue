<script>

import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import WebSocket from "@/components/WebSocket.vue";

export default {
  //npm run dev | npm run build
  name: "App",
  components: {WebSocket, HelloWorld, TheWelcome},

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
    <WebSocket/>
  </main>
</template>

<style scoped>
</style>
