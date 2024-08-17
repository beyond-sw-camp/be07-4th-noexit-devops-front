<template>
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
        <v-text-field 
          v-model="message" 
          label="Type a message" 
          @keyup.enter="sendMessage"
          outlined
          color="white"
          background-color="#ffffff"
        ></v-text-field>
        <v-btn @click="sendMessage" color="white" outlined>Send</v-btn>
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
      axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/rooms/${this.roomId}`).then(response => {
        this.roomName = response.data.name;
        this.fetchMessages();
      }).catch(error => {
        console.error("Failed to fetch room info:", error);
      });
    },
    fetchMessages() {
      axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/rooms/${this.roomId}/messages`).then(response => {
        this.messages = response.data;
      }).catch(error => {
        console.error("Failed to fetch messages:", error);
      });
    },
    connectWebSocket() {
      const socket = new SockJS(`${process.env.VUE_APP_API_BASIC_URL}/ws-chat`);
      this.client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          this.subscribeToRoom();
          this.joinRoom();
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
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
.v-container {
  background-color: #ffffff;
  color: #000000;
  padding: 20px;
  border-radius: 10px;
}

.v-text-field input {
  background-color: #f9f9f9;
  color: #000000;
}

.v-btn {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #000000;
}

.v-list-item {
  background-color: #f0f0f0;
  color: #000000;
  margin-bottom: 10px;
  border-radius: 5px;
}

.v-list-item:hover {
  background-color: #e0e0e0;
}

.v-list-item-title {
  color: #000000;
}
</style>
