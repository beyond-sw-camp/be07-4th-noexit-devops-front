<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12">
                <v-card class="loginpage" style=" background-color: #1b1b1b; color:#ffffff;">
                    <v-card-title>로그인</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="doLogin">
                            <v-select label="role" :items="['일반 사용자', '점주 사용자']" v-model="role" hide-details dense
                                outlined class="custom-input mb-4"></v-select>
                            <v-text-field label="이메일 주소" v-model="email" type="email" required hide-details
                                class="custom-input"></v-text-field>
                            <v-text-field label="비밀번호" v-model="password" type="password" required hide-details
                                class="custom-input mb-4"></v-text-field>
                            <v-row class="mt-4 login-col">
                                <v-col cols="12">
                                    <v-btn type="submit" block class="login">로그인</v-btn>
                                </v-col>
                            </v-row>
                            <v-row class="mt-4">
                                <v-col cols="4">
                                    <v-btn :to="{ path: '/member/create' }" block>
                                        회원가입
                                    </v-btn>
                                </v-col>
                                <v-divider vertical></v-divider>
                                <v-col cols="4">
                                    <v-btn :to="{ path: '/' }" block>이메일 찾기</v-btn>
                                </v-col>
                                <v-divider vertical></v-divider>
                                <v-col cols="4">
                                    <v-btn :to="{ path: '/' }" block>비밀번호 찾기</v-btn>
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
                // const roleValue = this.role === '일반 사용자' ? 'USER' : 'OWNER';
                console.log(this.role)
                let roleValue = 'USER';
                if (this.role == '점주 사용자') {
                    roleValue = 'OWNER'
                }
                const loginData = {
                    email: this.email,
                    password: this.password,
                    role: roleValue
                }
                console.log(loginData)

                const response = await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/doLogin`, loginData);
                const token = response.data.result.token;
                const refreshToken = response.data.result.refreshToken;
                const role = jwtDecode(token).role;
                localStorage.setItem('token', token)
                localStorage.setItem('refreshToken', refreshToken)
                localStorage.setItem('role', role)

                if (this.role == '일반 사용자') {
                    window.location.href = "/"
                } else {
                    this.$router.push("/resview")
                    // window.location.href = "/"
                }
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
.v-card-text>.v-form>.v-text-field,
.v-btn {
    all: unset;
}

* {
    background-color: #1b1b1b;
    color: #ffffff;
}

.v-card-title {
    font-weight: 900
}

.v-card:hover {
    background-color: #1b1b1b;
    box-shadow: none;
}

.v-btn:hover {
    background-color: #ff0066;
    color: white;
}


.custom-input .v-input__control {
    height: 40px;
}


input.v-field__input {
    font-size: 10px;
    background-color: rgba(27, 27, 27, 100);
}

.v-btn {
    text-align: center;
    justify-content: center;
}

.login {
    height: 60px;
    width: 100%;
    background-color: #ff0066;
    color: white;
    border-radius: 5px;
}
</style>