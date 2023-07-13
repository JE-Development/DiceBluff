
<template>

  <div>
    <input v-model="message" type="text" />
    <button @click="sendMessage">Send</button>
    <ul>
      <li v-for="receivedMessage in receivedMessages" :key="receivedMessage.id">
        {{ receivedMessage.content }}
      </li>
    </ul>
  </div>

</template>

<script>
export default {
  //npm run dev | npm run build
  name: "WebSocket",
  data() {
    return {
      message: '',
      receivedMessages: []
    };
  },
  mounted() {
    // Websocket-Verbindung herstellen
    this.websocket = new WebSocket('wss://websocket.jason-apps.workers.dev/');

    // Event-Handler für Nachrichten empfangen
    this.websocket.addEventListener('message', this.handleMessage);
  },
  methods: {
    sendMessage() {
      // Nachricht an den Server senden
      this.websocket.send(this.message);
      this.message = '';
    },
    handleMessage(event) {
      // Empfangene Nachrichten verarbeiten
      const receivedMessage = {
        id: Date.now(),
        content: event.data
      };
      this.receivedMessages.push(receivedMessage);
    }
  }
}
</script>

<style scoped>

</style>