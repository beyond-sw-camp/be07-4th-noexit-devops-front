<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="2" md="4">
                <v-card>
                    <v-card-title class="text-h5 text-center">로그인</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="doLogin">
                            <v-select label="role" :items="['일반 사용자', '점주 사용자']" v-model="role"></v-select>
                            <v-text-field label="email" v-model="email" type="email" required></v-text-field>
                            <v-text-field label="비밀번호" v-model="password" type="password" required></v-text-field>
                            <v-row>
                                <!-- <v-col>
                                    <v-btn block @click="showPassWordModal">비밀번호 변경</v-btn>
                                </v-col> -->

                                <v-col cols="4">
                                    <v-btn type="submit" block>로그인</v-btn>
                                </v-col>
                                <v-col cols="4">
                                    <v-btn type="submit" block>이메일 찾기</v-btn>
                                </v-col>
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
                // const refreshToken = response.data.result.refreshToken;
                const role = jwtDecode(token).role;
                localStorage.setItem('token', token)
                // localStorage.setItem('refreshToken', refreshToken)
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