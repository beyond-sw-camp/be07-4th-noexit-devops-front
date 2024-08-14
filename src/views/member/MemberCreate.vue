<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="4" md="6">
                <v-card>
                    <v-card-title class="text-h5">회원가입</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="memberCreate">
                            <v-select label="role" :items="['일반 사용자', '점주 사용자']" v-model="role" required></v-select>
                            <v-file-input label="프로필 이미지" accept="image/*" @change="fileUpdate" required>
                            </v-file-input>
                            <v-text-field label="이름" v-model="username" required></v-text-field>
                            <v-text-field v-if="this.role == '일반 사용자'" label="닉네임" v-model="nickname"
                                required></v-text-field>
                            <v-row>
                                <!-- 이메일 인증 끝나면 입력칸을 꽉채우는 식으로 -->
                                <v-col :cols="emailColSize">
                                    <v-text-field label="이메일" v-model="email" type="email" required></v-text-field>
                                </v-col>
                                <v-col cols="3">
                                    <v-btn @click="requestVerificationCode" v-if="showRequestBtn">이메일 인증</v-btn>
                                </v-col>
                            </v-row>
                            <!-- 이메일 인증 누르면  인증번호 입력칸 보여줌-->
                            <v-text-field v-if="showOtpInput" label="인증 코드" v-model="otp" required></v-text-field>
                            <v-btn v-if="showOtpInput" @click="verifyCode">인증 코드 확인</v-btn>

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
                        phoneNumber: this.phoneNumber,
                    };
                    registerData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
                    registerData.append("file", this.profileImage); // 이미지 파일 추가
                    console.log(data)
                    await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/owner/create`, registerData);
                }
                this.$router.push("/"); //메인페이지로 이동

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
                await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/email/requestCode?email=${this.email}`);
            } catch (error) {
                console.error(error);
                alert('이메일 인증 코드 전송에 실패했습니다.');
            }
        },
        async verifyCode() {
            try {
                console.log(this.otp)
                console.log(typeof (this.otp))
                await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/email/requestCode?email=${this.email}&code=${this.otp}`);
                alert('이메일 인증에 성공했습니다!');
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
