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

        <v-row>
            <v-col>
                <!-- <v-list-subheader>이름</v-list-subheader> -->
                <v-img> 이미지 </v-img>
            </v-col>
            <v-col align="end">
                <v-btn>프로필 수정</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- <v-list-subheader>이름</v-list-subheader> -->
                <v-text-field label="이름" placeholder="사용자 정보 자동으로 입력되게끔" type="text"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- <v-list-subheader>닉네임</v-list-subheader> -->
                <v-text-field label="닉네임" placeholder="사용자 정보 자동으로 입력되게끔" type="text"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- <v-list-subheader>이메일</v-list-subheader> -->
                <v-text-field label="이메일" placeholder="사용자 정보 자동으로 입력되게끔" type="email"></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <!-- <v-list-subheader>전화번호</v-list-subheader> -->
                <v-text-field label="전화번호" placeholder="사용자 정보 자동으로 입력되게끔" type="email"></v-text-field>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {}
    }
}
</script>