<template>
  <v-container>
    <h2>{{ roomName }}</h2>
    <v-row>
      <v-col cols="12">
        <v-list v-if="messages.length > 0">
  <v-list-item v-for="(message, index) in messages" :key="index">
    <v-list-item-content>
      <v-list-item-title><strong>{{ message.sender }}:</strong> {{ message.content }}</v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</v-list>

        <p v-else>No messages yet.</p>
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
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';

export default {
  data() {
    return {
      client: null,
      isConnected: false,
      roomId: this.$route.params.roomId,
      sender: '',
      message: '', // 메시지 입력 필드와 연결된 데이터
      messages: []
    };
  },
  created() {
    this.setSenderFromToken();
    this.connectWebSocket();
    this.fetchMessages();
  },
  methods: {
    getAuthToken() {
      return localStorage.getItem('token');
    },

    setSenderFromToken() {
      const token = this.getAuthToken();
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          this.sender = decodedToken.nickname || decodedToken.email || 'Anonymous';
        } catch (error) {
          console.error("Failed to decode token:", error);
          this.sender = 'Anonymous';
        }
      } else {
        this.sender = 'Anonymous';
      }
    },
    async fetchMessages() { // 메세지 저장(이전 내역 보기)
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/rooms/${this.roomId}/messages`);
        this.messages = response.data;
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    },

    connectWebSocket() {
      const socket = new SockJS(`${process.env.VUE_APP_API_BASIC_URL}/ws-chat`);
      const token = this.getAuthToken();

      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          'Authorization': `Bearer ${token}`
        },
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('Connected to WebSocket');
          this.isConnected = true;
          this.subscribeToRoom();
          this.joinRoom();
        },
        onStompError: (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
        },
        onWebSocketClose: (event) => {
          console.error('WebSocket connection closed:', event);
        },
        onError: (error) => {
          console.error('WebSocket connection error:', error);
        }
      });

      this.client.activate();
    },

    subscribeToRoom() {
  this.client.subscribe(`/topic/room/${this.roomId}`, (message) => {
    const receivedMessage = JSON.parse(message.body);
    console.log('Received message:', receivedMessage);  // 메시지 수신 확인
    this.messages.push(receivedMessage);
    console.log('Updated messages array:', this.messages);  // messages 배열 확인
  });
},
    

    joinRoom() {
      if (!this.isConnected) {
        console.error('Not connected to WebSocket');
        return;
      }
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
      if (!this.message.trim()) {
        return;
      }
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
