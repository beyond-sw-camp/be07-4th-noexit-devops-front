    <template>
        <div id="chat">
        <h2>WebSocket Chat Room</h2>
        <div id="messages">
            <div v-for="(message, index) in messages" :key="index">
            <strong>{{ message.sender }}:</strong> {{ message.content }}
            </div>
        </div>
        <div id="inputForm">
            <input v-model="message" placeholder="Type a message..." @keyup.enter="sendMessage"/>
            <button @click="sendMessage">Send</button>
        </div>
        </div>
    </template>
    
    <script>
    import { Client } from '@stomp/stompjs';
    import SockJS from 'sockjs-client';
    
    export default {
        data() {
        return {
            client: null,
            message: '',
            messages: [],
            sender: 'User' + Math.floor(Math.random() * 1000),
            roomId: '1'
        };
        },
        created() {
        this.connect();
        },
        methods: {
        connect() {
            const socket = new SockJS('http://localhost:8080/ws-chat');
            this.client = new Client({
            webSocketFactory: () => socket,
            debug: function (str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            onConnect: () => {
                this.subscribe();
                this.joinRoom();
            },
            onDisconnect: () => {
                console.log('Disconnected');
            }
            });
    
            this.client.activate();
        },
        subscribe() {
            this.client.subscribe('/topic/room/' + this.roomId, (message) => {
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
            if (!this.client || !this.client.connected) {
                console.error('STOMP connection is not established.');
                this.showCustomAlert('서버에 연결되지 않았습니다. 잠시 후 다시 시도해 주세요.');
                return;
            }

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
    #chat {
        width: 400px;
        margin: 0 auto;
        font-family: Arial, sans-serif;
        background-color: #ccc;
    }
    
    #messages {
        border: 1px solid #ccc;
        height: 300px;
        overflow-y: scroll;
        padding: 10px;
        margin-bottom: 10px;
    }
    
    #inputForm {
        background-color: #5d5d5d;
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
    </style>
    