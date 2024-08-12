<template>

    <v-row justify="center">
        <v-col cols="4">
            <v-btn :to="{ path: '/mypage' }" block>마이페이지</v-btn>
        </v-col>
        <v-col cols="4">
            <v-btn :to="{ path: '/member/wishlist' }" block>찜한 목록</v-btn>
        </v-col>
        <v-col cols="4">
            <v-btn :to="{ path: '/review/myall' }" block>내가 쓴 후기</v-btn>
        </v-col>
    </v-row>


</template>
<script>
export default {}
</script>