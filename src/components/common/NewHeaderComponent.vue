<template>
    <v-app-bar app class="px-4" style=" background-color: #1b1b1b; color:#ffffff;">
        <v-toolbar-title class="d-flex align-center title-style">
            <v-btn text class="title-btn" :to="'/'">NoExit</v-btn>
            <v-divider class="mx-3" vertical></v-divider>
            <v-btn text v-if="userRole == 'USER'" class="link-btn" to="/board/list">Board</v-btn>
            <v-btn text v-if="userRole == 'USER'" class="link-btn" to="/findboard">Escape-With-Me</v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon :to="isLogin ? '/mypage' : '/login'">
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn icon :to="isLogin ? '/wishlist' : '/login'">
            <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-btn v-if="userRole == 'USER'" icon :to="isLogin ? '/' : '/login'">
            <v-icon>mdi-bell ({{ totalNotification }})</v-icon>
        </v-btn>
        <v-btn icon v-if="isLogin" @click="doLogout">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
// import { mapGetters } from 'vuex';
import { EventSourcePolyfill } from 'event-source-polyfill'
export default {
    data() {
        return {
            isLogin: false,
            totalNotification: 0,
            userRole: 'USER'
        };
    },
    created() {
        const token = localStorage.getItem("token");
        if (token) {
            this.isLogin = true;
            this.userRole = localStorage.getItem("role");
        }
        // this.connectSSE(); // SSE 연결 시도
    },
    methods: {
        connectSSE() {
            const token = localStorage.getItem("token");
            const userRole = localStorage.getItem("role");
            this.sse = new EventSourcePolyfill(`${process.env.VUE_APP_API_BASIC_URL}/notification/subscribe?role=${userRole}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            this.sse.addEventListener('COMMENT', (event) => {
                console.log(event);
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
        doLogout() {
            localStorage.clear();
            window.location.reload();
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

.title-style span {
    font-weight: 900;
    font-size: 24px;
}

.title-btn {
    font-size: 24px;
    font-weight: 800;
    color: #FF0066;
}

.link-btn {
    font-size: 20px;
    font-weight: 400;
    font-family: 'Nunito Sans', sans-serif;
}
</style>
