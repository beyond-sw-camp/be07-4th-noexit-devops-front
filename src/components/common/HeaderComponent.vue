<template>
    <v-app-bar app dark>
        <v-container>
            <v-row align="center">
                <v-col class="d-flex justify-start">
                    <div v-if="userRole == 'ADMIN'">
                        <v-btn :to="{ path: '/member/list' }">회원관리</v-btn>
                        <v-btn :to="{ path: '/product/manage' }">예약관리</v-btn>
                        <v-btn :to="{ path: '/order/list' }">예약리스트</v-btn>
                    </div>
                </v-col>
                <v-col class="text-center">
                    <v-btn :to="{ path: '/' }">NoExit</v-btn>
                </v-col>
                <v-col class="d-flex justify-end">
                    <v-btn v-if="isLogin" :to="{ path: '/mypage' }">MyPage</v-btn>
                    <v-btn v-if="!isLogin" :to="{ path: '/member/create' }">회원가입</v-btn>
                    <v-btn v-if="!isLogin" :to="{ path: '/login' }">로그인</v-btn>
                    <v-btn v-if="isLogin" @click="doLogout">로그2아웃</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script>
export default {
    data() {
        return {
            userRole: null,
            isLogin: false,
        }
    },
    created() {

        const token = localStorage.getItem("token")
        if (token) {
            this.isLogin = true;
            this.userRole = localStorage.getItem("role");

        }
    },
    methods: {
        doLogout() {
            localStorage.clear();
            window.location.reload();
        }
    }
};
</script>