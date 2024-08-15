<template>
    <v-app-bar app class="px-4" style=" background-color: #1b1b1b; color:#ffffff;">
        <v-toolbar-title class="d-flex align-center title-style">
            <v-btn text class="title-btn" :to="'/'">NoExit</v-btn>
            <v-divider class="mx-3" vertical></v-divider>
            <v-btn text class="link-btn" to="/board/list">Board</v-btn>
            <v-btn text class="link-btn" to="/findboard">Escape-With-Me</v-btn>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon :to="isLogin ? '/mypage' : '/login'">
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
