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
            { key: "전화번호", value: this.memberInfo.phoneNumber },

        ];
        console.log(this.memberInfoList);

    }
}
</script>