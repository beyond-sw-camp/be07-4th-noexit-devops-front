<!-- <template>
  <v-container>
    <h2>{{ roomName }}</h2>
    <v-row>
      <v-col cols="12">
        <v-list>
          <v-list-item v-for="(message, index) in messages" :key="index">
            <v-list-item-content>
              <v-list-item-title><strong>{{ message.sender }}:</strong> {{ message.content }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="message" label="Type a message" @keyup.enter="sendMessage"></v-text-field>
        <v-btn @click="sendMessage">Send</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';

export default {
  data() {
    return {
      roomId: this.$route.params.roomId,
      roomName: '',
      message: '',
      messages: [],
      sender: 'User' + Math.floor(Math.random() * 1000),
      client: null
    };
  },
  created() {
    this.fetchRoomInfo();
    this.connectWebSocket();
  },
  methods: {
    fetchRoomInfo() {
      axios.get(`/api/chat/rooms/${this.roomId}`).then(response => {
        this.roomName = response.data.name;
        this.fetchMessages();
      });
    },
    fetchMessages() {
      axios.get(`/api/chat/rooms/${this.roomId}/messages`).then(response => {
        this.messages = response.data;
      });
    },
    connectWebSocket() {
      const socket = new SockJS('http://localhost:8080/ws-chat');
      this.client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          this.subscribeToRoom();
          this.joinRoom();
        },
      });
      this.client.activate();
    },
    subscribeToRoom() {
      this.client.subscribe(`/topic/room/${this.roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        this.messages.push(receivedMessage);
      });
    },
    joinRoom() {
      const joinMessage = {
        sender: this.sender,
        content: '',
        type: 'JOIN',
        roomId: this.roomId
      };
      this.client.publish({
        destination: '/app/chat.join',
        body: JSON.stringify(joinMessage)
      });
    },
    sendMessage() {
      if (this.message.trim() !== '') {
        const chatMessage = {
          sender: this.sender,
          content: this.message,
          type: 'CHAT',
          roomId: this.roomId
        };
        this.client.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(chatMessage)
        });
        this.message = '';
      }
    }
  }
};
</script>

<style scoped>
/* 스타일은 자유롭게 추가 */
</style> -->
