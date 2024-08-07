<template>

    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="4" md="6">
                <v-card>
                    <v-card-title class="text-h5">회원가입</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="memberCreate">

                            <v-text-field label="이름" v-model="name" required>
                            </v-text-field>
                            <v-row>
                                <v-col cols="9">
                                    <v-text-field label="이메일" v-model="email" type="email" required>
                                    </v-text-field>

                                </v-col>
                                <v-col cols="3">
                                    <!-- 이메일 인증 버튼 누르면 otp-input -->
                                    <v-btn @click="showEmailModal">이메일 인증</v-btn></v-col>
                            </v-row>

                            <v-text-field label="비밀번호" v-model="password" type="password">
                            </v-text-field>
                            <v-text-field label="나이" v-model="age" required></v-text-field>
                            <v-text-field label="전화번호" v-model="phone_number" required></v-text-field>
                            <v-text-field label="닉네임" v-model="nickname" required></v-text-field>
                            <v-btn type="submit" block>회원가입</v-btn>

                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
    <EmailModal v-model="resetPassword" @update:dialog="resetPassword = $event"></EmailModal>

</template>

<script>
import axios from 'axios'
import EmailModal from './EmailModal.vue';

export default {
    components: {
        EmailModal,
    },
    data() {
        return {
            name: "",
            email: "",
            password: "",
            age: "",
            phone_number: "",
            nickname: "",
        }
    },
    methods: {
        async memberCreate() {
            try {
                const registerData = {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    age: this.age,
                    phone_number: this.phone_number,
                    nickname: this.nickname
                }
                await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/member/create`, registerData);
                this.$router.push("/");
            } catch (e) {
                const error_message = e.response.data.error_message
                console.error(error_message);
                alert(error_message);
            }

        }
    }
}
</script>
