<template>
    <v-app-bar app class="px-4" style=" background-color: #1b1b1b; color:#ffffff;">
        <v-toolbar-title class="d-flex align-center title-style">
            <router-link to="/" class="title-btn" :class="{ active: isActive('/') }">NoExit</router-link>
            <v-divider class="mx-3" vertical></v-divider>
            <router-link v-if="userRole === 'USER'" to="/board/list" class="link-btn"
                :class="{ active: isActive('/board/list') }">Board</router-link>
            <router-link v-if="userRole === 'USER'" to="/findboard" class="link-btn"
                :class="{ active: isActive('/findboard') }">Escape-With-Me</router-link>
            <router-link v-if="userRole === 'USER'" to="/ranking" class="link-btn"
                :class="{ active: isActive('/ranking') }">Ranking</router-link>
            <router-link v-if="userRole === 'OWNER'" to="/resview" class="link-btn"
                :class="{ active: isActive('/resview') }">Reservation</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <v-btn v-if="userRole !== 'OWNER'" icon :to="isLogin ? '/mypage' : '/login'">
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn icon>
            <v-icon size="27px">mdi-message-reply-text-outline</v-icon>
            <v-menu activator="parent" offset-y>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="mdi-notification-title">
                            채팅
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider style="background-color: #fff;"></v-divider>
                <v-list max-width="600" max-height="400" v-if="chatRooms.length > 0"
                    style="overflow-y: auto; background-color:#1b1b1b">

                    <v-list-item v-for="room in chatRooms" :key="room.id" @click="enterRoom(room.roomId)">
                        <v-list-item-content>
                            <!-- <v-list-item-title>{{ room.message }}</v-list-item-title>
                            <v-list-item-text style="color: #919191; font-weight: 300; font-size:14px">{{
                                formatDateTime(notification.createdTime)
                                }}</v-list-item-text> -->
                            <v-list-item-title>{{ room.name }}</v-list-item-title>


                        </v-list-item-content>
                    </v-list-item>

                </v-list>
            </v-menu>
        </v-btn>

        <!-- 알림 기능 -->
        <v-btn icon>
            <v-badge color="red" :content="unreadNotificationsCount" v-if="unreadNotificationsCount > 0" overlap>
                <v-icon>mdi-bell</v-icon>
            </v-badge>
            <v-icon v-else>mdi-bell</v-icon>

            <v-menu activator="parent" offset-y>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="mdi-notification-title">
                            알림
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider style="background-color: #fff;"></v-divider>
                <v-list max-width="600" max-height="400" v-if="notifications.length > 0"
                    style="overflow-y: auto; background-color:#1b1b1b">

                    <v-list-item v-for="notification in notifications" :key="notification.id"
                        :class="{ 'readNotification': notification.delYn === 'Y' }"
                        @click="unreadNotification(notification)">
                        <v-list-item-content>
                            <v-list-item-title>{{ notification.message }}</v-list-item-title>
                            <v-list-item-text style="color: #919191; font-weight: 300; font-size:14px">{{
                                formatDateTime(notification.createdTime)
                                }}</v-list-item-text>

                        </v-list-item-content>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-btn>

        <v-btn icon v-if="isLogin" @click="doLogout">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
