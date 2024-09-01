<template>
    <v-container class="chat-room-container">
        <v-toolbar flat color="#1b1b1b" dark>
            <v-btn icon @click="closeChatModal" class="mr-2">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-toolbar-title>{{ roomName }}</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-toolbar>

        <!-- 메시지 리스트 -->
        <v-row class="message-list" ref="messageList" style="background-color: #1b1b1b">
            <v-col cols="12">
                <v-list style="background-color: #1b1b1b">
                    <v-list-item
                        v-for="(message, index) in messages"
                        :key="index"
                        :class="{
                            'message-sent': message.sender === sender && message.type !== 'JOIN',
                            'message-received': message.sender !== sender && message.type !== 'JOIN',
                            'join-message': message.type === 'JOIN'
                        }"
                    >
                        <v-list-item-content :class="message.type === 'JOIN' ? 'join-message-container' : ''">
                            <div
                                :class="{
                                    'bubble-sent-container': message.sender === sender && message.type !== 'JOIN',
                                    'bubble-received-container': message.sender !== sender && message.type !== 'JOIN'
                                }"
                            >
                                <div v-if="message.sender === sender && message.type !== 'JOIN'" class="message-header right-align">
                                    <span class="sender-name">{{ message.senderName }}</span>
                                    <v-img v-if="message.senderProfileImage" :src="message.senderProfileImage" alt="Profile" class="profile-image" />
                                </div>
                                <div v-else-if="message.sender !== sender && message.type !== 'JOIN'" class="message-header left-align">
                                    <v-img v-if="message.senderProfileImage" :src="message.senderProfileImage" alt="Profile" class="profile-image" />
                                    <span class="sender-name">{{ message.senderName }}</span>
                                </div>
                                <div
                                    :class="{
                                        'bubble-sent': message.sender === sender && message.type !== 'JOIN',
                                        'bubble-received': message.sender !== sender && message.type !== 'JOIN',
                                        'bubble-join': message.type === 'JOIN'
                                    }"
                                    class="message-bubble"
                                >
                                    <v-list-item-title>
                                        {{ typeof message.content === 'object' ? JSON.stringify(message.content) : message.content }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle v-if="message.type !== 'JOIN'" class="message-time">
                                        {{ formatDate(message.timestamp) }}
                                    </v-list-item-subtitle>
                                </div>
                            </div>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-col>
        </v-row>

        <!-- 입력 영역 -->
        <v-row class="input-row">
            <v-col cols="10">
                <v-text-field
                    v-model="message"
                    label=""
                    @keyup.enter="sendMessage"
                    outlined
                    color="white"
                    class="input-field"
                ></v-text-field>
            </v-col>
            <v-col cols="2">
                <v-btn @click="sendMessage" color="#1b1b1b" class="send-btn">
                    <v-icon class="send-icon">mdi-send</v-icon>
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import axios from 'axios';
import VueJwtDecode from "vue-jwt-decode";

export default {
    data() {
        return {
            roomId: this.$route.params.roomId,
            roomName: '',
            message: '',
            messages: [],
            sender: '',
            client: null
        };
    },
    created() {
        this.setSenderFromToken();
        this.fetchRoomInfo();
        this.connectWebSocket();
    },
    watch: {
        messages() {
            this.$nextTick(() => {
                this.scrollToBottom();
            });
        }
    },
    methods: {
        setSenderFromToken() {
            const token = localStorage.getItem('token');
            if (token) {
                const decodedToken = VueJwtDecode.decode(token);
                this.sender = decodedToken.sub;
            } else {
                this.sender = 'Anonymous';
            }
        },
        fetchRoomInfo() {
            axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/rooms/${this.roomId}`).then(response => {
                this.roomName = response.data.name;
                this.fetchMessages();
            }).catch(error => {
                console.error("Failed to fetch room info:", error);
            });
        },
        async fetchMessages() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/rooms/${this.roomId}/messages`);
                this.messages = response.data;

                // 각 메시지에 대해 추가 정보 요청
                for (let message of this.messages) {
                    if (message.sender !== this.sender && message.type !== 'JOIN') {
                        const userResponse = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/users/${message.sender}`);
                        message.senderProfileImage = userResponse.data.profileImage; // 프로필 이미지 URL
                        message.senderName = userResponse.data.name; // 사용자 이름
                    }
                }

                this.scrollToBottom();  // 메시지를 처음 가져올 때 스크롤을 맨 아래로
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        },
        connectWebSocket() {
            const socket = new SockJS(`${process.env.VUE_APP_API_BASIC_URL}/ws-chat`);
            const token = localStorage.getItem('token');

            this.client = new Client({
                webSocketFactory: () => socket,
                connectHeaders: {
                    'Authorization': `Bearer ${token}`
                },
                reconnectDelay: 5000,
                onConnect: () => {
                    this.subscribeToRoom();

                    // sessionStorage에 저장된 값이 없을 때만 join 메시지를 보냄
                    if (!sessionStorage.getItem(`joined_${this.roomId}`)) {
                        this.joinRoom();
                        sessionStorage.setItem(`joined_${this.roomId}`, true);
                    }
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                onWebSocketClose: (event) => {
                    if (event.code === 403) {
                        console.error('Connection closed with 403 error. Token might be invalid or expired.');
                    }
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
                this.messages.push(receivedMessage);
            });
        },
        joinRoom() {
            const joinMessage = {
                sender: this.sender,
                content: `${this.sender}님이 방에 참가하셨습니다.`,
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
        },
        formatDate(timestamp) {
            if (isNaN(timestamp)) {
                timestamp = Date.now();
            }

            const date = new Date(timestamp);

            let hours = date.getHours();
            let minutes = date.getMinutes();

            const ampm = hours >= 12 ? '오후' : '오전';
            
            hours = hours % 12;
            hours = hours ? hours : 12;

            minutes = minutes < 10 ? '0' + minutes : minutes;

            return `${ampm} ${hours}:${minutes}`;
        },

        scrollToBottom() {
            const container = this.$refs.messageList.$el;
            container.scrollTop = container.scrollHeight;
        },
        closeChatModal() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.chat-room-container {
    background-color: #2e2e2e;
    min-height: 100vh;
    padding: 0;
    display: flex;
    flex-direction: column;
}

.message-list {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #2e2e2e;
    max-height: 400px;
}

.input-row {
    background-color: #1b1b1b;
    padding: 10px;
}

.input-field {
    background-color: #1b1b1b;
    color: #fff;
    border-radius: 20px;
}

.send-btn {
    background-color: #1b1b1b;
    color: white;
    height: 56px;
    width: 56px;
    border-radius: 50%;
}

.send-icon {
    color: #ff0066;
}

.message-sent {
    justify-content: flex-end;
    margin-left: auto;
    max-width: 40%;
    text-align: right;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}

.message-received {
    justify-content: flex-start;
    margin-right: auto;
    max-width: 40%;
    text-align: left;
    word-wrap: break-word;
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
.message-bubble {
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
}

.v-list-item-title {
    white-space: pre-wrap !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    overflow: visible !important;
}

.v-list-item-content {
    overflow: visible !important;
}

.bubble-sent-container {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.bubble-sent {
    background-color: #ff0066;
    color: white;
    border-radius: 20px 20px 0px 20px;
    padding: 10px 12px;
    max-width: 70%;
    overflow-wrap: break-word;
}

.bubble-received-container {
    text-align: left;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.bubble-received {
    background-color: #e5e5ea;
    color: black;
    border-radius: 20px 20px 20px 0px;
    padding: 10px 12px;
    max-width: 70%;
    overflow-wrap: break-word;
}

.message-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.right-align {
    justify-content: flex-end;
}

.left-align {
    justify-content: flex-start;
}

.profile-image {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    margin-left: 8px;
}

.sender-name {
    color: white;
    font-weight: bold;
}

.message-time {
    font-size: 12px;
    color: #b0b0b0;
    margin-top: 5px;
    text-align: right;
}

/* JOIN 메시지 스타일 */
.join-message {
    display: flex;
    justify-content: center;
    margin: 10px 0;
    max-width: 100%;
}

.join-message-container {
    text-align: center;
}

.bubble-join {
    color: black;
    opacity: 0.8;
    border-radius: 20px;
    padding: 5px 10px;
    max-width: 100%;
    background-color: transparent;
}

.message-list::-webkit-scrollbar {
    width: 8px;
}

.message-list::-webkit-scrollbar-track {
    background-color: #1b1b1b;
}

.message-list::-webkit-scrollbar-thumb {
    background-color: #ff0066;
    border-radius: 10px;
}

.message-list::-webkit-scrollbar-thumb:hover {
    background-color: #ff3385;
}

</style>
