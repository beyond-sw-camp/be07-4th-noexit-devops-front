<template>
    <v-col cols="12" md="3" class="fixed-column" style=" background-color: #1b1b1b; color:#ffffff;">
        <div class="gray-background">
            <v-row>
                <v-col cols="12">
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

            <!-- 
            <v-row>
                <v-col cols="12">
                    <v-row align="center">
                        <div>사용가능한 쿠폰</div>
                        <v-col cols="12">
                            <h1>3</h1>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row> -->
        </div>

        <v-row class="button-container" style=" background-color: #1b1b1b; color:#ffffff;">
            <v-toolbar-title class="d-flex align-center">
                <v-col class="link-col">
                    <v-btn text :to="{ path: '/mypage' }" block :class="{ active: isActive('/mypage') }"
                        class="link-btn">
                        마이페이지
                    </v-btn>
                </v-col>
                <v-col class="link-col">
                    <v-btn text :to="{ path: '/reservation/list' }" block
                        :class="{ active: isActive('/reservation/list') }" class="link-btn">예약 내역</v-btn>
                </v-col>
                <v-col class="link-col">
                    <v-btn text :to="{ path: '/review/myall' }" block :class="{ active: isActive('/review/myall') }"
                        class="link-btn">
                        내가 쓴
                        후기</v-btn>
                </v-col>
                <v-col class="link-col">
                    <v-btn text :to="{ path: '/wishlist' }" block :class="{ active: isActive('/wishlist') }"
                        class="link-btn">
                        위시리스트
                    </v-btn>
                </v-col>
            </v-toolbar-title>

        </v-row>
    </v-col>
</template>
<script>
export default {
    props: {
        wishList: {
            type: Array,
            required: true
        }
    }, methods: {
        isActive(path) {
            return this.$route.path === path;
        },
    }
}
</script>

<style scoped>
.v-btn {
    all: unset;
    /* 모든 스타일 초기화 */
}

.gray-background {
    background-color: #565656;
    padding: 30px 40px;
    color: white;
    margin-bottom: 30px;
}

.v-toolbar-title {
    width: 100%;
}

.link-btn {
    font-size: 20px;
    font-weight: 400;
    position: relative;
    color: white;
}

.link-btn:hover {
    color: #919191;

}

.link-btn.active {
    background-color: rgba(27, 27, 27, 100);
    border-bottom: 1px solid red;

}
</style>