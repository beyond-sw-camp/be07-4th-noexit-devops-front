<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="4">
                <v-btn :to="{ path: '/mypage' }" block>마이페이지</v-btn>
            </v-col>
            <v-col cols="4">
                <v-btn :to="{ path: '/wishlist' }" block>찜한 목록</v-btn>
            </v-col>
            <v-col cols="4">
                <v-btn :to="{ path: '/reviewList' }" block>내가 쓴 후기</v-btn>
            </v-col>
        </v-row>

        <v-card-text>
            <!-- 이미지는 dto에 존재하지 않아서 어떻게 가져와야할지 추후 수정필요 -->
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" v-if="isEditing" @click="updateMember">
                    저장
                </v-btn>
                <v-btn color="primary" v-if="!isEditing" @click="updaetIsEditing">
                    프로필 수정
                </v-btn>
                <v-btn color="secondary" v-if="isEditing" @click="updaetIsEditing">
                    취소
                </v-btn>
            </v-card-actions>
            <v-form v-for="element in memberInfoList" :key="element.id">
                <v-text-field :label="element.key" v-model="element.name">{{ element.value }}</v-text-field>
            </v-form>
        </v-card-text>

    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            memberInfo: {},
            memberInfoList: [],
            isEditing: false,
        }
    },
    async created() {
        const response = await axios.get(`${process.env.VUE_APP_API_BASIC_URL}/member/myInfo`);
        this.memberInfo = response.data.result;
        this.memberInfoList = [
            // { key: "프로필이미지", value: this.memberInfo.image },
            { key: "이름", value: this.memberInfo.username },
            { key: "닉네임", value: this.memberInfo.nickname },
            { key: "이메일", value: this.memberInfo.email },
            // { key: "비밀번호", value: this.memberInfo.password },
            { key: "전화번호", value: this.memberInfo.phoneNumber },

        ];
        console.log(this.memberInfoList);
    },
    methods: {
        async updateMember() {
            try {
                // 수정된 정보로 업데이트
                const updateData = {
                    name: this.name,
                    email: this.email,
                    password: this.memberInfo.password,
                    age: this.age,
                    phone_number: this.phone_number,
                    nickname: this.nickname
                }
                await axios.post(`${process.env.VUE_APP_API_BASIC_URL}/member/update`, updateData);
                window.location.reload();
            } catch (e) {
                const error_message = e.response.data.error_message
                console.error(error_message);
                alert(error_message);
            }
        },
        updaetIsEditing() {
            this.isEditing = !this.isEditing
        }
    }
}

</script>