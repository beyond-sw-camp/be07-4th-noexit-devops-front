<template>
    <div class="chat-room">
      <!-- 채팅방 헤더 -->
      <div class="chat-room__header">
        <v-btn icon @click="$router.go(-1)">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <span class="chat-room__header-title">{{ roomName }}</span>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </div>
  
      <!-- 메시지 리스트 -->
      <div class="chat-room__body" ref="messageList">
        <v-list>
          <v-list-item
            v-for="(message, index) in messages"
            :key="index"
            :class="{
              'chat-room__message-sent': message.sender === sender,
              'chat-room__message-received': message.sender !== sender,
            }"
          >
            <v-list-item-content :class="message.sender === sender ? 'chat-room__bubble-sent' : 'chat-room__bubble-received'">
              <p>{{ message.msg }}</p>
              <span class="chat-room__time">{{ formatDate(message.timestamp) }}</span>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
  
      <!-- 입력 영역 -->
      <div class="chat-room__input">
        <v-text-field
          v-model="message"
          label=""
          @keyup.enter="sendMessage"
          outlined
          class="chat-room__input-field"
        ></v-text-field>
        <v-btn @click="sendMessage" color="#ff0066"class="chat-room__send-btn">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        roomName: "Chat Room",
        sender: "user1", // 현재 사용자
        message: "",
        messages: [
          { sender: "user1", msg: "Hello!", timestamp: new Date() },
          { sender: "user2", msg: "Hi there!", timestamp: new Date() },
        ],
      };
    },
    methods: {
      sendMessage() {
        if (this.message.trim()) {
          this.messages.push({
            sender: this.sender,
            msg: this.message,
            timestamp: new Date(),
          });
          this.message = "";
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      },
      scrollToBottom() {
        const messageList = this.$refs.messageList;
        if (messageList) {
          messageList.scrollTop = messageList.scrollHeight;
        }
      },
      formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      },
    },
    mounted() {
      this.scrollToBottom();
    },
  };
  </script>
  
  <style scoped>
  .chat-room {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f3f3f3;
  }
  
  .chat-room__header {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: #1b1b1b;
    color: white;
  }
  
  .chat-room__header-title {
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  .chat-room__body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 1rem;
    background-color: #e5e5e5;
  }
  
  .chat-room__message-sent {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }
  
  .chat-room__message-received {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 1rem;
  }
  
  .chat-room__bubble-sent,
  .chat-room__bubble-received {
    max-width: 70%;
    padding: 10px;
    border-radius: 20px;
    font-size: 14px;
    line-break: anywhere;
    background-color: #ff0066;
    color: white;
  }
  
  .chat-room__bubble-received {
    background-color: #ffffff;
    color: #414141;
  }
  
  .chat-room__time {
    display: block;
    font-size: 12px;
    color: #9c9c9c;
    margin-top: 5px;
    text-align: right;
  }
  
  .chat-room__input {
    display: flex;
    padding: 1rem;
    background-color: #1b1b1b;
  }
  
  .chat-room__input-field {
    flex-grow: 1;
    background-color: white;
    color: black;
  }
  
  .chat-room__send-btn {
    margin-left: 1rem;
    color: #ff0066;
  }
  </style>
  