import axios from 'axios'
import { EventSourcePolyfill } from 'event-source-polyfill'
export default {
    data() {
        return {
            isLogin: false,
            isUser: true,
            userRole: 'USER',
            notifications: [],
            chatRooms: [],
        };
    },
    mounted() {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        this.userRole = role;
        this.isLogin = !!token;

        if (token) {
            this.fetchNotifications();
            this.fetchChatList();
            this.connectSSE();
        }
    },
    computed: {
        unreadNotificationsCount() {
            return this.notifications.filter(notification => notification.delYn === 'N').length;
        },
        unreadNotifications() {
            return this.notifications.filter((notification) => notification.delYN === 'N');
        },
    },
    methods: {
        connectSSE() {
            const token = localStorage.getItem("token");
            this.sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASIC_URL}/subscribe`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // 단일 notification으로 받아서 처리하는 방법으로 수정해야
            // 코멘트 작성
            this.sse.addEventListener('COMMENT', (event) => {
                this.notifications.push(JSON.parse(event.data))
            });
            // 게시글 좋아요
            this.sse.addEventListener('BOARD_LIKE', (event) => {
                this.notifications.push(JSON.parse(event.data))
            });
            // 코멘트 좋아요
            this.sse.addEventListener('COMMENT_LIKE', (event) => {
                this.notifications.push(JSON.parse(event.data))
            });
            // 예약 요청
            this.sse.addEventListener('RESERVATION_REQ', (event) => {
                this.notifications.push(JSON.parse(event.data))
            });
            // 예약 승인
            this.sse.addEventListener('RESERVATION_RES', (event) => {
                this.notifications.push(JSON.parse(event.data))
            });
            // 
            this.sse.addEventListener('CHAT_ROOM_INVITE', (event) => {
                this.notifications.push(JSON.parse(event.data))
            });

            console.log(this.notifications)
            this.sse.onerror = () => {
                console.log("SSE 연결이 끊어졌습니다. 재연결을 시도합니다.");
                this.sse.close();
                setTimeout(this.connectSSE, 3000); // 3초 후 재연결 시도
            };
        },
        async fetchNotifications() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/notification/list`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.notifications = response.data.result;
                console.log(this.notifications)

            } catch (error) {
                console.error('알림 목록을 가져오는 중 오류 발생:', error);
            }
        },
        async unreadNotification(notification) {
            // 읽지않은 애라면 -> 읽음처리

            if (notification.delYn === 'N') {

                try {
                    const notificationId = notification.id;
                    // const index = this.notifications.findIndex(n => n.id === notification.id);
                    // if (index !== -1) {
                    //     this.notifications[index].delYn = 'Y';
                    // }
                    // notification.id = index
                    // console.log(index)
                    const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/notification/update/${notificationId}`, null, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    if (response.status === 200) {
                        const index = this.notifications.findIndex(n => n.id === notificationId);
                        if (index !== -1) {
                            this.notifications[index].delYn = 'Y';
                        }
                    }

                    // if (notification.type === 'COMMENT' || notification.type === 'BOARD_LIKE' || notification.type === 'COMMENT_LIKE') {
                    //     this.$router.push(`/board/detail/${notification.notification_id}`);
                    // } else if (notification.type === 'CHAT_ROOM_INVITE') {
                    //     this.enterRoom(notification.notification_id)
                    // } else if (notification.type === 'RESERVATION_REQ') {   // 점주
                    //     this.$router.push(`/resview`);
                    // } else if (notification.type === 'RESERVATION_RES') {   // 사용자
                    //     this.$router.push(`/reservation/myreservation`);
                    // }
                    this.routingList(notification)
                } catch (error) {
                    console.error('알림을 읽음으로 표시하는 중 오류 발생:', error);
                }
            }
        },
        routingList(notification) {
            if (notification.type === 'COMMENT' || notification.type === 'BOARD_LIKE' || notification.type === 'COMMENT_LIKE') {
                this.$router.push(`/board/detail/${notification.notification_id}`);
            } else if (notification.type === 'CHAT_ROOM_INVITE') {
                this.enterRoom(notification.notification_id)
            } else if (notification.type === 'RESERVATION_REQ') {   // 점주
                this.$router.push(`/resview`);
            } else if (notification.type === 'RESERVATION_RES') {   // 사용자
                this.$router.push(`/reservation/myreservation`);
            }
        },
        async fetchChatList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/chat/myrooms`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                this.chatRooms = response.data;
                console.log("chatRooms: " + this.chatRooms)

            } catch (error) {
                console.error('채팅 목록을 가져오는 중 오류 발생:', error);
            }
        },
        formatDateTime(isoString) {
            const date = new Date(isoString);
            const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1
                }월 ${date.getDate()}일`;
            const formattedTime = `${date
                .getHours()
                .toString()
                .padStart(2, "0")}시 ${date
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}분`;
            return `${formattedDate} ${formattedTime}`;
        },

        isActive(path) {
            return this.$route.path === path;
        },
        doLogout() {
            this.$router.push("/")
            localStorage.clear();
            this.userRole = '';
            this.isLogin = false;
            this.notifications = [];
            this.chatRooms = [];
        },
        enterRoom(roomId) {
            this.$router.push(`/chat/rooms/${roomId}`);
        },
        handleNavigation(notification) {
            switch (notification.type) {
                case 'COMMENT':
                case 'BOARD_LIKE':
                case 'COMMENT_LIKE':
                    this.$router.push(`/board/detail/${notification.notification_id}`);
                    break;
                case 'RESERVATION_REQ':
                    this.$router.push(`/resview`);
                    break;
                case 'RESERVATION_RES':
                    this.$router.push(`/reservation/detail/${notification.notification_id}`);
                    break;
                case 'CHAT_ROOM_INVITE':
                    this.$router.push(`/chat/rooms/${notification.notification_id}`);
                    break;
                default:
                    console.warn('Unknown notification type:', notification.type);
            }
        },
        beforeUnmount() {
            if (this.sse) {
                this.sse.close();
            }
        },
    }
}
</script>

<style scoped>
.title-btn,
.link-btn {
    text-transform: none;
}

.px-4 {
    padding: 10px 20px;
}

.title-style {
    font-weight: 700;
}

.title-btn {
    font-size: 24px;
    font-weight: 800;
    color: #FF0066;
    text-decoration: none;
}

.link-btn {
    font-size: 20px;
    font-weight: 100;
    position: relative;
    margin: 0 20px;
    color: white;
    text-decoration: none;
}

.link-btn.active::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background-color: #FF0066;
    position: absolute;
    left: 0;
    bottom: -5px;
}

.link-btn:hover {
    color: #919191;
}

.link-btn.active {
    background-color: rgba(27, 27, 27, 100);
    text-decoration: underline;
    text-decoration-thickness: 1px;
}

.title-btn.active {
    background-color: rgba(27, 27, 27, 100);
    text-decoration: underline;
    text-decoration-thickness: 1px;
}

.v-list {
    border: 1px solid #919191;
    border-radius: 10px;
}

.readNotification {
    color: #ffffff;
}

.readNotification .v-list-item-title {
    color: #FF0066;
}

.v-list-item-title {
    background-color: #1b1b1b;
    color: #ffffff;
    font-weight: 500;
}


.v-list-item-title.readNotification {
    color: #919191;
}

.notification-title {
    color: #ffffff;
    font-weight: 900;
}

.title-btn {}
</style>