<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12">
                <v-card style=" background-color: #1b1b1b; color:#ffffff;">
                    <v-card-title class="title">회원가입</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="memberCreate">
                            <v-select label="role" :items="['일반 사용자', '점주 사용자']" v-model="role" required
                                hide-details></v-select>
                            <v-file-input label="프로필 이미지" accept="image/*" @change="fileUpdate" hide-details>
                            </v-file-input>
                            <v-text-field label="이름" v-model="username" required hide-details></v-text-field>
                            <v-text-field v-if="this.role == '일반 사용자'" label="닉네임" v-model="nickname" required
                                hide-details></v-text-field>
                            <v-row align="center">
                                <!-- 이메일 인증 끝나면 입력칸을 꽉채우는 식으로 -->
                                <v-col :cols="emailColSize">
                                    <v-text-field label="이메일" v-model="email" type="email" required
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn @click="requestVerificationCode" v-if="showRequestBtn" class="email-btn">이메일
                                        인증</v-btn>
                                </v-col>
                            </v-row>
                            <!-- 이메일 인증 누르면  인증번호 입력칸 보여줌-->
                            <v-row align="center">
                                <v-col :cols="emailColSize">
                                    <v-text-field v-if="showOtpInput" label="인증 코드" v-model="otp" required
                                        hide-details></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn v-if="showOtpInput" @click="verifyCode" class="email-btn">인증 코드 확인</v-btn>
                                </v-col>
                            </v-row>
                            <v-text-field label="비밀번호" v-model="password" type="password" hide-details>
                            </v-text-field>
                            <v-text-field v-if="this.role == '일반 사용자'" label=" 나이" v-model="age"
                                required></v-text-field>
                            <v-text-field v-if="this.role == '점주 사용자'" label="가게 이름" v-model="storeName"
                                required></v-text-field>
                            <v-text-field label="전화번호" v-model="phone_number" required></v-text-field>
                            <v-btn type="submit" block class="join-btn">회원가입</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
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
            otp: "",
            showOtpInput: false,
            showRequestBtn: true,
        }
    },
    computed: {
        emailColSize() {
            return this.showRequestBtn ? 9 : 12;
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
                    registerData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
                    registerData.append("file", this.profileImage);
                    await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/member/create`, registerData);
                } else if (this.role == '점주 사용자') {
                    const data = {
                        username: this.username,
                        email: this.email,
                        password: this.password,
                        storeName: this.storeName,
                        phoneNumber: this.phone_number,
                    };
                    registerData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
                    registerData.append("file", this.profileImage); // 이미지 파일 추가
                    console.log(data)
                    await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/owner/create`, registerData);
                }
                this.$router.push("/login");

            } catch (e) {
                const error_message = e.response.data.error_message
                console.error(error_message);
                alert(error_message);
            }

        },
        fileUpdate() {
            this.profileImage = event.target.files[0]
        },
        async requestVerificationCode() {
            try {
                this.showOtpInput = true;
                console.log(this.email)
                const response = await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/email/requestCode?email=${this.email}`);
                alert(response.data.status_message);
            } catch (error) {
                console.error(error);
                alert('이메일 인증 코드 전송에 실패했습니다.');
            }
        },
        async verifyCode() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/email/requestCode?email=${this.email}&code=${this.otp}`);
                alert(response.data.status_message);
                this.showOtpInput = false;
                this.showRequestBtn = false;
            } catch (error) {
                console.error(error);
                alert('인증 코드가 올바르지 않습니다.');
            }
        }
    }
}
</script>

<style>
.v-card-title {
    font-weight: 900
}

.email-btn {
    border: 1px solid #FF0066;
    background-color: #1b1b1b;
    color: #ffffff;
    padding: 10px;
}

.join-btn {
    height: 60px;
    width: 100%;
    background-color: #ff0066;
    color: white;
    border-radius: 5px;
}
</style>