<template>
    <v-col cols="12" md="3" style=" background-color: #1b1b1b; color:#ffffff;">
        <div class="gray-background">
            <v-row>
                <v-col>
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
                <v-col cols="12">
                    <v-row align="center">
                        <div>사용가능한 쿠폰</div>
                        <v-col cols="12">
                            <h1>3</h1>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>

        <v-row class="button-container">
            <v-col cols="12">
                <v-btn :to="{ path: '/mypage' }" block class="custom-button" elevation="0" color="transparent" text>
                    마이페이지
                </v-btn>
            </v-col>
            <v-col cols="12">
                <v-btn :to="{ path: '/reservation/list' }" block class="custom-button">예약 내역</v-btn>
            </v-col>
            <v-col cols="12">
                <v-btn :to="{ path: '/review/myall' }" block class="custom-button">내가 쓴 후기</v-btn>
            </v-col>
        </v-row>
    </v-col>
</template>
<script>
export default {}
</script>

<style>
.gray-background {
    background-color: #565656;
    padding: 20px;
    color: white;
    margin-bottom: 30px;
}

.button-container {
    margin-top: 10px;
}

.custom-button {
    border: none;
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 5px;
    text-transform: none;
    padding: 0;
}
</style>
