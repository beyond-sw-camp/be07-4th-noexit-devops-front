<template>

    <v-app-bar app class="px-4">
        <v-toolbar-title class="d-flex align-center title-style">
            <span>NoExit</span>
            <v-divider class="mx-3" vertical></v-divider>
            <!-- 페이지 링크 -->
            <v-btn text class="link-btn" to="/board/list">Board</v-btn>
            <v-btn text class="link-btn" to="/findboard/list">Escape-With-Me</v-btn>
        </v-toolbar-title>

        <!-- Spacer for alignment -->
        <v-spacer></v-spacer>

        <!-- 오른쪽 끝: 마이페이지, 위시리스트, 알림, 로그아웃 버튼 -->
        <v-btn icon :to="isLogin ? '/mypage' : '/member/create'">
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-btn icon :to="isLogin ? '/wishlist' : '/login'">
            <v-icon>mdi-heart</v-icon>
        </v-btn>
        <v-btn icon :to="isLogin ? '/' : '/login'">
            <v-icon>mdi-bell</v-icon>
        </v-btn>
        <v-btn icon v-if="isLogin" @click="doLogout">
            <v-icon>mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>

</template>

<script>
export default {
    data() {
        return {
            isLogin: false,
        };
    },
    created() {
        const token = localStorage.getItem('token');
        if (token) {
            this.isLogin = true;
        }
    },
    methods: {
        doLogout() {
            localStorage.clear();
            window.location.reload();
        },
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

.link-btn {
    font-size: 18px;
    font-weight: 400;
    font-family: 'Nunito Sans', sans-serif;
    /* 타이틀에 적용 */
}
</style>
