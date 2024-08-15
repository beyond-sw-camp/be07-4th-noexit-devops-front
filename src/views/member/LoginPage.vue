<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="4" md="6">
                <v-card class="loginpage">
                    <v-card-title class="text-h5">로그인</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="doLogin">
                            <v-select label="role" :items="['일반 사용자', '점주 사용자']" v-model="role" hide-details dense
                                outlined class="custom-input mb-4"></v-select>
                            <v-text-field label="이메일 주소" v-model="email" type="email" required
                                class="custom-input mb-4"></v-text-field>
                            <v-text-field label="비밀번호" v-model="password" type="password" required
                                class="custom-input mb-4"></v-text-field>

                            <v-row class="mt-4">
                                <v-col cols="12">
                                    <v-btn type="submit" block class="login">로그인</v-btn>
                                </v-col>
                            </v-row>
                            <v-row class="mt-4">
                                <v-col cols="4">
                                    <v-btn :to="{ path: '/member/create' }" block>회원가입</v-btn>
                                </v-col>
                                <v-divider color="#ffffff" vertical></v-divider>
                                <v-col cols="4">
                                    <v-btn type="submit" block>이메일 찾기</v-btn>
                                </v-col>
                                <v-divider color="#ffffff" vertical></v-divider>
                                <v-col cols="4">
                                    <v-btn type="submit" block>비밀번호 찾기</v-btn>
                                </v-col>

                            </v-row>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
        <ResetPasswordModal v-model="resetPassword" @update:dialog="resetPassword = $event"></ResetPasswordModal>
    </v-container>
</template>

<script>
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import ResetPasswordModal from '../ResetPasswordModal.vue'

export default {
    components: {
        ResetPasswordModal
    },
    data() {
        return {
            email: "",
            password: "",
            role: "일반 사용자",
            resetPassword: false
        }
    },
    methods: {
        async doLogin() {
            try {
                if (this.role == '일반 사용자') {
                    this.role = 'USER'
                } else {
                    this.role = "OWNER"
                }
                const loginData = {
                    email: this.email,
                    password: this.password,
                    role: this.role
                }
                console.log(loginData);
                const response = await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/doLogin`, loginData);
                const token = response.data.result.token;
                const refreshToken = response.data.result.refreshToken;
                const role = jwtDecode(token).role;
                localStorage.setItem('token', token)
                localStorage.setItem('refreshToken', refreshToken)
                localStorage.setItem('role', role)
                window.location.href = "/"
                // this.$router.push("/")
            } catch (e) {
                const error_message = e.response.data.error_message
                console.error(error_message);
                alert(error_message);
            }
        },
        showPassWordModal() {
            this.resetPassword = true;
        }

    }
}
</script>

<style scoped>
.v-card {
    background-color: #1d1d1d;
    color: white;
}

.custom-input .v-input__slot {
    background-color: #1d1d1d !important;
}

.custom-input .v-input__control {
    border-bottom: 2px solid #FF0066;
    background-color: #1d1d1d;
}

.custom-input .v-label {
    font-size: 12px !important;
    color: gray !important;
}

.v-text-field__details,
.v-select__details {
    display: none;
}

.v-btn {
    background-color: #1d1d1d;
    color: #ffffff;
    font-size: 12px !important;
    font-weight: 300;
}

.v-btn:hover {
    background-color: #1d1d1d !important;
    /* 배경색을 기본 색상으로 설정 */
    color: #ffffff !important;
    /* 텍스트 색상도 기본 색상으로 유지 */
}

.login {
    background-color: #FF0066;
    color: #ffffff;
    font-weight: 600;

}
</style>