<template>
    <div class="chat-room-container">
      <h2>Chat Room: {{ roomName }}</h2>
      <div class="chat-box">
        <div v-for="message in messages" :key="message.id" class="chat-message">
          <strong>{{ message.sender }}:</strong> {{ message.content }}
        </div>
      </div>
      <input v-model="newMessage" placeholder="Type your message..." @keyup.enter="sendMessage" />
      <button @click="sendMessage">Send</button>
    </div>
  </template>
  
  <script>
  import SockJS from 'sockjs-client';
  import { Stomp } from '@stomp/stompjs';
  import axios from 'axios';
  import { mapState } from 'vuex';
  
  export default {
    data() {
      return {
        roomName: '',
        newMessage: '',
        messages: [],
        stompClient: null,
      };
    },
    computed: {
      ...mapState(['user', 'token']),
    },
    async created() {
      this.roomName = this.$route.params.id;
  
      // Load previous messages
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/room/${this.roomName}/messages`, {
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        });
        this.messages = response.data;
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
  
      // Connect to WebSocket
      const socket = new SockJS(`${process.env.VUE_APP_API_BASIC_URL}/ws-chat`);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect(
  { Authorization: `Bearer ${this.token}` },
  frame => {
    console.log(frame);  // 이 줄을 추가하여 frame 변수를 사용
    this.stompClient.subscribe(`/topic/${this.roomName}`, message => {
      this.messages.push(JSON.parse(message.body));
    });
  }
);
    },
    methods: {
      sendMessage() {
        if (this.newMessage.trim() !== '') {
          const message = {
            sender: this.user.username,
            content: this.newMessage,
            roomId: this.roomName,
            type: 'CHAT'
          };
          this.stompClient.send(`/app/chat.sendMessage`, {}, JSON.stringify(message));
          this.newMessage = '';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .chat-room-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 40px;
    background-color: #1c1c1c;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
    font-size: 32px;
    font-weight: bold;
    color: #ffffff;
  }
  
  .chat-box {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
    background-color: #333;
    padding: 20px;
    border-radius: 10px;
  }
  
  .chat-message {
    margin-bottom: 10px;
    color: #ffffff;
  }
  
  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 1px solid #333;
    border-radius: 5px;
    background-color: #2a2a2a;
    color: #ffffff;
    margin-bottom: 10px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 5px;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  </style>
  