<!-- <template>
    <div id="chat">
      <h2>WebSocket Chat Room</h2>
      
      <div id="createRoom">
        <h3>Create Room</h3>
        <button @click="createRoom">Create New Room</button>
        <p v-if="createdRoomId">Room Created! ID: {{ createdRoomId }}</p>
      </div>

      <div id="joinRoom">
        <h3>Join Room</h3>
        <input v-model="roomIdToJoin" placeholder="Enter Room ID" />
        <input v-model="username" placeholder="Enter Your Name" />
        <button @click="joinRoom">Join Room</button>
      </div>

      <div v-if="isInRoom">
        <div id="messages">
          <div v-for="(message, index) in messages" :key="index">
            <strong>{{ message.sender }}:</strong> {{ message.content }}
          </div>
        </div>
        <div id="inputForm">
          <input v-model="message" placeholder="Type a message..." @keyup.enter="sendMessage" />
          <button @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  // import axios from 'axios';
  // import { Client } from '@stomp/stompjs';
  // import SockJS from 'sockjs-client';
  
  // export default {
  //   data() {
  //     return {
  //       client: null,
  //       message: '',
  //       messages: [],
  //       createdRoomId: '',
  //       roomIdToJoin: '',
  //       username: '',
  //       isInRoom: false,
  //       sender: 'User' + Math.floor(Math.random() * 1000),
  //       roomId: ''
  //     };
  //   },
  //   methods: {
  //     connect() {
  //       const socket = new SockJS('http://localhost:8080/ws-chat');
  //       this.client = new Client({
  //         webSocketFactory: () => socket,
  //         debug: function (str) {
  //           console.log(str);
  //         },
  //         reconnectDelay: 5000,
  //         onConnect: () => {
  //           this.subscribe();
  //           this.joinRoom();
  //         },
  //         onDisconnect: () => {
  //           console.log('Disconnected');
  //         }
  //       });
  
  //       this.client.activate();
  //     },
  //     subscribe() {
  //       this.client.subscribe('/topic/room/' + this.roomId, (message) => {
  //         const receivedMessage = JSON.parse(message.body);
  //         this.messages.push(receivedMessage);
  //       });
  //     },
  //     createRoom() {
  //       axios.post('http://localhost:8080/chat/createRoom') // 엔드포인트를 올바르게 수정
  //       .then(response => {
  //       this.createdRoomId = response.data;
  //       })
  //       .catch(error => {
  //       console.error('Failed to create room:', error);
  //       });
  //   },

  //     joinRoom() {
  //     axios.post('http://localhost:8080/chat/joinRoom', {
  //       roomId: this.roomIdToJoin || this.createdRoomId,
  //       username: this.username || this.sender
  //     }).then(() => {  // 'response'를 제거했습니다.
  //       this.roomId = this.roomIdToJoin || this.createdRoomId;
  //       this.isInRoom = true;
  //       this.connect();  // 연결을 설정
  //     }).catch(error => {
  //       console.error('Failed to join room:', error);
  //     });
  //   },

    //   sendMessage() {
    //     if (this.client && this.client.connected) {
    //       if (this.message.trim() !== '') {
    //         const chatMessage = {
    //           sender: this.username || this.sender,
    //           content: this.message,
    //           type: 'CHAT',
    //           roomId: this.roomId
    //         };
    //         this.client.publish({
    //           destination: '/chat.sendMessage',
    //           body: JSON.stringify(chatMessage)
    //         });
    //         this.message = '';
    //       }
    //     } else {
    //       console.error('STOMP connection is not established.');
    //     }
    //   }
    // }
//  };
</script>
 
<style scoped> 
/* #chat {
    width: 400px;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }
  
  #createRoom,
  #joinRoom {
    margin-bottom: 20px;
  }
  
  #messages {
    border: 1px solid #ccc;
    height: 300px;
    overflow-y: scroll;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  #inputForm {
    display: flex;
    margin-top: 10px;
  }
  
  #inputForm input {
    flex: 1;
    padding: 10px;
    margin-right: 10px;
  }
  
   #inputForm button {
    padding: 10px 20px;
  }
  </style> */