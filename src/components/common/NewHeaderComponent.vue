<template>
    <v-app-bar app class="px-4" style=" background-color: #1b1b1b; color:#ffffff;">
        <v-toolbar-title class="d-flex align-center title-style">
            <v-btn text class="title-btn" :to="{ path: '/' }" :class="{ active: isActive('/') }">NoExit</v-btn>
            <v-divider class="mx-3" vertical></v-divider>
            <v-btn v-if="userRole === 'USER'" text class="link-btn" :to="{ path: '/board/list' }"
                :class="{ active: isActive('/board/list') }" style="font-weight:300">Board</v-btn>
            <v-btn v-if="userRole === 'USER'" text class="link-btn" :to="{ path: '/findboard' }"
                :class="{ active: isActive('/findboard') }" style="font-weight:300">Escape-With-Me</v-btn>
            <v-btn text class="link-btn" :to="{ path: '/' }" :class="{ active: isActive('/board/list') }"
                style="font-weight:300">Ranking</v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon :to="isLogin ? '/mypage' : '/login'">
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn>
            <v-icon size="27px">mdi-message-reply-text-outline</v-icon>
        </v-btn>

        <!-- 알림 기능 -->
        <v-btn icon>
            <v-badge color="red" :content="unreadNotificationsCount" overlap>
                <v-icon>mdi-bell</v-icon>
            </v-badge>


            <v-menu activator="parent" offset-y>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="mdi-notification-title">
                            알림
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider style="background-color: #fff;"></v-divider>
                <v-list max-width="600" max-height="400" style="overflow-y: auto; background-color:#1b1b1b">

                    <v-list-item v-for="notification in notifications" :key="notification.id"
                        :class="{ 'readNotification': notification.delYn === 'Y' }"
                        @click="unreadNotification(notification)">
                        <v-list-item-content>
                            <v-list-item-title>{{ notification.message }}</v-list-item-title>
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
            userRole: 'USER',
            notifications: [],
        };
    },
    mounted() {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        this.userRole = role;
        this.isLogin = !!token;

        if (token) {
            this.fetchNotifications();
            this.connectSSE();
        }
    },
    computed: {
        unreadNotificationsCount() {
            return this.notifications.filter(notification => notification.delYn === 'N').length;
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
            // escape with me 인원다차면 
            this.sse.addEventListener('FULL_COUNT', (event) => {
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

            } catch (error) {
                console.error('알림 목록을 가져오는 중 오류 발생:', error);
            }
        },
        async unreadNotification(notification) {
            // 읽지않은 애라면 -> 읽음처리
            if (notification.delYn === 'N') {

                try {
                    const index = this.notifications.findIndex(n => n.id === notification.id);
                    if (index !== -1) {
                        this.notifications[index].delYn = 'Y';
                    }

                    await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/notification/update/${notification.id}`, null, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });

                    // 라우터 수정필요 -> notificationType으로 
                    // if (notification.board_id) {//comment, comment_like, board_like -> board_id
                    //     this.$router.push(`/board/detail/${notification.board_id}`);
                    // } else if (notification.reservationId) {    // reservation_req, reservation_res -> res_id
                    //     this.$router.push(`/board/detail/${notification.board_id}`);
                    // } else if (notification.findboard_id) { // full_count, char_room_invite -> chat_id
                    //     this.$router.push(`/board/detail/${notification.board_id}`);
                    // }
                    if (notification.type === 'COMMENT' || notification.type === 'BOARD_LIKE' || notification.type === 'COMMENT_LIKE') {
                        this.$router.push(`/board/detail/${notification.notification_id}`);
                    } else if (notification.type === 'RESERVATION_REQ' || notification.type === 'RESERVATION_RES') {
                        this.$router.push('/reservation/myreservation');
                    } else if (notification.type === 'FULL_COUNT' || notification.type === 'CHAT_ROOM_INVITE') {
                        this.$router.push('/chat/list');
                    }
                } catch (error) {
                    console.error('알림을 읽음으로 표시하는 중 오류 발생:', error);
                }
            }
        },

        isActive(path) {
            return this.$route.path === path;
        },
        doLogout() {
            this.$router.push("/")
            localStorage.clear();
            this.isLogin = false;
        },
    },
    beforeUnmount() {
        if (this.sse) {
            this.sse.close();
        }
    },
};
</script>

<style scoped>
body {
    font-family: 'Nunito Sans', sans-serif;
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
}

.link-btn {
    font-size: 18px;
    font-weight: 400;
    font-family: 'Nunito Sans', sans-serif;
    position: relative;
    color: white;
}

.link-btn:hover {
    color: #919191;
}

.link-btn.active {
    background-color: rgba(27, 27, 27, 100);
}

.title-btn.active {
    background-color: rgba(27, 27, 27, 100);
}

.link-btn.active::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    color: #FF0066;
    position: absolute;
    left: 0;
    right: 0;
    bottom: -5px;
    background-color: #FF0066;
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
</style>