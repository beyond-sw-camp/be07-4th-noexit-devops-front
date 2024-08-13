<template>

    <v-col cols="12" md="3">
        <div class="gray-background">
            <v-row>
                <v-col cols="6">
                    <v-row align="center">
                        <!-- <h1>회원 등급: {{ membershipGrade }}</h1> -->
                        <div>회원 등급</div>
                        <v-col cols="12">
                            <h1>GOLD</h1>
                        </v-col>
                    </v-row>
                    <v-divider class="white-divider"></v-divider>
                </v-col>
            </v-row>


            <v-row>
                <v-col cols="6">
                    <v-row align="center">
                        <div>사용가능한 쿠폰</div>
                        <v-col cols="12">
                            <h1>3</h1>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <v-row justify="center">
            <v-col cols="12">
                <v-btn :to="{ path: '/mypage' }" block>마이페이지</v-btn>
            </v-col>
            <v-col cols="12">
                <v-btn :to="{ path: '/wishlist' }" block>찜한 목록</v-btn>
            </v-col>
            <v-col cols="12">
                <v-btn :to="{ path: '/review/myall' }" block>내가 쓴 후기</v-btn>
            </v-col>
        </v-row>
    </v-col>

</template>
<script>
export default {}
</script>

<style scoped>
.gray-background {
    background-color: #565656;
    padding: 20px;
    color: white;
    margin-bottom: 30px;
}
</style>
