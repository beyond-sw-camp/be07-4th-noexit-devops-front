<template>

    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="4" md="6">
                <v-card>
                    <v-card-title class="text-h5">회원가입</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="memberCreate">
                            <v-file-input label="상품 이미지" accept="image/*" @change="fileUpdate" required>
                            </v-file-input>
                            <v-select label="role" :items="['일반 사용자', '점주 사용자']" v-model="role"></v-select>
                            <v-text-field label="이름" v-model="username" required></v-text-field>
                            <v-text-field v-if="this.role == '일반 사용자'" label="닉네임" v-model="nickname"
                                required></v-text-field>
                            <v-row>
                                <v-col cols="9">
                                    <v-text-field label="이메일" v-model="email" type="email" required>
                                    </v-text-field>

                                </v-col>
                                <v-col cols="3">
                                    <!-- 이메일 인증 버튼 누르면 otp-input -->
                                    <v-btn>이메일 인증</v-btn></v-col>
                            </v-row>

                            <v-text-field label="비밀번호" v-model="password" type="password">
                            </v-text-field>
                            <v-text-field v-if="this.role == '일반 사용자'" label=" 나이" v-model="age"
                                required></v-text-field>
                            <v-text-field v-if="this.role == '점주 사용자'" label="가게 이름" v-model="storeName"
                                required></v-text-field>
                            <v-text-field label="전화번호" v-model="phone_number" required></v-text-field>

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
            username: "",
            email: "",
            password: "",
            age: null,
            phone_number: "",
            nickname: "",
            role: "",
            storeName: "",
            profileImage: "",
        }
    },
    methods: {
        async memberCreate() {
            try {
                let registerData = new FormData();

                if (this.role == '일반 사용자') {
                    const data = {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        age: parseInt(this.age),
                        phone_number: this.phone_number,
                        nickname: this.nickname,
                    };

                    console.log(data);

                    registerData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
                    registerData.append("file", this.profileImage);
                    await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/member/create`, registerData);
                } else if (this.role == '점주 사용자') {
                    const data = {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        storeName: this.storeName,
                        phone_number: this.phone_number,
                    };

                    console.log(data);

                    registerData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
                    registerData.append("file", this.profileImage); // 이미지 파일 추가

                    await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/owner/create`, registerData);
                }
                this.$router.push("/");

            } catch (e) {
                const error_message = e.response.data.error_message
                console.error(error_message);
                alert(error_message);
            }

        },
        fileUpdate() {
            this.profileImage = event.target.files[0]
        },
    }
}
</script>
