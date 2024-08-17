<template>
    <v-app-bar app class="px-4" style=" background-color: #1b1b1b; color:#ffffff;">
        <v-toolbar-title class="d-flex align-center title-style">
            <v-btn text class="title-btn" :to="{ path: '/' }" :class="{ active: isActive('/') }">NoExit</v-btn>
            <v-divider class="mx-3" vertical></v-divider>
            <!-- <v-btn text v-if="userRole == 'USER'" class="link-btn" to="/board/list">Board</v-btn>
            <v-btn text v-if="userRole == 'USER'" class="link-btn" to="/findboard">Escape-With-Me</v-btn> -->
            <v-btn text class="link-btn" :to="{ path: '/board/list' }"
                :class="{ active: isActive('/board/list') }">Board</v-btn>
            <v-btn text class="link-btn" :to="{ path: '/findboard' }"
                :class="{ active: isActive('/findboard') }">Escape-With-Me</v-btn>
            <v-btn text class="link-btn" :to="{ path: '/' }"
                :class="{ active: isActive('/board/list') }">Ranking</v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon :to="isLogin ? '/mypage' : '/login'">
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <!-- <v-btn v-if="userRole == 'USER'" icon :to="isLogin ? '/' : '/login'">
            <v-icon>mdi-bell ({{ totalNotification }})</v-icon>
        </v-btn> -->

        <!-- 알림 기능 -->
        <v-btn icon>
            <v-badge color="red" :content="unreadNotificationsCount" overlap v-if="unreadNotificationsCount > 0">
                <v-icon>mdi-bell</v-icon>
            </v-badge>
            <v-icon v-else>mdi-bell</v-icon>

            <v-menu activator="parent" offset-y>
                <v-list max-width="500" max-height="400" style="overflow-y: auto; background-color:#1b1b1b">
                    <v-list-item v-for="notification in notifications" :key="notification.id">
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
// import { mapGetters } from 'vuex';
import axios from 'axios'
import { EventSourcePolyfill } from 'event-source-polyfill'
export default {
    data() {
        return {
            isLogin: false,
            totalNotification: 0,
            userRole: 'USER',
            notifications: [],
        };
    },
    // created() {
    //     const token = localStorage.getItem("token");
    //     if (token) {
    //         this.isLogin = true;
    //         this.userRole = localStorage.getItem("role");
    //         this.connectSSE();
    //     }
    //     // this.connectSSE(); // SSE 연결 시도
    // },
    computed: {
        unreadNotificationsCount() {
            return this.notifications.filter(notification => notification.delYn === 'N').length;
        },
        unreadNotifications() {

            const unread = this.notifications.filter(notification => notification.delYn === 'N');
            console.log("unread")
            console.log(unread)
            return unread;
        }
    },
    mounted() {
        const token = localStorage.getItem('token');
        this.isLogin = !!token;

        if (token) {
            this.fetchNotifications();
            this.connectSSE();
            console.log(this.notifications)
            // const eventSource = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASE_URL}/subscribe`, {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //     },
            // });

            // eventSource.addEventListener('notification', (event) => {
            //     const notification = JSON.parse(event.data);
            //     this.notifications.push(notification);
            // });

            // eventSource.onerror = (error) => {
            //     console.error('SSE 연결 오류:', error);
            // };
        }

    },
    methods: {
        connectSSE() {
            const token = localStorage.getItem("token");
            // const userRole = localStorage.getItem("role");
            this.sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASIC_URL}/subscribe`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            this.sse.addEventListener('COMMENT', (event) => {
                this.notifications.push(JSON.parse(event.data))
                this.totalNotification++;
            });

            this.sse.addEventListener('BOARD_LIKE', (event) => {
                console.log(event.data);
                this.totalNotification++;
            });

            this.sse.addEventListener('COMMENT_LIKE', (event) => {
                console.log(event.data);
                this.totalNotification++;
            });

            console.log(this.totalNotification)

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
        async markAsReadAndNavigate(notification, index) {
            if (notification.delYn === 'N') {
                try {
                    const id = notification.id;
                    await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/notifications/update/${id}`, null, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                    });
                    this.notifications[index].delYn = 'Y';

                    // if (notification.postId) {
                    //     this.$router.push({ name: 'PostDetail', params: { id: notification.postId } });
                    // } else if (notification.qnaId) {
                    //     this.$router.push({ name: 'QnaDetail', params: { id: notification.qnaId } });
                    // }
                } catch (error) {
                    console.error('알림을 읽음으로 표시하는 중 오류 발생:', error);
                }
            }
        },

        isActive(path) {
            return this.$route.path === path;
        },
        doLogout() {
            localStorage.clear();
            this.isLogin = false;
            this.$router.push("/")
        },
    },
    beforeUnmount() {
        if (this.sse) {
            this.sse.close(); // 컴포넌트가 파괴되기 전에 SSE 연결을 닫습니다.
        }
    }
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
    font-size: 28px;
    font-weight: 800;
    color: #FF0066;
}

.link-btn {
    font-size: 20px;
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

.unread-notification {
    background-color: rgba(255, 0, 102, 30);
    color: #ffffff
}

.v-list-item-title {
    background-color: #1b1b1b;
    color: #ffffff;
    font-size: 14px;
}
</style>